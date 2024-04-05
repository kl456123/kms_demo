import { EnclaveClient } from "./enclave_client";
import { TxPayloadEIP1559 } from "./types";
import { ethers, Signer } from "ethers";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const rpcUrl = `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`;
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const { chainId } = await provider.getNetwork();

  const awsKey = process.env.AWS_KEY || "";
  const awsSecret = process.env.AWS_SECRET || "";
  const enclaveUri = process.env.ENCLAVE_URI || "";
  const kmsDataKey = process.env.REQUEST_KEY || "";

  const eoa = process.env.ADDRESS || "0x";

  const enclave_client = new EnclaveClient(
    enclaveUri,
    kmsDataKey,
    awsKey,
    awsSecret,
  );
  const secretId = process.env.SECRET_PRIVATE_KEY || "";
  const { maxFeePerGas, maxPriorityFeePerGas } = await provider.getFeeData();
  const tx = {
    from: eoa,
    data: "0x",
    to: ethers.ZeroAddress,
    nonce: await provider.getTransactionCount(eoa),
    value: ethers.parseEther("0"),
    gasLimit: undefined,
    maxPriorityFeePerGas,
    maxFeePerGas,
  };

  tx.gasLimit = await provider.estimateGas(tx);
  const txPayload: TxPayloadEIP1559 = {
    nonce: tx.nonce!,
    gas: tx.gasLimit.toString(),
    to: tx.to!,
    value: tx.value!.toString(),
    data: tx.data ?? "0x",
    chainId: parseInt(chainId.toString()),
    maxPriorityFeePerGas: tx.maxPriorityFeePerGas!.toString(),
    maxFeePerGas: tx.maxFeePerGas!.toString(),
  };

  const { sig, hash } = await enclave_client.sign(txPayload, secretId);
  const rawTx = await provider.broadcastTransaction(sig);
  await rawTx.wait();
}

main();
