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

  static createPrivateKey(role, id, keyString) {
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

// this.keyPair = ChainUtil.genKeyPair();
// this.publicKey = this.keyPair.getPublic().encode('hex');

// const { publicKey, privateKey } = ChainUtil.genKeyPair();
// console.log(
// 	publicKey.toString('base64')

// )
// console.log("++++++++++++++")
// console.log(privateKey.toString('base64'))

// const privateKey = crypto.createPrivateKey({
//     'key': Buffer.from("MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC7epa8LOXADCQLEz9txHvVzv8tjv4Geq+LVyabA9SIvOd6V/DrgTQpgrqQ9VsZ3vdccTPe/38+s934G+C/f2rMvucH+Psh169P8Oa1W8FsNCAxbPZnbT6EqbKD3a/ZDDmxpXNSBD8v3s9GcyTZJU8/Pa46OCjUs31WnYABSxrBnNwxf8Y7SlzMrJ4OthPijucnFnNTpe9LzwI6YrjPdcOxk/k8p7DyQKcN+H4zQm+sYvur5bA+ETRfTrGSvDch+WZfLj2wq755m3LAGZCGmz24UR1nw5NeMOT7vuHYw2cWOG/6vOgdZLaWoB6NqtQv8NGqf8QjIGsycKw2wMeDgk3jAgMBAAECggEBAJByLT0i4omLUSHvXIl4P2lGqTky2OmpESOsrCP3WYNY+Ig8xXTOAaCSBqi1QdG3BqME3VBNTn7DGpyU7h7dTy4dT+fGn8c9ZOeU1kyZO3fg2YT7TQX3F5ojHVWYMmpqjvEeZrGkcAK0CsNe598ebeZt4ZUdu+fVuxZHF17nvN+6aBUMqHDbLJYaqL3d0IX+8TTXfmjzre47zp54+lM6pm6sRe+/9uqq1NvsyjgWo7uL3th+wgxVJ4pVccmo7bi3hoI4vDO+Ua9hYKSF0pfmRDi+V7Zjjbk1m/4VUjBpvzJnIynrCgbZGGnNHffhrKKyNTlspx7gsxkgG0v2+cys83ECgYEA3l+GCvZ5SMT+e60O+Fl5MSjmygrOAbJf8ia8T8GqIal9LIfGRjq99mhzOeVHrKlqFw+3peYT4HJJD4v2FJSuvxQg06hm8mc3SzyFvyB5aGShC4J4s/6LBWYGnldPNMSZk2DpnliDdUIxHSDgge4+x6Saa3ubBydNqN5magsjJ78CgYEA19Q+OoQPiteHsKFbwbABD2WUDzUukYKMsnmERpPUKYiOlp7jROHI4VgioDzmVLhIyvRY+tMCh7uYdPWiUGqGp5vZrb5bYaVVA/bayoFabEslrenRjI7PxnCM+bWdCq54HApV8zyGKa3hHDBjpJR2aEOtrQpTCV0unGKSkkKGgt0CgYAkUrQhfEspYMw0xXrphCvwpL62B/fIfSuA8WTXHko8/2Nr762qcRPwePVBYrtHb9DdfXrBBYj/o4tdl74VdIfqvE30ZNCUDdoRVwx9wL80FyPbLm+q7wwkUJsKKDbO5sIzOaRPciPe9nXxTRp+/ryQfcmffuw+yeO8jr9p2PHgHwKBgQCXCNn7TQsrWCSGgISbiDVVtvnjoo3SGg+nnc3pLe4cmold8haMz4wp1el1ROjShJu8Gz5hWGS+45KO1o4dxE4y4Kd2JG4CaRaTTZ5SdC749aWKjMOtnwrbjUu6O1OIdAttY/Y93y7r39hWR66TL6mk0Seqnjz5opHJsllrrM5AqQKBgGGgjfkgk0jRonSMo+QWSqEiAbfhkmzKTLht6ON4F07mPSUrStTahSsmo55hF8Ge40zepQsmyp152mYW24jwSkc5SRfhO8XqLzKp0qSzA0LOmIpVRY5JDAtO71A3IXO72V3H5sR4+9/VNnNFt89G3OCUvkqKSchyc+Mi4JXdeycy").toString('base64'),
//     'type': 'pkcs8',
//     'format': 'der'
// })

// let encodedPrivateKeyString = "-----BEGIN ENCRYPTED PRIVATE KEY-----\n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\n-----END ENCRYPTED PRIVATE KEY-----\n"

// var privateKey = crypto.createPrivateKey({
//     'key': encodedPrivateKeyString,
//     'format': 'pem',
//     'type': 'pkcs8',
//     'cipher': 'aes-256-cbc',
//     'passphrase': 'Student3002'
// });

// const haslo = "3001/8912375894375"

// const encrypted = crypto.privateEncrypt(privateKey,
//     Buffer.from(haslo, 'base64'))
// console.log(encrypted.toString('base64'))

// let encodedPublicKey = "-----BEGIN PUBLIC KEY-----\nMIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAun3n2YSJNaw+8Px6yq8p\n0B+bIRGETcstZm4HuqweoU6Hq8e5KbtG3vg1xSq0zGvCWLO6G3a84ZzfKp8BvUxB\nORxE7j6WbKMePJSQmAZ0ivKN3A88V27KsR/uoA46aXmlcPvWqqP8ICXmOZDX2ohk\nIUcTXp/ets8fnK18ma7+LqSU0+MpEv7NRDrof3D4p9B34DDtVFQHhJ3PcMXET4xb\n7tUxl/HAQ3elCIyHbDzLU5yOLZGOFYe8nDz/hV3dvsdCqxvj/c8Az57UyUTTTgLa\n2DnpjCRs2fExGtQgTj1DQvdoRSVENpAa69GqkUKaE8sugWhtCkmNZC7LsuWOPYNy\nx8FwlPbSMl9O4Iqh/0JY9dNVMG7wxsZ9pt6brN8Tz8No98fRItUOa6yuL5AxtrLl\nZx/nK5weNmLdv93tNsd6Mm+ZSJ59QflJlq4hQYUNfIPrnLrSPGzpSqFW3b18KOsQ\nHEX63DXDNPaJy6cC0wkKzu3s4m2VHFHbvbTpioXtqC8I7D5Fgko+NvQP/Nwmff6l\nv2wYFpTewsT6zNzPz9G63nJylXtRf1nRQIRGlyKnag7cxxcLqk9xc9hOGr0Ra77h\n57NNntMx33V/4m0WH0cO5C+s1T1+YzviDGZf3HzS1mh0Vo/Oci0/CmkxHPMVHTDv\n9AJCWy3iHHm/mgzkPlAFI6UCAwEAAQ==\n-----END PUBLIC KEY-----\n"
// let encoded2 = "-----BEGIN PUBLIC KEY-----\nMIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA00FXH3ocP0afxY3WC9BJ\n1uVeH3hcXcM8u2JcGcTU0ODdlozUVC/abeS48+n+dSMJ/6HIe+iJCijc79+hugaQ\n21Lo7H5Ro0N9ytY1O/fTtKQ3JEBDi+IZAfvcWTJnj1eHxIauKWPssw4ZdFpyIKqQ\n2ajWWsqzyx4GgOskL2cWowvQDzGMDYNe03CU0TIu+ElXfXH6bwaifs+sCnpnSBxA\nCRuj/tv/x8dMy4jAkzCo0G7OaFvXp66Io4TCrsijACFgquY/5C+RU3WidaS+L5FS\n2xydRr5oNLtjPfRiDg1M4Ls7lc+8kGqWmetWMxkxBWbTDY9++T9BltZlRNw4hmTn\n6ct9XpavrheUm6FYgiKabXl0vZ8cJMO2wMzbfR/ZIUDRmwmhcvyLhxzBAXVaUv+v\nRe+3VQ/T6gV9CqyecruBv+f82T8FLMyBz6teKw1zmjvU1wd3rhj/egGUrsnMZAkB\nJhoa5kMXTQO+XNi2q0bU9LMJkJkJw/EeZwfly8UZUC2qOsqRop0JozSziGffmiC3\nJDweoOFumNoA5eQ1J/5NekwG6aFBvwsfGezqzLtdHAhKSqywLiO84GwFxIT+D4Js\nHTeoWiSPECYWJHHZyAXmx8/7xkEbm89rTLDDXy8JIKDiyX6E7cP6fkAdRIcUrev0\nVxR9E0lv6YhJfa66ucdZw38CAwEAAQ==\n-----END PUBLIC KEY-----\n"

// var publicKey = crypto.createPublicKey({
//     'key': encoded2,
//     'type': 'spki',
//     'format': 'pem'
// });
// const encrypted = crypto.publicEncrypt(publicKey, Buffer.from(haslo, 'base64'))
// console.log(encrypted.toString('base64'));

// const decrypted = crypto.privateDecrypt(privateKey, encrypted);
// console.log(decrypted.toString('base64'))

// const decrypted = crypto.publicDecrypt(publicKey, encrypted)
// console.log();
// console.log(decrypted.toString('base64'))
// crypto.generateKeyPair('rsa', {
//     'modulusLength': 4096,
//     'publicKeyEncoding': {
//         'type': 'spki',
//         'format': 'pem',
//     },
//     'privateKeyEncoding': {
//         'type': 'pkcs8',
//         'format': 'pem',
//         'cipher': 'aes-256-cbc',
//         'passphrase': 'passphrase'
//     }
// }, (err, publicKey, privateKey) => { console.log(publicKey) })
