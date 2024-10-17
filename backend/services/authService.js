const User = require('../models/User');
const jwt = require('jsonwebtoken');

class AuthService {
    async registerUser(username, email, password) {
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
          if (existingUser.email === email) {
            throw new Error('Email already in use');
          }
          if (existingUser.username === username) {
            throw new Error('Username already taken');
          }
        }
        
        const user = new User({ username, email, password });
        try {
          await user.save();
        } catch (error) {
          console.error('Error saving user:', error);
          throw new Error('Error creating user');
        }
        return this.generateToken(user);
    }

  async loginUser(email, password) {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      throw new Error('Invalid credentials');
    }
    return this.generateToken(user);
  }

  generateToken(user) {
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  }
}

module.exports = new AuthService();