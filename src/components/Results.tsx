// src/components/Results.tsx
import React from 'react';

interface ResultsProps {
  correctChars: number;
  incorrectChars: number;
  startTime: number | null;
  onReset: () => void;
}

const Results: React.FC<ResultsProps> = ({ correctChars, incorrectChars, startTime, onReset }) => {
  if (startTime === null) {
    return null; // Don't render if the test hasn't started
  }

  const durationInMinutes = (Date.now() - startTime) / 1000 / 60;
  const wpm = (correctChars / 5) / durationInMinutes;
  const totalChars = correctChars + incorrectChars;
  const accuracy = totalChars > 0 ? (correctChars / totalChars) * 100 : 100;

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
      <div className="results-details">
        Characters: {correctChars}/{incorrectChars} (correct/incorrect)
      </div>
      <button className="reset-button" onClick={onReset}>
        Try Again
      </button>
    </div>
  );
};
export default Results;


