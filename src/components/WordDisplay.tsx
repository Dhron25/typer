// src/components/WordDisplay.tsx
import React, { useRef, useEffect } from 'react';

// Character Component (No changes needed here)
type CharStatus = 'correct' | 'incorrect' | 'untyped';
interface CharacterProps {
  char: string;
  status: CharStatus;
}
const Character: React.FC<CharacterProps> = React.memo(({ char, status }) => {
  const getClassName = () => {
    if (status === 'correct') return 'character correct';
    if (status === 'incorrect') return 'character incorrect';
    return 'character untyped';
  };
  return <span className={getClassName()}>{char}</span>;
});


// Word Component
interface WordProps {
  word: string;
  isActive: boolean;
  userInput: string;
  cursorRef?: React.RefObject<HTMLSpanElement | null>; // Ref for the cursor
}
const Word: React.FC<WordProps> = React.memo(({ word, isActive, userInput, cursorRef }) => {
  if (!isActive) {
    return <span className="word">{word} </span>;
  }

  const typedChars = userInput.split('');
  const remainingChars = word.substring(userInput.length).split('');

  return (
    <span className="word active">
      {typedChars.map((char, index) => (
        <Character 
          key={`typed-${index}`} 
          char={char} 
          status={word[index] === char ? 'correct' : 'incorrect'} 
        />
      ))}
      {/* Attach the ref to the cursor span */}
      <span className="cursor" ref={cursorRef || undefined}>
        {remainingChars.length > 0 ? remainingChars[0] : ' '}
      </span>
      {remainingChars.slice(1).map((char, index) => (
         <Character 
            key={`untyped-${index}`} 
            char={char} 
            status={'untyped'} 
        />
      ))}
      {' '}
    </span>
  );
});


// WordDisplay Component - THIS IS WHERE THE SCROLLING LOGIC LIVES
interface WordDisplayProps {
  words: string[];
  activeWordIndex: number;
  userInput: string;
}
const WordDisplay: React.FC<WordDisplayProps> = ({ words, activeWordIndex, userInput }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLSpanElement | null>(null);

  // This effect handles the smooth scrolling
  useEffect(() => {
    if (containerRef.current && cursorRef.current) {
      const container = containerRef.current;
      const cursor = cursorRef.current;

      // Get the position of the cursor relative to the start of the words-wrapper
      const cursorPosition = cursor.offsetLeft;
      // Get the width of the visible container
      const containerWidth = container.offsetWidth;

      // Calculate the desired scroll position to center the cursor
      const scrollTarget = cursorPosition - (containerWidth / 2);

      // Animate the scroll
      container.scrollTo({
        left: scrollTarget,
        behavior: 'smooth',
      });
    }
  }, [activeWordIndex, userInput]); // Re-run whenever the user types or moves to a new word

  return (
    <div className="word-display-container" ref={containerRef}>
      <div className="words-wrapper">
        {words.map((word, index) => (
          <Word
            key={index}
            word={word}
            isActive={index === activeWordIndex}
            userInput={index === activeWordIndex ? userInput : ''}
            // Pass the ref only to the active word
            cursorRef={index === activeWordIndex ? cursorRef : undefined}
          />
        ))}
      </div>
    </div>
  );
};

export default WordDisplay;