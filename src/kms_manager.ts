import * as AWS from "@aws-sdk/client-kms";
import { EncryptRequest } from "@aws-sdk/client-kms";

export class KmsManager {
  private kmsClient: AWS.KMS;

  constructor(
    private readonly dataKeyId: string,
    awsKey: string,
    awsSecret: string,
    region: string,
  ) {
    this.kmsClient = new AWS.KMS();
  }

  async encrypt(src: string): Promise<string> {
    AWS.EncryptRequestFilterSensitiveLog;
    const srcBytes = Buffer.from(src);
    const resp = await this.kmsClient.encrypt({
      KeyId: this.dataKeyId,
      Plaintext: Buffer.from(src),
    });
    console.info("The encryption algorithm is " + resp.EncryptionAlgorithm);

    // Get the encrypted data.
    const encryptedData = resp.CiphertextBlob || "";
    console.info(`result is ${encryptedData.toString()}`);
    return Buffer.from(encryptedData).toString("base64");
  }

  // public decrypt(src: string): string {
  // try {
  // console.info("start decrypt src: $src")
  // const srcBytes = SdkBytes.fromByteArray(BinaryUtils.fromBase64(src))
  // const decryptRequest =
  // DecryptRequest.builder.ciphertextBlob(srcBytes).keyId(dataKeyId).build
  // const resp = this.kmsClient.decrypt(decryptRequest)
  // return resp.plaintext.asUtf8String()
  // } catch(e) {
  // switch(e){
  // case e: KmsException =>
  // console.error("kms decrypt exception", e)
  // case e: Exception =>
  // console.error("kms decrypt throw other exception", e)
  // }
  // }
  // }
}
