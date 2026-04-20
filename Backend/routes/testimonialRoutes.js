const express = require('express');
const router = express.Router();
const { getTestimonials, createTestimonial, deleteTestimonial } = require('../controllers/testimonialController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getTestimonials);
router.post('/', protect, createTestimonial);
router.delete('/:id', protect, deleteTestimonial);

module.exports = router;
