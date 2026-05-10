import React, { useState } from 'react';
import StartScreen from './screens/StartScreen';
import QuestionsScreen from './screens/QuestionsScreen';
import PhysicianScreen from './screens/PhysicianScreen';
import ReportScreen from './screens/ReportScreen';
import './App.css';

function App() {
  const [screen, setScreen] = useState('start');
  const [consultationData, setConsultationData] = useState({
    threadId: null,
    currentQuestion: '',
    questionCount: 0,
    diagnosticSummary: '',
    interimCare: '',
    finalReport: ''
  });

  const goTo = (screenName, data = {}) => {
    setConsultationData(prev => ({ ...prev, ...data }));
    setScreen(screenName);
  };

  const stepIndex = { start: 0, questions: 1, physician: 2, report: 3 };
  const current = stepIndex[screen];

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-brand">
          <div className="header-logo">🏥</div>
          <div>
            <div className="header-title">MediAgent</div>
            <div className="header-subtitle">Système d'orientation clinique préliminaire</div>
          </div>
        </div>
        <div className="header-badge">⚠ Exercice académique</div>
      </header>

      <main className="app-main">
        {/* Steps indicator */}
        <div className="steps">
          {['Cas patient', 'Diagnostic', 'Médecin', 'Rapport'].map((label, i) => (
            <React.Fragment key={i}>
              <div className="step">
                <div className={`step-dot ${current === i ? 'active' : current > i ? 'done' : ''}`}>
                  {current > i ? '✓' : i + 1}
                </div>
              </div>
              {i < 3 && <div className={`step-line ${current > i ? 'done' : ''}`} />}
            </React.Fragment>
          ))}
        </div>

        {screen === 'start' && <StartScreen goTo={goTo} />}
        {screen === 'questions' && <QuestionsScreen consultationData={consultationData} goTo={goTo} />}
        {screen === 'physician' && <PhysicianScreen consultationData={consultationData} goTo={goTo} />}
        {screen === 'report' && <ReportScreen consultationData={consultationData} />}
      </main>

      <footer className="app-footer">
        ⚠️ Ce système ne remplace pas une consultation médicale — Exercice académique uniquement
      </footer>
    </div>
  );
}

export default App;