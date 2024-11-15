require('dotenv').config();
const lighthouse = require('@lighthouse-web3/sdk');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client'); // Prisma Client
const lighthouseService = require('../services/lighthouseService');
const jwt = require('../middlewares/jwt');

const prisma = new PrismaClient();

const getApiKeyController = async (req, res) => {
  try {
    const publicKey = process.env.LIGHHOUES_PUBLIC_KEY;
    const privateKey = process.env.LIGHHOUES_PRIVATE_KEY;

    const apiKey = await lighthouseService.getApiKey(publicKey, privateKey);

    return res.status(200).json({
      status: true,
      message: 'API Key fetched successfully',
      data: apiKey,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: 'Failed to fetch API Key',
      error: error.message,
    });
  }
};

const uploadFileController = async (req, res) => {
  try {
    const user = await jwt.getInfo(req);
    if (!req.file) {
      return res.status(400).json({
        status: false,
        message: 'No file uploaded',
      });
    }

    const filePath = req.file.path;
    const publicKey = process.env.LIGHHOUES_PUBLIC_KEY;
    const privateKey = process.env.LIGHHOUES_PRIVATE_KEY;
    const apiKey = await lighthouseService.getApiKey(publicKey, privateKey);
    const uploadResponse = await lighthouse.upload(filePath, apiKey);

    const {
      Name: fileName,
      Hash: fileHash,
      Size: fileSize,
    } = uploadResponse.data;
    await prisma.upload_file.create({
      data: {
        file_name: fileName,
        file_hash: fileHash,
        file_size: parseInt(fileSize, 10),
        user_id: user.user_id,
      },
    });
    fs.unlinkSync(filePath);

    return res.status(200).json({
      status: true,
      message: 'File uploaded successfully',
      data: uploadResponse.data,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: 'Failed to upload file',
      error: error.message,
    });
  }
};

const uploadTextController = async (req, res) => {
  try {
    const user = await jwt.getInfo(req);

    const { text, name } = req.body;
    if (!text) {
      return res.status(400).json({
        status: false,
        message: 'No text provided',
      });
    }

    const publicKey = process.env.LIGHHOUES_PUBLIC_KEY;
    const privateKey = process.env.LIGHHOUES_PRIVATE_KEY;

    const apiKey = await lighthouseService.getApiKey(publicKey, privateKey);

    const signedMessage = await lighthouseService.signMessage(privateKey);

    const response = await lighthouse.textUploadEncrypted(
      text,
      apiKey,
      publicKey,
      signedMessage,
      name || 'Untitled',
    );

    const { Name: fileName, Hash: fileHash, Size: fileSize } = response.data;

    await prisma.upload_file.create({
      data: {
        file_name: fileName,
        file_hash: fileHash,
        file_size: parseInt(fileSize, 10),
        user_id: user.user_id,
      },
    });

    return res.status(200).json({
      status: true,
      message: 'Text uploaded successfully',
      data: response.data,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: 'Failed to upload text',
      error: error.message,
    });
  }
};

const uploadJsonFileController = async (req, res) => {
  try {
    const user = await jwt.getInfo(req);

    if (!req.file) {
      return res.status(400).json({
        status: false,
        message: 'No file uploaded',
      });
    }

    const publicKey = process.env.LIGHHOUES_PUBLIC_KEY;
    const privateKey = process.env.LIGHHOUES_PRIVATE_KEY;

    const apiKey = await lighthouseService.getApiKey(publicKey, privateKey);
    const signedMessage = await lighthouseService.signMessage(privateKey);

    const filePath = req.file.path;
    const fileContent = fs.readFileSync(filePath, 'utf8');

    const response = await lighthouse.textUploadEncrypted(
      fileContent,
      apiKey,
      publicKey,
      signedMessage,
      req.file.originalname,
    );

    const { Name: fileName, Hash: fileHash, Size: fileSize } = response.data;

    await prisma.upload_file.create({
      data: {
        file_name: fileName,
        file_hash: fileHash,
        file_size: parseInt(fileSize, 10),
        user_id: user.user_id,
      },
    });
    fs.unlinkSync(filePath);

    return res.status(200).json({
      status: true,
      message: 'JSON file uploaded successfully',
      data: {
        file_name: fileName,
        file_hash: fileHash,
        file_size: fileSize,
        user_id: user.user_id,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: 'Failed to upload JSON file',
      error: error.message,
    });
  }
};

module.exports = {
  getApiKeyController,
  uploadFileController,
  uploadTextController,
  uploadJsonFileController,
};
