const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// אפשור גישה מכל מקום (CORS) וקבלת JSON גדול (לתמונות חתימה)
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// משתנה גלובלי לחיבור (מייעל ביצועים ב-Serverless)
let conn = null;

// --- הגדרת מבנה הנתונים (Schema) ---
const ProposalSchema = new mongoose.Schema({
    title: String,
    budget: Number,
    clientName: String,
    createdAt: { type: Date, default: Date.now },
    appData: Object,           // כל המידע מהאפליקציה
    status: { type: String, default: 'draft' }, // draft / signed
    signatureImage: String,    // תמונת החתימה ב-Base64
    signedAt: Date,
    clientNotes: String
});

// שימוש במודל קיים או יצירה חדשה (למניעת שגיאות ב-Hot Reload)
const Proposal = mongoose.models.Proposal || mongoose.model('Proposal', ProposalSchema);

// --- נתיבים (Routes) ---
const router = express.Router();

router.get('/', (req, res) => res.send('CRM API is running!'));

// 1. שמירת הצעה חדשה או עדכון קיימת
router.post('/proposals', async (req, res) => {
    try {
        await connectToDatabase();
        // אם נשלח ID, נעדכן. אחרת ניצור חדש.
        if (req.body._id) {
            const updated = await Proposal.findByIdAndUpdate(req.body._id, req.body, { new: true });
            if (!updated) return res.status(404).json({ error: 'Proposal not found' });
            return res.json(updated);
        }
        const newProposal = new Proposal(req.body);
        const saved = await newProposal.save();
        res.status(201).json(saved);
    } catch (error) {
        console.error('Error saving proposal:', error);
        res.status(500).json({ error: error.message || 'Failed to save proposal' });
    }
});

// 2. קבלת כל ההצעות (לארכיון)
router.get('/proposals', async (req, res) => {
    try {
        await connectToDatabase();
        const proposals = await Proposal.find().sort({ createdAt: -1 });
        res.json(proposals || []); // Ensure we always return an array
    } catch (error) {
        console.error('Error fetching proposals:', error);
        res.status(500).json({ error: error.message || 'Failed to fetch proposals' });
    }
});

// 3. קבלת הצעה ספציפית (עבור הלקוח שפותח לינק)
router.get('/proposals/:id', async (req, res) => {
    try {
        await connectToDatabase();
        const proposal = await Proposal.findById(req.params.id);
        if (!proposal) return res.status(404).json({ error: 'Not found' });
        res.json(proposal);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 4. חתימה על הצעה
router.patch('/proposals/:id/sign', async (req, res) => {
    try {
        await connectToDatabase();
        const { signatureImage, clientName, clientNotes } = req.body;
        const updated = await Proposal.findByIdAndUpdate(
            req.params.id,
            { 
                status: 'signed', 
                signatureImage, 
                signedAt: new Date(), 
                clientName, // עדכון שם החותם אם השתנה
                clientNotes 
            },
            { new: true }
        );
        if (!updated) return res.status(404).json({ error: 'Proposal not found' });
        res.json(updated);
    } catch (error) {
        console.error('Error signing proposal:', error);
        res.status(500).json({ error: error.message || 'Failed to sign proposal' });
    }
});

// מחיקת הצעה
router.delete('/proposals/:id', async (req, res) => {
    try {
        await connectToDatabase();
        const deleted = await Proposal.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Proposal not found' });
        res.json({ message: 'Deleted' });
    } catch (error) {
        console.error('Error deleting proposal:', error);
        res.status(500).json({ error: error.message || 'Failed to delete proposal' });
    }
});

// חיבור ל-Netlify
app.use('/.netlify/functions/api', router); // נתיב עבור Production
app.use('/api', router); // נתיב עבור פיתוח מקומי

// Catch-all for debugging
app.use('*', (req, res) => {
    res.status(404).json({ 
        error: 'Route not found', 
        path: req.path,
        method: req.method,
        availableRoutes: ['GET /proposals', 'GET /proposals/:id', 'POST /proposals', 'PATCH /proposals/:id/sign', 'DELETE /proposals/:id']
    });
});

module.exports.handler = serverless(app);
