
import EthCrypto from 'eth-crypto';

export async function encryptData(publicKey, message) {
    return await EthCrypto.encryptWithPublicKey(
      publicKey, // publicKey
      message // message
    );
}

export async function decryptData(privateKey, encryptedData) {
  return await EthCrypto.decryptWithPrivateKey(
      privateKey, // privateKey
      encryptedData // encrypted-data
  );
}

export async function signatureToPrivateKey(signedData) {
  return await window.web3.utils.soliditySha3(signedData);
}

export async function publicKeyByPrivateKey(signedData) {
  return await EthCrypto.publicKeyByPrivateKey(signedData);
}
