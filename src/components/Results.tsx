// src/components/Results.tsx
import React from 'react';
import WpmGraph from './WpmGraph'; // Import the new component

interface ResultsProps {
  correctChars: number;
  incorrectChars: number;
  duration: number;
  wpmHistory: number[]; // Add this prop
  onReset: () => void;
}

const Results: React.FC<ResultsProps> = ({ correctChars, incorrectChars, duration, wpmHistory, onReset }) => {
  const durationInMinutes = duration / 60;
  
  // Standard WPM
  const wpm = durationInMinutes > 0 ? (correctChars / 5) / durationInMinutes : 0;
  
  // Total characters typed
  const totalChars = correctChars + incorrectChars;
  
  // Raw WPM (includes incorrect characters)
  const rawWpm = durationInMinutes > 0 ? (totalChars / 5) / durationInMinutes : 0;
  
  // Accuracy
  const accuracy = totalChars > 0 ? (correctChars / totalChars) * 100 : 100;
  
  // Consistency Calculation
  const averageWpm = wpmHistory.reduce((a, b) => a + b, 0) / wpmHistory.length || 0;
  const wpmVariance = wpmHistory.map(w => (w - averageWpm) ** 2).reduce((a, b) => a + b, 0) / wpmHistory.length || 0;
  const wpmStdDev = Math.sqrt(wpmVariance);
  const consistency = averageWpm > 0 ? Math.max(0, 100 - (wpmStdDev / averageWpm) * 100) : 0;

  return (
    <div className="results-screen">
      <div className="results-stats">
        <div className="stat">
          <div className="label">WPM</div>
          <div className="value">{wpm.toFixed(0)}</div>
        </div>
        <div className="stat">
          <div className="label">Accuracy</div>
          <div className="value">{accuracy.toFixed(1)}%</div>
        </div>
      </div>

      <div className="detailed-results">
        <div className="detail-item">
          <span>Raw WPM</span>
          <span>{rawWpm.toFixed(0)}</span>
        </div>
        <div className="detail-item">
          <span>Consistency</span>
          <span>{consistency.toFixed(1)}%</span>
        </div>
        <div className="detail-item">
          <span>Characters</span>
          <span>{correctChars}/{incorrectChars}</span>
        </div>
      </div>

      <WpmGraph wpmHistory={wpmHistory} />

      <button className="reset-button" onClick={onReset}>
        Try Again
      </button>
    </div>
  );
};

export default Results;