const Groq = require('groq-sdk');
const Session = require('../models/Session');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

exports.generateTestQuestions = async (req, res) => {
  try {
    const { topic, difficulty, totalQuestions } = req.body;

    // Fetch this user's last 3 sessions on the same topic to avoid repeating questions
    const pastSessions = await Session.find({
      userId: req.userId,
      mode: 'test',
      topic
    })
      .sort({ createdAt: -1 })
      .limit(3);

    let pastQuestionsList = [];
    pastSessions.forEach((s) => {
      if (s.testAnswers && s.testAnswers.length > 0) {
        s.testAnswers.forEach((a) => pastQuestionsList.push(a.question));
      }
    });

    pastQuestionsList = pastQuestionsList.slice(0, 30);

    const avoidBlock = pastQuestionsList.length > 0
      ? `\n\nDo NOT repeat or closely rephrase any of these previously asked questions:\n${pastQuestionsList.map((q, i) => `${i + 1}. ${q}`).join('\n')}`
      : '';

    const systemPrompt = `You are a technical test generator.
Generate EXACTLY ${totalQuestions} MCQ questions (no more, no less) for:
Topic: ${topic}
Difficulty: ${difficulty}
${avoidBlock}

Return ONLY this JSON with no extra text, no markdown, no backticks:
{
  "questions": [
    {
      "question": "question text",
      "options": ["A. option1", "B. option2", "C. option3", "D. option4"],
      "correctAnswer": "A",
      "explanation": "why this is correct"
    }
  ]
}

IMPORTANT: Generate exactly ${totalQuestions} NEW questions, different from the ones listed above. Keep explanations short (1 sentence).`;

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: systemPrompt }],
      temperature: 0.8,
      max_tokens: 4000
    });

    const rawText = response.choices[0].message.content;
    console.log('Groq raw response:', rawText);
    const cleanText = rawText.replace(/```json|```/g, '').trim();
    const result = JSON.parse(cleanText);

    res.status(200).json(result);

  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};