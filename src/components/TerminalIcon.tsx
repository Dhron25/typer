// src/components/TerminalIcon.tsx
import React from 'react';

const TerminalIcon: React.FC = () => {
  return (
    <svg
      className="terminal-icon"
      xmlns="http://www.w3.org/2000/svg"
      width="100"
      height="100"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 17l6-6-6-6" />
      <line x1="12" y1="19" x2="20" y2="19" />
      <rect x="2" y="3" width="20" height="18" rx="2" ry="2" />
    </svg>
  );
};

export default TerminalIcon;