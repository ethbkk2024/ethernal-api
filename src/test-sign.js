const { SignProtocolClient, EvmChains, SpMode } = require('@ethsign/sp-sdk');
require('dotenv').config();

async function main() {
  const privateKey = '0x1862BDB78aD1F0914aedd3673CC5cCbf561B6f73';
  const client = new SignProtocolClient(SpMode.OnChain, {
    chain: EvmChains.baseSepolia,
    account: privateKey, // Optional, depending on environment
  });
  console.log(client);

  try {
    const createSchemaRes = await client.createSchema({
      name: 'xxx',
      data: [{ name: 'name', type: 'string' }],
    });
  } catch (error) {
    console.log(error);
  }
  //
  // console.log(res);
}

main();
