import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../utils/api';

const Results = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSession();
  }, [id]);

  const fetchSession = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/session/${id}`);
      setSession(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePracticeAgain = () => {
    if (!session) return;
    if (session.mode === 'interview') {
      navigate('/interview', { state: { topic: session.topic, difficulty: session.difficulty } });
    } else {
      navigate('/test', { state: { topic: session.topic, difficulty: session.difficulty, totalQuestions: session.totalQuestions } });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-white">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-white">Session not found.</p>
        </div>
      </div>
    );
  }

  const percentage = Math.round((session.score / session.totalQuestions) * 100);

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Header */}
       {/* Header */}
<div className="text-center mb-10">
  <div className={`inline-block text-sm font-semibold px-4 py-1.5 rounded-full mb-4 ${
    percentage >= 70
      ? 'bg-green-600/10 text-green-400 border border-green-600/30'
      : percentage >= 40
      ? 'bg-yellow-600/10 text-yellow-400 border border-yellow-600/30'
      : 'bg-red-600/10 text-red-400 border border-red-600/30'
  }`}>
    {percentage >= 70 ? 'Excellent Performance' : percentage >= 40 ? 'Good Effort' : 'Needs Improvement'}
  </div>
  <h1 className="text-white text-3xl font-bold mb-2">Test Complete</h1>
  <p className="text-gray-400">{session.topic} · {session.difficulty}</p>
</div>

        {/* Score Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center mb-6">
          <div className="text-6xl font-bold text-white mb-2">
            {session.score}
            <span className="text-3xl text-gray-400">/{session.totalQuestions}</span>
          </div>
          <div className={`text-2xl font-bold mb-4 ${
            percentage >= 70 ? 'text-green-400' : percentage >= 40 ? 'text-yellow-400' : 'text-red-400'
          }`}>
            {percentage}%
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all ${
                percentage >= 70 ? 'bg-green-500' : percentage >= 40 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Feedback for Interview */}
        {session.mode === 'interview' && session.feedback && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
            <h2 className="text-white font-bold text-lg mb-3">Overall Feedback</h2>
            <p className="text-gray-300 text-sm leading-relaxed">{session.feedback}</p>
          </div>
        )}

        {/* Weak Areas */}
        {session.weakAreas && session.weakAreas.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
            <h2 className="text-white font-bold text-lg mb-3">Areas to Improve</h2>
            <div className="flex flex-wrap gap-2">
              {session.weakAreas.map((area, i) => (
                <span key={i} className="bg-red-600/10 border border-red-600/30 text-red-400 text-sm px-3 py-1 rounded-full">
                  {area}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Test Answer Review */}
        {session.mode === 'test' && session.testAnswers && session.testAnswers.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
            <h2 className="text-white font-bold text-lg mb-4">Answer Review</h2>
            <div className="space-y-4">
              {session.testAnswers.map((a, i) => {
                const isCorrect = a.selected === a.correctAnswer;
                return (
                  <div key={i} className={`border rounded-lg p-4 ${
                    isCorrect ? 'border-green-600/30 bg-green-600/5' : 'border-red-600/30 bg-red-600/5'
                  }`}>
                    <p className="text-white text-sm font-semibold mb-3">
                      {i + 1}. {a.question}
                    </p>

                    <div className="space-y-1.5 mb-3">
                      {a.options.map((opt, oi) => {
                        const letter = opt[0];
                        const isSelected = a.selected === letter;
                        const isAnswer = a.correctAnswer === letter;
                        return (
                          <div
                            key={oi}
                            className={`text-sm px-3 py-2 rounded-lg border ${
                              isAnswer
                                ? 'border-green-600/50 bg-green-600/10 text-green-400'
                                : isSelected
                                ? 'border-red-600/50 bg-red-600/10 text-red-400'
                                : 'border-gray-800 text-gray-400'
                            }`}
                          >
                            {opt}
                            {isAnswer && <span className="ml-2 text-xs">✓ Correct answer</span>}
                            {isSelected && !isAnswer && <span className="ml-2 text-xs">✗ Your answer</span>}
                          </div>
                        );
                      })}
                    </div>

                    {!a.selected && (
                      <p className="text-yellow-500 text-xs mb-2">⚠ Not answered</p>
                    )}

                    <p className="text-gray-400 text-xs">{a.explanation}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex-1 border border-gray-700 text-gray-300 py-3 rounded-lg font-semibold hover:border-gray-500 transition"
          >
            Back to Dashboard
          </button>
          <button
            onClick={handlePracticeAgain}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
          >
            Practice Again →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;