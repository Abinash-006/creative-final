const mongoose = require('mongoose');

const posterSchema = new mongoose.Schema({
    meta: { type: String, required: true },
    title: { type: String, required: true },
    desc: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    loc: { type: String, required: true },
    images: [{ type: String }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Poster', posterSchema);
