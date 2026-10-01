require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const cors = require('cors');
const path = require('path');
const Donation = require('./models/Donation');
const Poster = require('./models/Poster');
const OurWork = require('./models/OurWork');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Protect sensitive files from being served statically
app.use((req, res, next) => {
    if (req.path === '/work-loader.js') return next();
    if (req.path.includes('.env') || req.path.endsWith('.js') || req.path.endsWith('.json') || req.path.includes('models/')) {
        return res.status(403).send('Forbidden');
    }
    next();
});

// Serve public site files
app.use(express.static(path.join(__dirname, '.')));

// Admin dashboard route
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin', 'index.html'));
});

app.get('/admin/donations', async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.json([]);
        }

        const donations = await Donation.find().sort({ createdAt: -1 });
        res.json(donations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Unable to fetch donations' });
    }
});

// Poster APIs
app.get('/api/posters', async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) return res.json([]);
        const posters = await Poster.find().sort({ createdAt: -1 });
        res.json(posters);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Unable to fetch posters' });
    }
});

app.post('/api/posters', async (req, res) => {
    try {
        const poster = new Poster(req.body);
        await poster.save();
        res.json(poster);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Unable to create poster' });
    }
});

app.delete('/api/posters/:id', async (req, res) => {
    try {
        await Poster.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Unable to delete poster' });
    }
});

// Our Work APIs
app.get('/api/work', async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) return res.json([]);
        const works = await OurWork.find().sort({ order: 1 });
        res.json(works);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Unable to fetch our work' });
    }
});

app.post('/api/work', async (req, res) => {
    try {
        const work = new OurWork(req.body);
        await work.save();
        res.json(work);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Unable to create work' });
    }
});

app.delete('/api/work/:id', async (req, res) => {
    try {
        await OurWork.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Unable to delete work' });
    }
});

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB Connection Error: ", err));

// Razorpay Instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Order API
app.post('/create-order', async (req, res) => {
    try {
        const { amount, name, email, phone } = req.body;
        if (!amount || amount <= 0) {
            return res.status(400).json({ error: 'Invalid amount' });
        }

        const options = {
            amount: amount * 100, // Razorpay takes amount in subunits (paise)
            currency: 'INR',
            receipt: 'receipt_order_' + Date.now()
        };

        const order = await razorpay.orders.create(options);

        // Save pending donation to DB
        const newDonation = new Donation({
            donorName: name || 'Generous Donor',
            email: email || 'donor@example.com',
            phone: phone || 'Not provided',
            amount: amount,
            razorpayOrderId: order.id,
            status: 'Pending'
        });
        await newDonation.save();

        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating order' });
    }
});

// Cancel Payment API
app.post('/cancel-payment', async (req, res) => {
    try {
        const { razorpay_order_id } = req.body;
        if (razorpay_order_id) {
            await Donation.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                { status: 'Failed' }
            );
        }
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error cancelling payment' });
    }
});

// Verify Payment API
app.post('/verify-payment', async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ success: false, message: 'Missing parameters' });
        }

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            // Payment is verified
            await Donation.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                { 
                    status: 'Success', 
                    razorpayPaymentId: razorpay_payment_id,
                    razorpaySignature: razorpay_signature 
                }
            );
            res.json({ success: true, message: 'Payment verified successfully' });
        } else {
            // Payment verification failed
            await Donation.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                { status: 'Failed' }
            );
            res.status(400).json({ success: false, message: 'Invalid signature' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error verifying payment' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
