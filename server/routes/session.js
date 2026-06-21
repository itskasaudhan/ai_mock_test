const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  saveSession,
  getUserSessions,
  getSessionById,
  deleteSession
} = require('../controllers/sessionController');

router.post('/', auth, saveSession);
router.get('/', auth, getUserSessions);
router.get('/:id', auth, getSessionById);
router.delete('/:id', auth, deleteSession);

module.exports = router;
