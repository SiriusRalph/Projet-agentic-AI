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

      const data = response.data;
      goTo('report', {
        finalReport: data.final_report
      });
    } catch (err) {
      setError('Erreur lors de la soumission de la revue médicale.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="card">
        <h2>👨‍⚕️ Revue du médecin traitant</h2>
        <span className="badge badge-orange">
          ⏳ En attente de validation médicale
        </span>

        <h3>Synthèse clinique préliminaire</h3>
        <div className="summary-box">
  <ReactMarkdown>{diagnosticSummary}</ReactMarkdown>
</div>

        <h3>Recommandation intermédiaire</h3>
        <div className="interim-box">
          {interimCare}
        </div>
      </div>

      <div className="card">
        <h3>📝 Traitement / Conduite à tenir</h3>
        <p style={{ color: '#718096', marginBottom: '12px' }}>
          En tant que médecin traitant, proposez un traitement 
          ou une conduite à tenir pour ce patient.
        </p>

        <textarea
          rows={5}
          placeholder="Ex: Prescrire Amoxicilline 1g x2/jour pendant 7 jours, Paracétamol 1g toutes les 6h, repos..."
          value={treatment}
          onChange={e => setTreatment(e.target.value)}
        />

        {error && <div className="error">{error}</div>}

        <button
          className="btn btn-success"
          onClick={submitReview}
          disabled={loading}
        >
          {loading ? '⏳ Génération du rapport...' : '✅ Valider et générer le rapport final'}
        </button>
      </div>
    </div>
  );
}

export default PhysicianScreen;