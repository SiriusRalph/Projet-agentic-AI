import React, { useState } from 'react';
import axios from 'axios';

const API = 'http://127.0.0.1:8000';

function StartScreen({ goTo }) {
  const [patientCase, setPatientCase] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const startConsultation = async () => {
    if (!patientCase.trim()) {
      setError('Veuillez décrire votre cas avant de continuer.');
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
      setError('Erreur de connexion au serveur. Vérifiez que le backend est lancé.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="card">
        <h2>👤 Nouveau cas patient</h2>
        <p style={{ marginBottom: '16px', color: '#718096' }}>
          Décrivez brièvement votre situation médicale. 
          Un agent de diagnostic vous posera ensuite 5 questions.
        </p>

        <textarea
          rows={5}
          placeholder="Ex: J'ai mal à la gorge et de la fièvre depuis hier soir..."
          value={patientCase}
          onChange={e => setPatientCase(e.target.value)}
        />

        {error && <div className="error">{error}</div>}

        <button
          className="btn btn-primary"
          onClick={startConsultation}
          disabled={loading}
        >
          {loading ? '⏳ Démarrage en cours...' : '🚀 Démarrer la consultation'}
        </button>
      </div>

      <div className="card">
        <h3>ℹ️ Comment ça fonctionne ?</h3>
        <ol style={{ paddingLeft: '20px', lineHeight: '2' }}>
          <li>Vous décrivez votre cas initial</li>
          <li>L'agent vous pose 5 questions</li>
          <li>Le système génère une synthèse clinique</li>
          <li>Un médecin traitant valide et propose un traitement</li>
          <li>Un rapport final est généré</li>
        </ol>
      </div>
    </div>
  );
}

export default StartScreen;