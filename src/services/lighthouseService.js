const axios = require('axios');
const { ethers } = require('ethers');
const lighthouse = require('@lighthouse-web3/sdk');

const signAuthMessage = async (privateKey, verificationMessage) => {
  const signer = new ethers.Wallet(privateKey);
  return signer.signMessage(verificationMessage);
};

const getApiKey = async (publicKey, privateKey) => {
  try {
    const verificationMessage = (
      await axios.get(
        `https://api.lighthouse.storage/api/auth/get_message?publicKey=${publicKey}`,
      )
    ).data;

    const signedMessage = await signAuthMessage(
      privateKey,
      verificationMessage,
    );
    const response = await lighthouse.getApiKey(publicKey, signedMessage);

    return response.data.apiKey;
  } catch (error) {
    console.error('Error in getApiKey:', error.response.data || error.message);
    throw new Error('Failed to fetch API Key');
  }
};

module.exports = {
  getApiKey,
};
