// src/App.tsx
import { useState, useEffect, useRef } from 'react';
import './index.css';
import WordDisplay from './components/WordDisplay';
import StatsDisplay from './components/StatsDisplay';
import { generateWords } from './utils/words';

const WORD_COUNT = 40;

function App() {
  const [words, setWords] = useState<string[]>([]);
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Stats State
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const [totalChars, setTotalChars] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    resetTest(); // Initialize the test on first load
  }, []);

  // Timer logic
  useEffect(() => {
    let interval: number | undefined;
    if (isTyping) {
      interval = setInterval(() => {
        if (startTime) {
            setElapsedTime((Date.now() - startTime) / 1000);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTyping, startTime]);
  
  // Keyboard shortcut for resetting (e.g., Tab key)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault(); // Prevent focus from changing
        resetTest();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []); // Empty dependency array ensures this runs only once

  const resetTest = () => {
    setIsTyping(false);
    setStartTime(null);
    setElapsedTime(0);
    setActiveWordIndex(0);
    setUserInput('');
    setCorrectChars(0);
    setTotalChars(0);
    setWords(generateWords(WORD_COUNT));
    inputRef.current?.focus();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (!isTyping && value.length > 0) {
      setIsTyping(true);
      setStartTime(Date.now());
    }

    // Handle word completion
    if (value.endsWith(' ')) {
      // Prevent advancing on empty space or if test is done
      if (value.trim() === '' || activeWordIndex >= words.length) {
        return;
      }

      const currentWord = words[activeWordIndex];
      const typedWord = value.trim();

      // Update character counts for stats
      setTotalChars(prev => prev + currentWord.length + 1); // +1 for the space
      for (let i = 0; i < Math.min(typedWord.length, currentWord.length); i++) {
        if (typedWord[i] === currentWord[i]) {
          setCorrectChars(prev => prev + 1);
        }
      }
      if (typedWord.length === currentWord.length) {
        setCorrectChars(prev => prev + 1); // Count the space as correct only if the word was correct
      }
      
      // Stop the test if it's the last word
      if (activeWordIndex === words.length - 1) {
        setIsTyping(false);
      }
      
      setActiveWordIndex((prev) => prev + 1);
      setUserInput('');

      return;
    }

    setUserInput(value);
  };

  // Calculate WPM and Accuracy
  const wpm = elapsedTime > 0 ? (correctChars / 5) / (elapsedTime / 60) : 0;
  const accuracy = totalChars > 0 ? (correctChars / totalChars) * 100 : 100;
  
  // Determine if the game is over to disable input
  const isGameOver = activeWordIndex >= words.length;

  return (
    <div className="app-container" onClick={() => inputRef.current?.focus()}>
      <StatsDisplay wpm={wpm} accuracy={accuracy} />
      <WordDisplay words={words} activeWordIndex={activeWordIndex} userInput={userInput} />
      <button className="reset-button" onClick={resetTest}>
        Press <kbd>Tab</kbd> to reset
      </button>
      <input
        ref={inputRef}
        type="text"
        className="user-input"
        value={userInput}
        onChange={handleInputChange}
        disabled={isGameOver}
        autoComplete="off" 
        autoCorrect="off" 
        autoCapitalize="off" 
        spellCheck="false"
      />
    </div>
  );
}

export default App;

