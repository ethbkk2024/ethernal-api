const jwt = require('jsonwebtoken');

const signOptions = {
  issuer: 'ethglobalteams',
  audience: 'user',
  algorithm: 'HS512',
};

const secret = process.env.JWT_SECRET || 'secret';

const generateToken = (payload) =>
  jwt.sign(payload, secret, { ...signOptions, expiresIn: '7d' });

const getInfo = async (req) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  return new Promise((resolve) => {
    jwt.verify(token, secret, signOptions, (err, decode) => {
      resolve({
        user_id: decode.user_id,
      });
    });
  });
};

module.exports = {
  generateToken,
  getInfo,
};
