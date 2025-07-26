// src/components/WordDisplay.tsx
import React from 'react';

interface WordProps {
  text: string;
  active: boolean;
}

const Word: React.FC<WordProps> = ({ text, active }) => {
  return <span className={`word ${active ? 'active' : ''}`}>{text} </span>;
};

interface WordDisplayProps {
  words: string[];
  activeWordIndex: number;
}

const WordDisplay: React.FC<WordDisplayProps> = ({ words, activeWordIndex }) => {
  return (
    <div className="word-display">
      {words.map((word, index) => (
        <Word key={index} text={word} active={index === activeWordIndex} />
      ))}
    </div>
  );
};

export default WordDisplay;