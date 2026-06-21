import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const testTopics = ['DSA', 'OS', 'DBMS', 'CN', 'OOP', 'Aptitude'];
const difficulties = ['easy', 'medium', 'hard'];

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [totalQuestions, setTotalQuestions] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [showSessions, setShowSessions] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await api.get('/session');
      setSessions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStart = () => {
    setTopic('');
    setDifficulty('');
    setShowModal(true);
  };

  const handleLaunch = () => {
    if (!topic || !difficulty) return;
    navigate('/test', { state: { topic, difficulty, totalQuestions } });
    setShowModal(false);
  };

  // ---- Stats calculations ----
  const totalTests = sessions.length;

  const avgScore = totalTests === 0
    ? 0
    : Math.round(
        (sessions.reduce((sum, s) => sum + (s.score / s.totalQuestions) * 100, 0) / totalTests)
      );

  const bestSession = totalTests === 0
    ? null
    : sessions.reduce((best, s) => {
        const pct = (s.score / s.totalQuestions) * 100;
        const bestPct = (best.score / best.totalQuestions) * 100;
        return pct > bestPct ? s : best;
      }, sessions[0]);

  const topicCounts = sessions.reduce((acc, s) => {
    acc[s.topic] = (acc[s.topic] || 0) + 1;
    return acc;
  }, {});
  const mostPracticedTopic = Object.keys(topicCounts).length === 0
    ? '—'
    : Object.entries(topicCounts).sort((a, b) => b[1] - a[1])[0][0];

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Welcome */}
        <div className="mb-10">
          <h1 className="text-white text-3xl font-bold mb-1">
  {sessions.length === 0 ? `Welcome, ${user?.name}` : `Welcome back, ${user?.name}`}
</h1>
          <p className="text-gray-400">Ready to practice today?</p>
        </div>

        {/* Mode Card + Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Mock Test Card */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 hover:border-green-600 transition cursor-pointer"
            onClick={handleStart}>
            <div className="text-4xl mb-4"></div>
            <h2 className="text-white text-xl font-bold mb-2">Mock Test</h2>
            <p className="text-gray-400 text-sm mb-6">
              Timed MCQ test. Answer questions and get your score with detailed explanations.
            </p>
            <button className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-6 py-2 rounded-lg transition">
              Start Test →
            </button>
          </div>

          {/* Stats Panel */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-white font-bold mb-5">Your Stats</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800/50 border border-gray-800 rounded-lg p-4">
                <p className="text-gray-400 text-xs mb-1">Tests Taken</p>
                <p className="text-white text-2xl font-bold">{totalTests}</p>
              </div>

              <div className="bg-gray-800/50 border border-gray-800 rounded-lg p-4">
                <p className="text-gray-400 text-xs mb-1">Average Score</p>
                <p className={`text-2xl font-bold ${
                  avgScore >= 70 ? 'text-green-400' : avgScore >= 40 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {totalTests === 0 ? '—' : `${avgScore}%`}
                </p>
              </div>

              <div className="bg-gray-800/50 border border-gray-800 rounded-lg p-4">
                <p className="text-gray-400 text-xs mb-1">Best Score</p>
                <p className="text-white text-2xl font-bold">
                  {bestSession ? `${bestSession.score}/${bestSession.totalQuestions}` : '—'}
                </p>
              </div>

              <div className="bg-gray-800/50 border border-gray-800 rounded-lg p-4">
                <p className="text-gray-400 text-xs mb-1">Most Practiced</p>
                <p className="text-white text-lg font-bold truncate">{mostPracticedTopic}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Past Sessions */}
       {/* Past Sessions */}
<div>
  <button
    onClick={() => setShowSessions(!showSessions)}
    className="w-full flex items-center justify-between mb-4 group"
  >
    <h2 className="text-white text-xl font-bold">
      Past Sessions {sessions.length > 0 && <span className="text-gray-500 text-sm font-normal">({sessions.length})</span>}
    </h2>
    <span className={`text-gray-400 group-hover:text-white transition transform ${showSessions ? 'rotate-180' : ''}`}>
      ▼
    </span>
  </button>

  {showSessions && (
    <>
      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : sessions.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
          <p className="text-gray-400">No sessions yet. Start your first mock test!</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {sessions.map((s) => (
            <div
              key={s._id}
              onClick={() => navigate(`/results/${s._id}`)}
              className="bg-gray-900 border border-gray-800 rounded-xl px-6 py-4 flex items-center justify-between cursor-pointer hover:border-gray-600 transition"
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl"></span>
                <div>
                  <p className="text-white font-semibold">{s.topic} Test</p>
                  <p className="text-gray-400 text-sm">{s.difficulty} · {new Date(s.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-bold">{s.score}/{s.totalQuestions}</p>
                <p className="text-gray-400 text-sm">Score</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )}
</div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 w-full max-w-md">
            <h3 className="text-white text-xl font-bold mb-6">Configure Mock Test</h3>

            <div className="space-y-5">
              <div>
                <label className="text-gray-400 text-sm block mb-2">Topic</label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-500"
                >
                  <option value="">Select topic</option>
                  {testTopics.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-2">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-500"
                >
                  <option value="">Select difficulty</option>
                  {difficulties.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-2">Number of Questions</label>
                <select
                  value={totalQuestions}
                  onChange={(e) => setTotalQuestions(Number(e.target.value))}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-500"
                >
                  <option value={10}>10 Questions</option>
                  <option value={20}>20 Questions</option>
                  <option value={30}>30 Questions</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-gray-700 text-gray-300 py-3 rounded-lg text-sm font-semibold hover:border-gray-500 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLaunch}
                  disabled={!topic || !difficulty}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-sm font-semibold transition disabled:opacity-50"
                >
                  Launch →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;