const { SignProtocolClient, EvmChains, SpMode } = require('@ethsign/sp-sdk');
const { privateKeyToAccount } = require('viem/accounts');
const hash = require('json-hash');
require('dotenv').config();

async function main() {
  const { ncrypt } = require('ncrypt-js');

  const _secretKey = 'some-super-secret-key';
  const object = {
    NycryptJs: 'is cool and fun.',
    You: 'should try it!',
  };

  const ncryptObject = new ncrypt('ncrypt-js');

  // encrypting super sensitive data here
  const encryptedObject = ncryptObject.encrypt(object);
  console.log('Encryption process...');
  console.log('Plain Object     : ', object);
  console.log(`Encrypted Object : ${encryptedObject}`);

  // decrypted super sensitive data here
  const decryptedObject = ncryptObject.decrypt(encryptedObject);
  console.log('... and then decryption...');
  console.log('Decipher Text : ', decryptedObject);
  console.log('...done.');
}

main();
