const express = require('express');
const { registerUser, loginUser, getTechSupportUser } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/techsupport', authMiddleware,getTechSupportUser);

module.exports = router;
