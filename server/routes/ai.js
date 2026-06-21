const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { generateTestQuestions } = require('../controllers/aiController');

router.post('/test/generate', auth, generateTestQuestions);

module.exports = router;