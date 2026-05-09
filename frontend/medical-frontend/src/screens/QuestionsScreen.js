import React, { useState } from 'react';
import axios from 'axios';

const API = 'http://127.0.0.1:8000';

function QuestionsScreen({ consultationData, goTo }) {
  const { threadId, currentQuestion } = consultationData;
  const [answer, setAnswer] = useState('');
  const [question, setQuestion] = useState(currentQuestion);
  const [questionNum, setQuestionNum] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submitAnswer = async () => {
    if (!answer.trim()) {
      setError('Veuillez entrer une réponse avant de continuer.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API}/consultation/resume`, {
        thread_id: threadId,
        answer: answer
      });

      const data = response.data;

      if (data.status === 'waiting_physician') {
        goTo('physician', {
          diagnosticSummary: data.diagnostic_summary,
          interimCare: data.interim_care
        });
      } else {
        setQuestion(data.message);
        setQuestionNum(prev => prev + 1);
        setAnswer('');
      }
    } catch (err) {
      setError('Erreur lors de l\'envoi de la réponse.');
    } finally {
      setLoading(false);
    }
  };

  const progress = (questionNum / 5) * 100;

  return (
    <div>
      <div className="card">
        <h2>💬 Questions du diagnostic</h2>

        <div className="progress-label">
          Question {questionNum} sur 5
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="summary-box">
          🩺 {question}
        </div>

        <textarea
          rows={4}
          placeholder="Votre réponse..."
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && e.ctrlKey) submitAnswer();
          }}
        />

        <p style={{ fontSize: '0.8rem', color: '#a0aec0', marginTop: '6px' }}>
          Ctrl+Entrée pour envoyer
        </p>

        {error && <div className="error">{error}</div>}

        <button
          className="btn btn-primary"
          onClick={submitAnswer}
          disabled={loading}
        >
          {loading ? '⏳ Analyse en cours...' : 'Envoyer la réponse →'}
        </button>
      </div>
    </div>
  );
}

export default QuestionsScreen;