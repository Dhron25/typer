// src/components/Character.tsx
import React from 'react';

type CharStatus = 'correct' | 'incorrect' | 'untyped';

interface CharacterProps {
  char: string;
  status: CharStatus;
}

const Character: React.FC<CharacterProps> = ({ char, status }) => {
  const getClassName = () => {
    if (status === 'correct') return 'character correct';
    if (status === 'incorrect') return 'character incorrect';
    return 'character';
  };

  return <span className={getClassName()}>{char}</span>;
};

export default Character;

