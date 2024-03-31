export interface EnclaveL1TxReq {
  method: string;
  transaction_payload: string;
  secret_id: string;
  sign_type: number;
}

export interface TxPayloadEIP1559 {
  nonce: number;
  gas: string;
  to: string;
  value: string;
  data: string;
  chainId: number;
  maxPriorityFeePerGas: string;
  maxFeePerGas: string;
}

export interface EnclaveReq {
  req: string;
  reqHash: string;
}

export interface EnclaveRes {
  sig: string;
  hash: string;
  success: boolean;
}

export enum EnclaveSignType {
  ecdsaLegacy,
  ecdsaEIP1559,
  eddsa,
}
