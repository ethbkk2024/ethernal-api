require('dotenv').config();
const ethers = require('ethers');
const fs = require('fs');
const path = require('path');

// Read ABI from file
const contractABI = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../abi.json'), 'utf8'),
);

const contractAddress = '0x6256453174e1E4AAA4f748169822C6279b2B34D3';

// Provider and Signer setup
const url = 'https://sepolia.base.org';
const provider = new ethers.JsonRpcProvider(url);
const privateKey = process.env.PRIVATE_KEY; // Store your private key in .env file
const wallet = new ethers.Wallet(privateKey, provider);

// Contract instance
const contract = new ethers.Contract(contractAddress, contractABI, wallet);

async function main() {
  try {
    // Read from contract (view function)
    // const value = await contract.getValue();
    // console.log('Contract value:', value.toString());
    const owner = await contract.owner();
    console.log('owner', owner);
    // Write to contract (state-changing function)
    // const tx = await contract.setValue(42);
    // await tx.wait();
    // console.log("Transaction completed:", tx.hash);
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
