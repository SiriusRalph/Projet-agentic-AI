import React from 'react';
import ReactMarkdown from 'react-markdown';

function ReportScreen({ consultationData }) {
  const { finalReport } = consultationData;

  const printReport = () => {
    window.print();
  };

  return (
    <div>
      <div className="card">
        <h2>📋 Rapport médical final</h2>
        <span className="badge badge-green">✅ Consultation terminée</span>

        <div className="report-box">
          <ReactMarkdown>{finalReport}</ReactMarkdown>
        </div>

        <button
          className="btn btn-primary"
          onClick={printReport}
          style={{ marginTop: '20px' }}
        >
          🖨️ Imprimer / Sauvegarder le rapport
        </button>
      </div>

      <div className="card">
        <p style={{ 
          textAlign: 'center', 
          color: '#c53030', 
          fontWeight: '600' 
        }}>
          ⚠️ Ce système ne remplace pas une consultation médicale.
          Ce rapport est généré à titre académique uniquement.
        </p>
      </div>
    </div>
  );
}

export default ReportScreen;