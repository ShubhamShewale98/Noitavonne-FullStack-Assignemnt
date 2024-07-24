const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['end_user', 'tech_support', 'admin'], required: true },
});

module.exports = mongoose.model('User', userSchema);