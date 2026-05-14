const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { handleTeamImageUpload, handlePortfolioMediaUpload } = require('../controllers/uploadController');

router.post('/team-image', protect, handleTeamImageUpload);
router.post('/portfolio-media', protect, handlePortfolioMediaUpload);

module.exports = router;
