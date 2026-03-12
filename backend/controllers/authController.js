const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// JWT Token generate karne ka function
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email already registered!' });
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        subscription: user.subscription
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password!' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password!' });
    }

    res.status(200).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        subscription: user.subscription
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Email not found!' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000;
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const html = `
      <div style="font-family: Arial; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4f8ef7;">📚 Knowledge Vault</h2>
        <h3>Password Reset Request</h3>
        <p>Aapne password reset request ki hai. Neeche diye link pe click karo:</p>
        <a href="${resetUrl}" 
           style="display: inline-block; padding: 12px 30px; 
                  background: linear-gradient(135deg, #4f8ef7, #a855f7); 
                  color: white; border-radius: 8px; text-decoration: none;">
          Reset Password
        </a>
        <p style="color: #718096; margin-top: 20px;">
          Yeh link 1 ghante mein expire ho jayega.
        </p>
        <p style="color: #718096;">
          Agar aapne yeh request nahi ki toh ignore karo.
        </p>
      </div>
    `;

    await sendEmail(user.email, 'Password Reset — Knowledge Vault', html);
    res.status(200).json({ message: 'Reset email sent!' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @POST /api/auth/reset-password/:token
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Token invalid ya expire ho gaya!' });
    }

    user.password = password;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successful!' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login, forgotPassword, resetPassword };