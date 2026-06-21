const Session = require('../models/Session');

exports.saveSession = async (req, res) => {
  try {
    const {
      mode,
      topic,
      difficulty,
      score,
      totalQuestions,
      timeTaken,
      conversation,
      feedback,
      weakAreas,
      testAnswers
    } = req.body;

    const session = await Session.create({
      userId: req.userId,
      mode,
      topic,
      difficulty,
      score,
      totalQuestions,
      timeTaken,
      conversation,
      feedback,
      weakAreas,
      testAnswers
    });

    res.status(201).json(session);

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getUserSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.userId })
      .sort({ createdAt: -1 });

    res.status(200).json(sessions);

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (session.userId.toString() !== req.userId) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.status(200).json(session);

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (session.userId.toString() !== req.userId) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await session.deleteOne();

    res.status(200).json({ message: 'Session deleted' });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};