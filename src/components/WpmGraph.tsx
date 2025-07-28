// src/components/WpmGraph.tsx
import React from 'react';

interface WpmGraphProps {
  wpmHistory: number[];
}

const WpmGraph: React.FC<WpmGraphProps> = ({ wpmHistory }) => {
  if (wpmHistory.length <= 1) {
    return null; // Not enough data to draw a graph
  }

  const PADDING = 20;
  const SVG_WIDTH = 500;
  const SVG_HEIGHT = 100;
  const VIEWBOX_WIDTH = SVG_WIDTH;
  const VIEWBOX_HEIGHT = SVG_HEIGHT;

  const maxWpm = Math.max(...wpmHistory, 50); // Ensure graph isn't too flat
  const dataPoints = wpmHistory.map((wpm, index) => {
    const x = (index / (wpmHistory.length - 1)) * (VIEWBOX_WIDTH - PADDING * 2) + PADDING;
    const y = VIEWBOX_HEIGHT - ((wpm / maxWpm) * (VIEWBOX_HEIGHT - PADDING * 2) + PADDING);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="wpm-graph-container">
      <svg viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`} width={SVG_WIDTH} height={SVG_HEIGHT}>
        <polyline
          fill="none"
          stroke="var(--text-color)"
          strokeWidth="2"
          points={dataPoints}
        />
      </svg>
      <div className="graph-label">WPM Over Time</div>
    </div>
  );
};

export default WpmGraph;