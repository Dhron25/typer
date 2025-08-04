// src/App.tsx
import { useState, useEffect, useRef, useCallback } from 'react';
import './index.css';
import WordDisplay from './components/WordDisplay';
import Header from './components/Header';
import Results from './components/Results';
import Settings from './components/Settings';
import Keyboard from './components/Keyboard';
import { generateWords } from './utils/words';

type TestMode = 'words' | 'time';
type TestDuration = 15 | 30 | 60;
type WordCount = 10 | 25 | 50 | 100;

function App() {
  // Core State
  const [words, setWords] = useState<string[]>([]);
  const [userInput, setUserInput] = useState('');
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [testStatus, setTestStatus] = useState<'waiting' | 'typing' | 'finished'>('waiting');

  // Settings State
  const [isCursiveMode, setIsCursiveMode] = useState(false);
  const [isPunctuationMode, setIsPunctuationMode] = useState(false);
  const [testMode, setTestMode] = useState<TestMode>('words');
  const [testDuration, setTestDuration] = useState<TestDuration>(30);
  const [wordCount, setWordCount] = useState<WordCount>(25);

  // Stats & Keyboard State
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const [incorrectChars, setIncorrectChars] = useState(0);
  const [wpmHistory, setWpmHistory] = useState<number[]>([]);
  const [activeKey, setActiveKey] = useState('');

  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const prevUserInput = useRef('');

  const resetTest = useCallback(() => {
    const count = testMode === 'words' ? wordCount : 200;
    setWords(generateWords(count, isPunctuationMode));
    setTestStatus('waiting');
    setActiveWordIndex(0);
    setUserInput('');
    setStartTime(null);
    setElapsedTime(0);
    setCorrectChars(0);
    setIncorrectChars(0);
    setWpmHistory([]);
    inputRef.current?.focus();
  }, [isPunctuationMode, testMode, wordCount]);

  // Initial setup and settings changes
  useEffect(() => {
    resetTest();
  }, [resetTest]);

  // Timer and WPM history effect
  useEffect(() => {
    let interval: number | undefined;
    if (testStatus === 'typing' && startTime) {
      interval = setInterval(() => {
        const newElapsedTime = (Date.now() - startTime) / 1000;
        setElapsedTime(newElapsedTime);
        
        const currentWpm = newElapsedTime > 0 ? (correctChars / 5) / (newElapsedTime / 60) : 0;
        setWpmHistory(prevHistory => [...prevHistory, currentWpm]);
        
        if (testMode === 'time' && newElapsedTime >= testDuration) {
          setTestStatus('finished');
          clearInterval(interval);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [testStatus, startTime, correctChars, testMode, testDuration]);

  // Keyboard highlighting effect
  useEffect(() => {
    if (testStatus !== 'finished') {
      const char = userInput.length > prevUserInput.current.length ? userInput[userInput.length - 1] : 'Backspace';
      setActiveKey(char);
      const timeoutId = setTimeout(() => setActiveKey(''), 150);
      prevUserInput.current = userInput;
      return () => clearTimeout(timeoutId);
    }
  }, [userInput, testStatus]);

  const startTest = () => {
    if (testStatus === 'waiting') {
      setTestStatus('typing');
      setStartTime(Date.now());
    }
  };
  
  // Hotkey Effect for starting and resetting
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        resetTest();
      } else if (e.key === 'Enter' && testStatus === 'waiting') {
        e.preventDefault();
        startTest();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [testStatus, resetTest]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (testStatus !== 'typing') return;

    if (value.endsWith(' ')) {
      const currentWord = words[activeWordIndex];
      const typedWord = value.trim();

      if (typedWord === currentWord) {
        setCorrectChars(prev => prev + currentWord.length + 1);

        if (testMode === 'words' && activeWordIndex === wordCount - 1) {
          setTestStatus('finished');
          return;
        }
        
        if (testMode === 'time' && activeWordIndex >= words.length - 20) {
          setWords(prev => [...prev, ...generateWords(100, isPunctuationMode)]);
        }

        setActiveWordIndex(prev => prev + 1);
        setUserInput('');
      } else {
        setIncorrectChars(prev => prev + 1);
        setUserInput(value);
      }
      return;
    }

    setUserInput(value);
  };

  const appClasses = isCursiveMode ? 'cursive-mode' : '';

  return (
    <div className={appClasses} onClick={() => inputRef.current?.focus()}>
      {testStatus !== 'finished' && <Header />}

      <div className="main-content">
        {testStatus !== 'finished' && (
          <Settings 
            isCursiveMode={isCursiveMode} onCursiveToggle={() => setIsCursiveMode(!isCursiveMode)}
            isPunctuationMode={isPunctuationMode} onPunctuationToggle={() => setIsPunctuationMode(!isPunctuationMode)}
            testMode={testMode} onTestModeChange={setTestMode}
            testDuration={testDuration} onTestDurationChange={setTestDuration}
            wordCount={wordCount} onWordCountChange={setWordCount}
          />
        )}
        
        {testStatus === 'waiting' && (
          <div className="start-prompt" onClick={startTest}>
            Click or press Enter to activate...
          </div>
        )}
        
        {testStatus === 'typing' && (
          <WordDisplay 
            words={words} activeWordIndex={activeWordIndex} userInput={userInput} 
          />
        )}
        
        {testStatus === 'finished' && (
          <Results 
            correctChars={correctChars} incorrectChars={incorrectChars}
            duration={testMode === 'time' ? testDuration : elapsedTime}
            wpmHistory={wpmHistory} onReset={resetTest}
          />
        )}
        
        {testStatus === 'typing' && <Keyboard activeKey={activeKey} />}
      </div>
      
      <input
        ref={inputRef}
        type="text"
        className="user-input"
        value={userInput}
        onChange={handleInputChange}
        disabled={testStatus === 'finished'}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
      />
    </div>
  );
}

export default App;