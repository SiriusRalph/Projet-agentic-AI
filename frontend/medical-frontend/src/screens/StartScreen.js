import React, { useState } from 'react';
import axios from 'axios';

const API = 'http://127.0.0.1:8000';

function StartScreen({ goTo }) {
  const [patientCase, setPatientCase] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const startConsultation = async () => {
    if (!patientCase.trim()) {
      setError('Veuillez décrire votre situation avant de continuer.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(`${API}/consultation/start`, {
        patient_case: patientCase
      });
      const data = response.data;
      goTo('questions', {
        threadId: data.thread_id,
        currentQuestion: data.message,
        questionCount: data.question_count
      });
    } catch (err) {
      setError('Impossible de contacter le serveur. Vérifiez que le backend est lancé.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <div className="card-icon">📋</div>
          <div>
            <div className="card-title">Nouvelle consultation</div>
            <div className="card-desc">Décrivez votre situation médicale pour commencer</div>
          </div>
        </div>

        <div className="section-label">Description du cas patient</div>
        <textarea
          rows={5}
          placeholder="Ex : J'ai mal à la gorge et de la fièvre depuis hier soir, j'ai du mal à avaler..."
          value={patientCase}
          onChange={e => setPatientCase(e.target.value)}
        />

        {error && <div className="error">{error}</div>}

        <button
          className="btn btn-primary"
          onClick={startConsultation}
          disabled={loading}
        >
          {loading ? '⏳ Initialisation...' : 'Démarrer la consultation →'}
        </button>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-icon">ℹ️</div>
          <div>
            <div className="card-title">Déroulement</div>
            <div className="card-desc">Comment fonctionne le système</div>
          </div>
        </div>

        <div className="info-grid">
          <div className="info-card">
            <div className="info-card-num">5</div>
            <div className="info-card-label">Questions posées</div>
          </div>
          <div className="info-card">
            <div className="info-card-num">IA</div>
            <div className="info-card-label">Synthèse générée</div>
          </div>
          <div className="info-card">
            <div className="info-card-num">👨‍⚕️</div>
            <div className="info-card-label">Médecin valide</div>
          </div>
        </div>

        <div className="disclaimer">
          ⚠️ Ce système ne remplace pas une consultation médicale. Exercice académique uniquement.
        </div>
      </div>
    </div>
  );
}

export default StartScreen;