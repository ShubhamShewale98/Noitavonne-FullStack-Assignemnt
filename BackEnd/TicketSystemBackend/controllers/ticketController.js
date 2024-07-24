const Ticket = require('../models/Ticket');

const createTicket = async (req, res) => {
    const { title, description, attachments } = req.body;
    const createdBy = req.user.id;

    try {
        const ticket = new Ticket({ title, description, createdBy, attachments });
        await ticket.save();

        res.status(201).json({ msg: 'Ticket created successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find().populate('createdBy assignedTo');
        res.json(tickets);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateTicket = async (req, res) => {
    const { id } = req.params;
    const { assignedTo, status, replies, attachments } = req.body;

    try {
        const ticket = await Ticket.findById(id);

        if (!ticket) {
            return res.status(404).json({ msg: 'Ticket not found' });
        }

        if (assignedTo) ticket.assignedTo = assignedTo;
        if (status) ticket.status = status;
        if (replies) ticket.replies = replies;
        if (attachments) ticket.attachments = attachments;

        await ticket.save();

        res.json({ msg: 'Ticket updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const closeTicket = async (req, res) => {
    const { id } = req.params;

    try {
        const ticket = await Ticket.findById(id);

        if (!ticket) {
            return res.status(404).json({ msg: 'Ticket not found' });
        }

        ticket.status = 'closed';
        await ticket.save();

        res.json({ msg: 'Ticket closed successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { createTicket, getTickets, updateTicket, closeTicket };
