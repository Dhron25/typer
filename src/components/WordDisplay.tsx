// src/components/WordDisplay.tsx
import React from 'react';
import Character from './Character';

interface WordProps {
  word: string;
  isActive: boolean;
  userInput: string;
}

const Word: React.FC<WordProps> = ({ word, isActive, userInput }) => {
  if (!isActive) {
    return <span className="word">{word} </span>;
  }

  const typedChars = userInput.split('');

  return (
    <span className="word active">
      {word.split('').map((char, index) => {
        let status: 'correct' | 'incorrect' | 'untyped' = 'untyped';
        if (index < typedChars.length) {
          status = typedChars[index] === char ? 'correct' : 'incorrect';
        }
        return <Character key={index} char={char} status={status} />;
      })}
      {/* Our custom cursor will appear here */}
      <span className="cursor"> </span>
    </span>
  );
};


interface WordDisplayProps {
  words: string[];
  activeWordIndex: number;
  userInput: string;
}

const WordDisplay: React.FC<WordDisplayProps> = ({ words, activeWordIndex, userInput }) => {
  return (
    <div className="word-display">
      {words.map((word, index) => (
        <Word
          key={index}
          word={word}
          isActive={index === activeWordIndex}
          userInput={index === activeWordIndex ? userInput : ''}
        />
      ))}
    </div>
  );
};

export default WordDisplay;