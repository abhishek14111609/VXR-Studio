const express = require('express');
const router = express.Router();
const { getLeads, createLead, deleteLead } = require('../controllers/leadController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getLeads);
router.post('/', createLead);
router.delete('/:id', protect, deleteLead);

module.exports = router;
