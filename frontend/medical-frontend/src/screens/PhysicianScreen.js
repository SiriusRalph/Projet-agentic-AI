import React, { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

const API = 'http://127.0.0.1:8000';

function PhysicianScreen({ consultationData, goTo }) {
  const { threadId, diagnosticSummary, interimCare } = consultationData;
  const [treatment, setTreatment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submitReview = async () => {
    if (!treatment.trim()) {
      setError('Veuillez entrer un traitement ou une conduite à tenir.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(`${API}/consultation/physician`, {
        thread_id: threadId,
        physician_treatment: treatment
      });
      goTo('report', { finalReport: response.data.final_report });
    } catch (err) {
      setError('Erreur lors de la soumission.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <div className="card-icon">👨‍⚕️</div>
          <div>
            <div className="card-title">Revue du médecin traitant</div>
            <div className="card-desc">Validation humaine requise avant le rapport final</div>
          </div>
        </div>

        <span className="badge badge-orange">⏳ En attente de validation médicale</span>

        <div className="section-label">Synthèse clinique préliminaire</div>
        <div className="info-box">
          <ReactMarkdown>{diagnosticSummary}</ReactMarkdown>
        </div>

        <div className="section-label">Recommandation intermédiaire</div>
        <div className="warning-box">{interimCare}</div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-icon">✍️</div>
          <div>
            <div className="card-title">Traitement / Conduite à tenir</div>
            <div className="card-desc">En tant que médecin, proposez votre recommandation</div>
          </div>
        </div>

        <textarea
          rows={5}
          placeholder="Ex: Amoxicilline 1g x2/jour pendant 7 jours, Paracétamol 1g toutes les 6h, repos..."
          value={treatment}
          onChange={e => setTreatment(e.target.value)}
        />

        {error && <div className="error">{error}</div>}

        <button
          className="btn btn-success"
          onClick={submitReview}
          disabled={loading}
        >
          {loading ? '⏳ Génération du rapport...' : '✅ Valider et générer le rapport'}
        </button>
      </div>
    </div>
  );
}

export default PhysicianScreen;