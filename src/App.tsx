// src/App.tsx
import { useState, useEffect, useRef } from 'react';
import './index.css';
import WordDisplay from './components/WordDisplay';
import { generateWords } from './utils/words';
import Header from './components/Header'; // Import Header
import TerminalIcon from './components/TerminalIcon'; // Import Icon

const WORD_COUNT = 40;

function App() {
  const [words, setWords] = useState<string[]>([]);
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // We are keeping the logic simple for this rebranding phase.
  // We'll re-add stats and more complex logic in the next phases.
  
  useEffect(() => {
    resetTest();
  }, []);
  
  const resetTest = () => {
    setActiveWordIndex(0);
    setUserInput('');
    setWords(generateWords(WORD_COUNT));
    inputRef.current?.focus();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value.endsWith(' ')) {
        // Simple progression for now
        setActiveWordIndex(prev => prev + 1);
        setUserInput('');
        if (activeWordIndex === words.length - 1) {
          resetTest(); // Auto-reset for now
        }
        return;
    }
    setUserInput(value);
  };
  
  // A simple keyboard shortcut to reset
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        resetTest();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    // The main div in App.tsx no longer needs a special class
    <>
      <Header />
      <TerminalIcon />
      <WordDisplay words={words} activeWordIndex={activeWordIndex} userInput={userInput} />
      <input
        ref={inputRef}
        type="text"
        className="user-input"
        value={userInput}
        onChange={handleInputChange}
        autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false"
      />
    </>
  );
}

export default App;