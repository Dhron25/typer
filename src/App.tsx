// src/App.tsx
import { useState, useEffect, useRef } from 'react';
import './index.css';
import WordDisplay from './components/WordDisplay';
import { generateWords } from './utils/words'; // Import the function

const WORD_COUNT = 40; // The number of words to generate for each test

function App() {
  const [words, setWords] = useState<string[]>([]);
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Generate words when the component first loads
    setWords(generateWords(WORD_COUNT));
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value.endsWith(' ')) {
      // For now, only allow advancing if the typed word is correct
      if (value.trim() === words[activeWordIndex]) {
          setActiveWordIndex((prevIndex) => prevIndex + 1);
          setUserInput('');
      }
    } else {
      setUserInput(value);
    }
  };

  return (
    <div className="app-container" onClick={() => inputRef.current?.focus()}>
      <WordDisplay words={words} activeWordIndex={activeWordIndex} userInput={userInput} />
      <input
        ref={inputRef}
        type="text"
        className="user-input"
        value={userInput}
        onChange={handleInputChange}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        // Add a check to prevent input if the test is over
        disabled={activeWordIndex >= words.length}
      />
    </div>
  );
}

export default App;