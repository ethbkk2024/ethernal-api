const jwt = require('../middlewares/jwt');
const authService = require('../services/authService');

const login = async (req, res) => {
  try {
    const user = await authService.login(req.body.wallet_address);
    const token = jwt.generateToken({ user_id: user.id });
    console.log(user);
    res.status(200).json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  login,
};
