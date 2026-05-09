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

  return (
    <div className="app">
      <header className="app-header">
        <h1>🏥 Système de Diagnostic Médical</h1>
        <p>Orientation clinique préliminaire — Exercice académique</p>
      </header>

      <main className="app-main">
        {screen === 'start' && (
          <StartScreen goTo={goTo} />
        )}
        {screen === 'questions' && (
          <QuestionsScreen
            consultationData={consultationData}
            goTo={goTo}
          />
        )}
        {screen === 'physician' && (
          <PhysicianScreen
            consultationData={consultationData}
            goTo={goTo}
          />
        )}
        {screen === 'report' && (
          <ReportScreen
            consultationData={consultationData}
          />
        )}
      </main>

      <footer className="app-footer">
        ⚠️ Ce système ne remplace pas une consultation médicale.
      </footer>
    </div>
  );
}

export default App;