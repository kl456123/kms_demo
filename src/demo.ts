import { EnclaveClient } from "./enclave_client";
import { TxPayloadEIP1559 } from "./types";
import { ethers, Signer } from "ethers";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const rpcUrl = `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`;
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const { chainId } = await provider.getNetwork();
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY || "", provider);

  const awsKey = "";
  const awsSecret = "";
  const enclaveUri = process.env.ENCLAVE_URI || "";
  const kmsDataKey = "";

  const enclave_client = new EnclaveClient(
    enclaveUri,
    kmsDataKey,
    awsKey,
    awsSecret,
  );
  const secretId = "";
  const tx = await wallet.populateTransaction({
    to: ethers.ZeroAddress,
    value: ethers.parseEther("1"),
  });
  const txPayload: TxPayloadEIP1559 = {
    nonce: tx.nonce!,
    gas: tx.gasLimit!.toString(),
    to: tx.to!,
    value: tx.value!.toString(),
    data: tx.data ?? "0x",
    chainId: parseInt(chainId.toString()),
    maxPriorityFeePerGas: tx.maxPriorityFeePerGas!.toString(),
    maxFeePerGas: tx.maxFeePerGas!.toString(),
  };

  const { sig, hash } = await enclave_client.sign(txPayload, secretId);
  // const btx = ethers.Transaction.from(tx);
  // btx.signature = sig;
  // const rawTx = await provider.broadcastTransaction(btx.serialized);
  // await rawTx.wait();
}

main();
