const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const registerUser = async (req, res) => {
    const { username, password, role } = req.body;

    try {
        const user = new User({ username, password: bcrypt.hashSync(password, 10), role });
        await user.save();

        res.status(201).json({ msg: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ msg: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, role: user.role });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { registerUser, loginUser };
