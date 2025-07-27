// src/App.tsx
import { useState, useEffect, useRef } from 'react';
import './index.css';
import WordDisplay from './components/WordDisplay';
import Header from './components/Header';
import TerminalIcon from './components/TerminalIcon';
import Results from './components/Results'; 
import { generateWords } from './utils/words';

const WORD_COUNT = 40;

function App() {
  const [words, setWords] = useState<string[]>([]);
  const [userInput, setUserInput] = useState('');
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  
  // 'typing' | 'finished'
  const [testStatus, setTestStatus] = useState<'typing' | 'finished'>('typing');

  // Stats State
  const [startTime, setStartTime] = useState<number | null>(null);
  const [correctChars, setCorrectChars] = useState(0);
  const [incorrectChars, setIncorrectChars] = useState(0);
  
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    resetTest();
  }, []);
  
  const resetTest = () => {
    setWords(generateWords(WORD_COUNT));
    setTestStatus('typing');
    setActiveWordIndex(0);
    setUserInput('');
    setStartTime(null);
    setCorrectChars(0);
    setIncorrectChars(0);
    inputRef.current?.focus();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (testStatus !== 'typing') return;

    // Start timer on first keypress
    if (!startTime) {
      setStartTime(Date.now());
    }

    // Handle word completion with spacebar
    if (value.endsWith(' ')) {
      // Don't advance if the input is empty
      if (value.trim() === '') {
          setUserInput('');
          return;
      }
        
      const currentWord = words[activeWordIndex];
      const typedWord = value.trim();

      // Update stats based on the completed word
      // A more accurate way is to check the already typed part of the word
      // This logic is simplified for now but can be improved
      for (let i = 0; i < currentWord.length; i++) {
        if (typedWord[i] === currentWord[i]) {
          setCorrectChars(prev => prev + 1);
        } else {
          setIncorrectChars(prev => prev + 1);
        }
      }
      // Add a correct char for the space only if word was fully typed
      if (typedWord.length >= currentWord.length) {
        setCorrectChars(prev => prev + 1);
      } else {
        // If word was not fully typed, the space is an error
        setIncorrectChars(prev => prev + 1);
      }


      // Check if it's the last word
      if (activeWordIndex === words.length - 1) {
        setTestStatus('finished');
        setUserInput(''); // Clear input on finish
      } else {
        setActiveWordIndex(prev => prev + 1);
        setUserInput('');
      }
      return;
    }

    setUserInput(value);
  };

  return (
    <>
      <Header />
      {testStatus === 'typing' && (
        <>
            <TerminalIcon />
            <WordDisplay 
                words={words} 
                activeWordIndex={activeWordIndex} 
                userInput={userInput} 
            />
        </>
      )}
      
      {testStatus === 'finished' && (
        <Results 
            correctChars={correctChars}
            incorrectChars={incorrectChars}
            startTime={startTime}
            onReset={resetTest}
        />
      )}
      
      <input
        ref={inputRef}
        type="text"
        className="user-input"
        value={userInput}
        onChange={handleInputChange}
        disabled={testStatus === 'finished'}
        autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false"
      />
    </>
  );
}

export default App;