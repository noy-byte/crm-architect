const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' })); // חשוב! מאפשר קבלת תמונות חתימה גדולות

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB Atlas'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// --- עדכון הסכימה: הוספנו שדות לחתימה ---
const ProposalSchema = new mongoose.Schema({
    title: String,
    budget: Number,
    clientName: String,
    createdAt: { type: Date, default: Date.now },
    appData: Object,
    // שדות חדשים:
    status: { type: String, default: 'draft' }, // draft / signed
    signatureImage: String, // כאן נשמור את התמונה בפורמט טקסט (Base64)
    signedAt: Date,
    clientNotes: String
});

const Proposal = mongoose.model('Proposal', ProposalSchema);

// --- נתיבים ---

// API routes are below, but if no API route matches, serve index.html (for client-side routing)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/api/proposals', async (req, res) => {
    try {
        const { title, budget, clientName, appData, _id } = req.body;
        // אם נשלח ID, נעדכן. אחרת ניצור חדש.
        if (_id) {
            const updated = await Proposal.findByIdAndUpdate(_id, { title, budget, clientName, appData }, { new: true });
            return res.json(updated);
        }
        const newProposal = new Proposal({ title, budget, clientName, appData });
        const savedProposal = await newProposal.save();
        res.status(201).json(savedProposal);
    } catch (error) {
        console.error('Error saving proposal:', error);
        res.status(500).json({ error: error.message || 'Failed to save' });
    }
});

app.get('/api/proposals', async (req, res) => {
    try {
        const proposals = await Proposal.find().sort({ createdAt: -1 });
        res.json(proposals);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch' });
    }
});

app.get('/api/proposals/:id', async (req, res) => {
    try {
        const proposal = await Proposal.findById(req.params.id);
        if (!proposal) return res.status(404).json({ error: 'Not found' });
        res.json(proposal);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch' });
    }
});

app.delete('/api/proposals/:id', async (req, res) => {
    try {
        const deleted = await Proposal.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Proposal not found' });
        res.json({ message: 'Deleted' });
    } catch (error) {
        console.error('Error deleting proposal:', error);
        res.status(500).json({ error: error.message || 'Failed to delete' });
    }
});

// --- נתיב חדש: חתימה על הצעה ---
app.patch('/api/proposals/:id/sign', async (req, res) => {
    try {
        const { signatureImage, clientName, clientNotes } = req.body;
        
        const updatedProposal = await Proposal.findByIdAndUpdate(
            req.params.id,
            {
                status: 'signed',
                signatureImage: signatureImage,
                signedAt: new Date(),
                clientNotes: clientNotes,
                // אופציונלי: עדכון שם הלקוח אם השתנה בחתימה
                ...(clientName && { clientName }) 
            },
            { new: true } // מחזיר את המסמך המעודכן
        );

        if (!updatedProposal) return res.status(404).json({ error: 'Proposal not found' });
        res.json(updatedProposal);
    } catch (error) {
        console.error('Error signing proposal:', error);
        res.status(500).json({ error: error.message || 'Failed to sign proposal' });
    }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));