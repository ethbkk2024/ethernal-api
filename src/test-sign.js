const { SignProtocolClient, EvmChains, SpMode } = require('@ethsign/sp-sdk');
const { privateKeyToAccount } = require('viem/accounts');
require('dotenv').config();

async function main() {
  const privateKey =
    '2ef78c5b711f4f90d60a79a5ad4e9d9285b292ba47065392f77b27062ae3aee1';
  const client = new SignProtocolClient(SpMode.OffChain, {
    chain: EvmChains.baseSepolia,
    account: privateKeyToAccount(privateKey), // Optional, depending on environment
  });
}

main();
