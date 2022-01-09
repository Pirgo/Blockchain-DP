const crypto = require('crypto');
const uuid = require('uuid');
// version 1 use timestamp to generate unique ids

class ChainUtil{
    static genKeyPair(){
        return crypto.generateKeyPairSync("rsa", {
            modulusLength: 2048,
            publicKeyEncoding: {
                'type': 'spki',
                'format': 'pem',
             },
             privateKeyEncoding: {
                'type': 'pkcs8',
                'format': 'pem',
                'cipher': 'aes-256-cbc',
                'passphrase': 'passphrase'
             }});
    }
    static id(){
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
//     'passphrase': 'Lecturer1'
// });

// const haslo = "verified/8912375894375"

// const encrypted = crypto.privateEncrypt(privateKey,
//     Buffer.from(haslo, 'base64'))
// console.log(encrypted.toString('base64'))


//  let encodedPublicKey = "-----BEGIN PUBLIC KEY-----\nMIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAqYZoCUj8qMln54l9gt4j\nT2Tx97QeWqtqWb7mHrDM60Ad5bWrETewQ3S360TBKQ+AmJp6xUk+4mSbIRP6mYJV\n7TahzWX5wasvbp1kKsKpexdN5Ld3esDqGe1iMW5qHxV/oVwiz1pqfTjOjHqIuWIG\n0yICRz1yv5F2UdSemFJx8KlMw5/6MQ5uoeJsYz71H7+gQB1xnfqjWcNtSQTv9dpp\nn0Ggem3D+xdJh+o/2UftKa3JKuGZXAdXe12S3L+8XLeyV1dIPV57E1W/8pHm1Oqj\n9WbUquqfOXUlKoEPm0g3W2j5H1cEYgkz5Es5mKKVsrFcxBoj1s/ydfVz8kgbdfVc\ncGaEX97rY3/UkfzhMx3fF+idyaEndAgv909pvABHPc94IQfO/RD2tlPfalMgW6NQ\nLA6lWHFTA/OSzHoOaHfPgXWqzBz3O05qdYPyE8Bqxxj7g2F6Bb2U9OF+SJphhtew\nYy2oZLZVO6gPh2/d6LQ/3wufquvGw8mY43M+YGzPIaqk9CRlxAYdPG0T8dU4VfZt\n+xIyn5XaPC3yC7nrQMIBC8vkm2tq8hyyDwWE9BCczx/PyUti5cQ4PyNa32Dgm02e\nkmHNTKZuBB44hj1e8FSSEZ78u8sl92Sx+spWB2TW7F7TPYIJ2cZPNbh/opRZl5ed\nagLOUD7sx/+dyt8eXRVMv5MCAwEAAQ==\n-----END PUBLIC KEY-----\n"


// var publicKey = crypto.createPublicKey({
//     'key': encodedPublicKey,
//     'type': 'spki',
//     'format': 'pem'
// });

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


