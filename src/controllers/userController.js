const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../middleware/auth');

const userController = {
    // Register new user
    register: async (req, res) => {
        try {
            const { username, email, password } = req.body;
            const user = new User({ username, email, password });
            await user.save();
            
            const token = jwt.sign({ userId: user._id }, JWT_SECRET);
            res.status(201).json({ user, token });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // Login user
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });
            
            if (!user) {
                throw new Error('Invalid login credentials');
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                throw new Error('Invalid login credentials');
            }

            const token = jwt.sign({ userId: user._id }, JWT_SECRET);
            res.json({ user, token });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // Get user profile
    getProfile: async (req, res) => {
        res.json(req.user);
    }
};

module.exports = userController;
