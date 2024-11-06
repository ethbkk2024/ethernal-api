require('dotenv').config();
const lighthouse = require('@lighthouse-web3/sdk');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client'); // Prisma Client
const lighthouseService = require('../services/lighthouseService');

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
    await prisma.uploaded_file.create({
      data: {
        file_name: fileName,
        file_hash: fileHash,
        file_size: parseInt(fileSize, 10),
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

module.exports = {
  getApiKeyController,
  uploadFileController,
};
