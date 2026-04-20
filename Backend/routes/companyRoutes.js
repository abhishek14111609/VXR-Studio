const express = require('express');
const router = express.Router();
const { getCompany, updateCompany } = require('../controllers/companyController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getCompany);
router.put('/', protect, updateCompany);

module.exports = router;
