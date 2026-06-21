import { Link, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-600/30 text-blue-400 text-sm px-4 py-2 rounded-full mb-8">
          <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
          AI Powered Interview Preparation
        </div>

        <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
          Crack Your Next Interview <br />
          <span className="text-blue-500">With AI Practice</span>
        </h1>

        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-12">
          Take timed mock tests across DSA, OS, DBMS, CN, OOP and Aptitude, get instant AI-generated feedback and track your progress — all in one place.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link
            to="/register"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition"
          >
            Get Started Free
          </Link>
          <Link
            to="/login"
            className="border border-gray-700 hover:border-gray-500 text-gray-300 font-semibold px-8 py-3 rounded-lg transition"
          >
            Login
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-white font-bold text-lg mb-2">Mock Test</h3>
            <p className="text-gray-400 text-sm">
              Timed MCQ tests on DSA, OS, DBMS, CN, OOP and Aptitude. Get your score with detailed explanations.
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-white font-bold text-lg mb-2">Track Progress</h3>
            <p className="text-gray-400 text-sm">
              Dashboard shows your past sessions, scores and weak areas so you know exactly what to focus on.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;