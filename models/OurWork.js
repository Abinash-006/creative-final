const mongoose = require('mongoose');

const ourWorkSchema = new mongoose.Schema({
    number: { type: String, required: true },
    title: { type: String, required: true },
    image: { type: String, required: true },
    layout: { type: String, default: '' },
    order: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('OurWork', ourWorkSchema);
