const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['open', 'closed', 'resolved'], default: 'open' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    replies: [{ type: String }],
    attachments: [{ type: String , required: false}],
});

module.exports = mongoose.model('Ticket', ticketSchema);
