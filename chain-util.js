const crypto = require("crypto");
const uuid = require("uuid");
// version 1 use timestamp to generate unique ids

class ChainUtil {
  static randomString(length) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  static convertPrivateKeyString(keyString){
    let modifiedKeyString = keyString.replace(/(.{64})/g,"$1\n")
    if(modifiedKeyString.length % 64 !== 0){
      modifiedKeyString += "\n";
    }
    const startKeyString = "-----BEGIN ENCRYPTED PRIVATE KEY-----\n"
    const endKeyString = "-----END ENCRYPTED PRIVATE KEY-----\n"
    return(startKeyString + modifiedKeyString + endKeyString);
  }

  static convertPublicKeryString(keyString){
    let modifiedKeyString = keyString.replace(/(.{64})/g,"$1\n")
    if(modifiedKeyString.length % 64 !== 0){
      modifiedKeyString += "\n";
    }
    const startKeyString = "-----BEGIN PUBLIC KEY-----\n"
    const endKeyString = "-----END PUBLIC KEY-----\n"
    return(startKeyString + modifiedKeyString + endKeyString)
  }

  static createPrivateKey(role, id, keyString) {
    keyString = ChainUtil.convertPrivateKeyString(keyString);
    const passphrase = `${role}${id}`;

    const key = crypto.createPrivateKey({
      key: keyString,
      type: "pkcs8",
      format: "pem",
      cipher: "aes-256-cbc",
      passphrase: passphrase,
    });
    return key;
  }

  static createPublicKey(keyString) {
    keyString = ChainUtil.convertPublicKeryString(keyString)
    const key = crypto.createPublicKey({
      key: keyString,
      type: "spki",
      format: "pem",
    });
    return key;
  }

  static encryptPrivate(key, message) {
    const toEncrypt = message + "/" + ChainUtil.randomString(10);
    const encrypted = crypto.privateEncrypt(
      key,
      Buffer.from(toEncrypt, "base64")
    );
    return encrypted.toString("base64");
  }

  static encryptPublic(key, message) {
    const toEncrypt = message + "/" + ChainUtil.randomString(10);
    const encrypted = crypto.publicEncrypt(
      key,
      Buffer.from(toEncrypt, "base64")
    );
    return encrypted.toString("base64");
  }

  static decryptPrivate(key, message) {
    const decrypted = crypto.privateDecrypt(
      key,
      Buffer.from(message, "base64")
    );
    const decryptedString = decrypted.toString("base64");
    return decryptedString.split("/")[0];
  }

  static decryptPublic(key, message) {
    const decrypted = crypto.publicDecrypt(key, Buffer.from(message, "base64"));
    const decryptedString = decrypted.toString("base64");
    return decryptedString.split("/")[0];
  }

  static getVerificationString() {
    return "verified";
  }

  static getVerificationKey(genesis, id) {
    const lecturers = genesis.data.lecturers;
    for (let i = 0; i < lecturers.length; i++) {
      if (lecturers[i].ID == id) {
        return lecturers[i].key;
      }
    }
    return null;
  }

  static getSignatureKey(genesis, id) {
    const students = genesis.data.students;
    for (let i = 0; i < students.length; i++) {
      if (students[i].ID == id) {
        return students[i].key;
      }
    }
    return null;
  }

  static id() {
    return uuid.v1();
  }
}

module.exports = ChainUtil;