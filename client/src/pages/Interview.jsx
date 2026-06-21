import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { speak, stopSpeaking } from '../utils/speech';

const Interview = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { topic, difficulty } = state || {};

  const [conversation, setConversation] = useState([]);
  const [status, setStatus] = useState('idle');
  const [isComplete, setIsComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState('');
  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    startInterview();
    return () => {
      stopSpeaking();
      if (recognitionRef.current) recognitionRef.current.abort();
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const startInterview = async () => {
    setLoading(true);
    try {
      const res = await api.post('/ai/interview/question', {
        topic,
        difficulty,
        conversation: [],
      });
      const aiMessage = res.data.message;
      const newConversation = [{ role: 'assistant', content: aiMessage }];
      setConversation(newConversation);
      speak(aiMessage);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleListen = () => {
    stopSpeaking();

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Please use Google Chrome for voice recognition.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setStatus('listening');
      setTranscript('');
    };

    recognition.onresult = (event) => {
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      setTranscript(final || interim);
    };

    recognition.onend = async () => {
      setStatus('thinking');
      const spokenText = transcript || '';

      if (!spokenText.trim()) {
        setStatus('idle');
        setTranscript('');
        return;
      }

      const userMessage = { role: 'user', content: spokenText };
      const updatedConversation = [...conversation, userMessage];
      setConversation(updatedConversation);
      setTranscript('');

      try {
        const res = await api.post('/ai/interview/question', {
          topic,
          difficulty,
          conversation: updatedConversation,
        });

        const aiMessage = res.data.message;

        if (aiMessage.includes('INTERVIEW_COMPLETE')) {
          setIsComplete(true);
          const finalConv = [...updatedConversation, { role: 'assistant', content: 'Great effort! The interview is now complete. Click below to get your feedback.' }];
          setConversation(finalConv);
          speak('Great effort! The interview is now complete.');
        } else {
          const finalConv = [...updatedConversation, { role: 'assistant', content: aiMessage }];
          setConversation(finalConv);
          speak(aiMessage);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setStatus('idle');
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech error:', event.error);
      setStatus('idle');
      setTranscript('');
    };

    recognition.start();
  };

  const handleStopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      const res = await api.post('/ai/interview/feedback', {
        topic,
        difficulty,
        conversation,
      });

      const feedback = res.data;

      const sessionRes = await api.post('/session', {
        mode: 'interview',
        topic,
        difficulty,
        score: feedback.score,
        totalQuestions: 10,
        timeTaken: 0,
        conversation,
        feedback: feedback.overallFeedback,
        weakAreas: feedback.weakAreas,
      });

      navigate(`/results/${sessionRes.data._id}`, {
        state: { feedback, mode: 'interview' },
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <Navbar />

      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-white font-bold">{topic} Interview</h1>
            <p className="text-gray-400 text-sm capitalize">{difficulty} difficulty</p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-gray-400 hover:text-white text-sm transition"
          >
            Exit
          </button>
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {loading && conversation.length === 0 && (
            <div className="text-center text-gray-400 py-12">Starting interview...</div>
          )}

          {conversation.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xl px-5 py-3 rounded-xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-200'
              }`}>
                {msg.role === 'assistant' && (
                  <p className="text-xs text-gray-400 mb-1 font-semibold">AI Interviewer</p>
                )}
                {msg.content}
              </div>
            </div>
          ))}

          {/* Live transcript */}
          {transcript && (
            <div className="flex justify-end">
              <div className="max-w-xl px-5 py-3 rounded-xl text-sm bg-blue-600/40 text-white italic">
                {transcript}
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-900 border-t border-gray-800 px-6 py-6">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-3">
          {!isComplete ? (
            <>
              <div className="flex gap-4 items-center">
                <button
                  onClick={status === 'listening' ? handleStopListening : handleListen}
                  disabled={status === 'thinking' || loading}
                  className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl transition ${
                    status === 'listening'
                      ? 'bg-red-600 animate-pulse'
                      : status === 'thinking'
                      ? 'bg-yellow-600'
                      : 'bg-blue-600 hover:bg-blue-700'
                  } disabled:opacity-50`}
                >
                  {status === 'listening' ? '🛑' : status === 'thinking' ? '⏳' : '🎤'}
                </button>
              </div>
              <p className="text-gray-400 text-sm">
                {status === 'listening'
                  ? 'Listening... click to stop'
                  : status === 'thinking'
                  ? 'AI is thinking...'
                  : 'Click mic to speak your answer'}
              </p>
              <p className="text-gray-600 text-xs">
                Tip: Say "repeat" to hear the question again
              </p>
            </>
          ) : (
            <button
              onClick={handleFinish}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Generating feedback...' : 'See My Feedback →'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Interview;