const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { handleTeamImageUpload } = require('../controllers/uploadController');

router.post('/team-image', protect, handleTeamImageUpload);

module.exports = router;
