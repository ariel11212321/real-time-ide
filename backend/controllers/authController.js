const authService = require('../services/authService');

class AuthController {
  async register(req, res) {
    try {
      const { username, email, password } = req.body;
      const token = await authService.registerUser(username, email, password);
      res.status(201).json({ token });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const token = await authService.loginUser(email, password);
      res.json({ token });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  getProfile(req, res) {
    res.json(req.user);
  }
}

module.exports = new AuthController();