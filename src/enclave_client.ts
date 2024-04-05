import axios from "axios";
import { KmsManager } from "./kms_manager";
import {
  TxPayloadEIP1559,
  EnclaveL1TxReq,
  EnclaveReq,
  EnclaveRes,
  EnclaveSignType,
} from "./types";
import { ethers } from "ethers";

export class EnclaveClient {
  private kmsManager: KmsManager;

  constructor(
    private readonly enclaveUri: string,
    private readonly kmsDataKey: string,
    awsKey: string,
    awsSecret: string,
  ) {
    this.kmsManager = new KmsManager(
      kmsDataKey,
      awsKey,
      awsSecret,
      "us-east-2",
    );
  }

  async sign(tx: TxPayloadEIP1559, secretId: string): Promise<EnclaveRes> {
    const reqJson = await this.toL1TxReqJson(tx, secretId);
    return this.doPost(reqJson);
  }

  async doPost(jsonStr: string): Promise<EnclaveRes> {
    try {
      const res = await axios.post(this.enclaveUri, jsonStr);
      const data = res.data as {
        transaction_signed: string;
        transaction_hash: string;
      };
      return {
        sig: data.transaction_signed,
        hash: data.transaction_hash,
        success: true,
      };
    } catch (e) {
      throw e;
    }
  }

  private async toL1TxReqJson(
    payload: TxPayloadEIP1559,
    secretId: string,
  ): Promise<string> {
    const payloadJson = JSON.stringify(payload);

    const plainText = JSON.stringify({
      method: "sign_transaction",
      transaction_payload: payloadJson,
      secretId,
      sign_type: EnclaveSignType.ecdsaEIP1559,
    });
    const reqHash = await this.kmsManager.encrypt(
      ethers.keccak256(ethers.toUtf8Bytes(payloadJson)),
    );
    return JSON.stringify({
      req: plainText,
      reqHash,
    });
  }
}
