const express = require('express');
const router = express.Router();
const { getLeads, createLead, deleteLead, replyToLead } = require('../controllers/leadController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getLeads);
router.post('/', createLead);
router.post('/:id/reply', protect, replyToLead);
router.delete('/:id', protect, deleteLead);

module.exports = router;
