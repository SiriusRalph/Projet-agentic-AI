import React from 'react';
import ReactMarkdown from 'react-markdown';

function ReportScreen({ consultationData }) {
  const { finalReport } = consultationData;

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <div className="card-icon">📄</div>
          <div>
            <div className="card-title">Rapport médical final</div>
            <div className="card-desc">Consultation terminée avec succès</div>
          </div>
        </div>

        <span className="badge badge-green">✅ Consultation terminée</span>

        <div className="section-label">Contenu du rapport</div>
        <div className="success-box">
          <ReactMarkdown>{finalReport}</ReactMarkdown>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => window.print()}
        >
          🖨️ Imprimer / Sauvegarder le rapport
        </button>
      </div>

      <div className="disclaimer">
        ⚠️ Ce système ne remplace pas une consultation médicale. Rapport généré à titre académique uniquement.
      </div>
    </div>
  );
}

export default ReportScreen;