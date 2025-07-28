// src/components/WordDisplay.tsx
import React, { useRef, useEffect } from 'react';

// Character Component (No changes needed)
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
  // --- THIS IS THE FIX ---
  // Use the correct, more general type for a ref being passed to a DOM element.
  cursorRef: React.Ref<HTMLSpanElement>;
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
      <span className="cursor" ref={cursorRef}>
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


// WordDisplay Component
interface WordDisplayProps {
  words: string[];
  activeWordIndex: number;
  userInput: string;
}
const WordDisplay: React.FC<WordDisplayProps> = ({ words, activeWordIndex, userInput }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (containerRef.current && cursorRef.current) {
      const container = containerRef.current;
      const cursor = cursorRef.current;
      const cursorPosition = cursor.offsetLeft;
      const containerWidth = container.offsetWidth;
      const scrollTarget = cursorPosition - (containerWidth / 2);

      container.scrollTo({
        left: scrollTarget,
        behavior: 'smooth',
      });
    }
  }, [activeWordIndex, userInput]);

  return (
    <div className="word-display-container" ref={containerRef}>
      <div className="words-wrapper">
        {words.map((word, index) => (
          <Word
            key={index}
            word={word}
            isActive={index === activeWordIndex}
            userInput={index === activeWordIndex ? userInput : ''}
            // The assignment now works because the prop type is correct
            cursorRef={index === activeWordIndex ? cursorRef : null}
          />
        ))}
      </div>
    </div>
  );
};

export default WordDisplay;