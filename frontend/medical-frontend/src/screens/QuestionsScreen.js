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
        <div className="card-header">
          <div className="card-icon">🩺</div>
          <div>
            <div className="card-title">Agent de diagnostic</div>
            <div className="card-desc">Répondez aux questions pour établir la synthèse clinique</div>
          </div>
        </div>

        <div className="progress-wrap">
          <div className="progress-top">
            <span className="progress-label">Progression</span>
            <span className="progress-count">Question {questionNum} / 5</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="question-box">{question}</div>

        <div className="section-label">Votre réponse</div>
        <textarea
          rows={4}
          placeholder="Décrivez en détail..."
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) submitAnswer(); }}
        />
        <p className="hint">Ctrl+Entrée pour envoyer rapidement</p>

        {error && <div className="error">{error}</div>}

        <button
          className="btn btn-primary"
          onClick={submitAnswer}
          disabled={loading}
        >
          {loading ? '⏳ Traitement en cours...' : 'Envoyer →'}
        </button>
      </div>
    </div>
  );
}

export default QuestionsScreen;