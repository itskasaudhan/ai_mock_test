import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../utils/api';

const Test = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { topic, difficulty, totalQuestions } = state || {};

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(totalQuestions * 60);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  

  const answersRef = useRef({});
  const questionsRef = useRef([]);
  const submittedRef = useRef(false);

  useEffect(() => {
    generateQuestions();
  }, []);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    questionsRef.current = questions;
  }, [questions]);

  useEffect(() => {
    if (questions.length === 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [questions]);

  const [error, setError] = useState('');

const generateQuestions = async () => {
    try {
      const res = await api.post('/ai/test/generate', {
        topic,
        difficulty,
        totalQuestions,
      });
      setQuestions(res.data.questions);
    } catch (err) {
      console.error(err);
      const rawError = err.response?.data?.error || '';

      if (rawError.includes('rate_limit_exceeded') || rawError.includes('429')) {
        setError('We have hit today\'s usage limit for generating test questions. Please try again later or tomorrow.');
      } else {
        setError('Something went wrong while generating your test. Please try again in a few minutes.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (option) => {
    setAnswers((prev) => ({ ...prev, [current]: option[0] }));
  };

  const goToQuestion = (index) => {
    setCurrent(index);
  };

  const handleNext = () => {
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    }
  };

  const handlePrevious = () => {
    if (current > 0) {
      setCurrent(current - 1);
    }
  };

  const handleSubmit = async () => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    setSubmitting(true);

    try {
      const qs = questionsRef.current;
      const ansMap = answersRef.current;

      const finalAnswers = qs.map((q, i) => ({
        question: q,
        selected: ansMap[i] || null,
      }));

      let score = 0;
      finalAnswers.forEach((a) => {
        if (a.selected === a.question.correctAnswer) score++;
      });

      const timeTaken = totalQuestions * 60 - timeLeft;

      const sessionRes = await api.post('/session', {
        mode: 'test',
        topic,
        difficulty,
        score,
        totalQuestions,
        timeTaken,
        conversation: [],
        feedback: '',
        weakAreas: [],
        testAnswers: finalAnswers.map((a) => ({
          question: a.question.question,
          options: a.question.options,
          correctAnswer: a.question.correctAnswer,
          explanation: a.question.explanation,
          selected: a.selected,
        })),
      });

      navigate(`/results/${sessionRes.data._id}`);
    } catch (err) {
      console.error(err);
      submittedRef.current = false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleExitClick = () => {
    setShowExitModal(true);
  };

  const handleConfirmExit = () => {
    setShowExitModal(false);
    handleSubmit();
  };

  const handleCancelExit = () => {
    setShowExitModal(false);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const answeredCount = Object.keys(answers).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-white font-semibold">Generating your test...</p>
            <p className="text-gray-400 text-sm mt-2">AI is preparing {totalQuestions} questions on {topic}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!loading && questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center max-w-md">
            <h2 className="text-white text-xl font-bold mb-3">Couldn't generate test</h2>
            <p className="text-gray-400 text-sm mb-6">{error || 'Something went wrong. Please try again.'}</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <Navbar />

      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-white font-bold">{topic} Test</h1>
            <p className="text-gray-400 text-sm capitalize">{difficulty} · {answeredCount} of {questions.length} answered</p>
          </div>
          <div className="flex items-center gap-4">
            <div className={`text-lg font-bold ${timeLeft < 60 ? 'text-red-400' : 'text-green-400'}`}>
              ⏱ {formatTime(timeLeft)}
            </div>
            <button
              onClick={handleExitClick}
              className="text-red-400 hover:text-red-300 text-sm font-semibold border border-red-600/30 hover:border-red-600/60 px-4 py-2 rounded-lg transition"
            >
              Exit Test
            </button>
          </div>
        </div>

        {/* Question number pills */}
        <div className="max-w-4xl mx-auto mt-4 flex flex-wrap gap-2">
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => goToQuestion(i)}
              className={`w-9 h-9 rounded-lg text-xs font-semibold transition flex-shrink-0 ${
                i === current
                  ? 'bg-blue-600 text-white'
                  : answers[i]
                  ? 'bg-green-600/20 border border-green-600/50 text-green-400'
                  : 'bg-gray-800 border border-gray-700 text-gray-400 hover:border-gray-500'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
            <p className="text-gray-500 text-xs font-semibold mb-2">QUESTION {current + 1} OF {questions.length}</p>
            <p className="text-white text-lg leading-relaxed">
              {questions[current]?.question}
            </p>
          </div>

          <div className="space-y-3">
            {questions[current]?.options.map((option, i) => (
              <button
                key={i}
                onClick={() => handleSelect(option)}
                className={`w-full text-left px-5 py-4 rounded-xl border text-sm transition ${
                  answers[current] === option[0]
                    ? 'border-blue-500 bg-blue-600/10 text-white'
                    : 'border-gray-800 bg-gray-900 text-gray-300 hover:border-gray-600'
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="mt-8 flex gap-3">
            <button
              onClick={handlePrevious}
              disabled={current === 0}
              className="flex-1 border border-gray-700 text-gray-300 font-semibold py-3 rounded-lg transition hover:border-gray-500 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>

            {current + 1 >= questions.length ? (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Test →'}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
              >
                Next →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Exit Confirmation Modal */}
      {showExitModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 w-full max-w-md text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-white text-xl font-bold mb-2">Leave the test?</h3>
            <p className="text-gray-400 text-sm mb-6">
              You've answered <span className="text-white font-semibold">{answeredCount} of {questions.length}</span> questions.
              If you leave now, your test will be submitted with only the marked answers and the rest will be counted as incorrect.
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleCancelExit}
                className="flex-1 border border-gray-700 text-gray-300 py-3 rounded-lg text-sm font-semibold hover:border-gray-500 transition"
              >
                Continue Test
              </button>
              <button
                onClick={handleConfirmExit}
                disabled={submitting}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg text-sm font-semibold transition disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Yes, Submit & Exit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Test;