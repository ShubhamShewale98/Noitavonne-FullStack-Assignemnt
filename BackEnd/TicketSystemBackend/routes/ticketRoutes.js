const express = require('express');
const { createTicket, getTickets, updateTicket, closeTicket } = require('../controllers/ticketController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, createTicket);
router.get('/', authMiddleware, getTickets);
router.put('/:id', authMiddleware, updateTicket);
router.post('/:id/close', authMiddleware, closeTicket);

module.exports = router;
