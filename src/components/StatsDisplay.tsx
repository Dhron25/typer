// src/components/StatsDisplay.tsx
import React from 'react';

interface StatsDisplayProps {
  wpm: number;
  accuracy: number;
}

const StatsDisplay: React.FC<StatsDisplayProps> = ({ wpm, accuracy }) => {
  return (
    <div className="stats-display">
      <div className="stat">
        <div className="label">WPM</div>
        <div className="value">{wpm.toFixed(0)}</div>
      </div>
      <div className="stat">
        <div className="label">Accuracy</div>
        <div className="value">{accuracy.toFixed(1)}%</div>
      </div>
    </div>
  );
};

export default StatsDisplay;
