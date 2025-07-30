// src/App.tsx
import { useState, useEffect, useRef } from 'react';
import './index.css';
import WordDisplay from './components/WordDisplay';
import Header from './components/Header';
import Results from './components/Results';
import Settings from './components/Settings';
import Keyboard from './components/Keyboard';
import { generateWords } from './utils/words';

type TestMode = 'words' | 'time';
type TestDuration = 15 | 30 | 60;
type CursorStyle = 'line' | 'block' | 'underline';
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
  const [cursorStyle, setCursorStyle] = useState<CursorStyle>('block');

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

  // Effect to reset the test when major settings change
  useEffect(() => {
    resetTest();
  }, [isPunctuationMode, testMode, testDuration, wordCount]);

  // Timer and WPM history effect
  useEffect(() => {
    let interval: number | undefined;
    if (testStatus === 'typing') {
      interval = setInterval(() => {
        setElapsedTime(() => {
          const newElapsedTime = (Date.now() - startTime!) / 1000;
          const currentWpm = newElapsedTime > 0 ? (correctChars / 5) / (newElapsedTime / 60) : 0;
          setWpmHistory(prevHistory => [...prevHistory, currentWpm]);
          
          if (testMode === 'time' && newElapsedTime >= testDuration) {
            setTestStatus('finished');
            clearInterval(interval);
          }
          return newElapsedTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [testStatus, startTime, correctChars, testMode, testDuration]);

  // Keyboard highlighting effect
  useEffect(() => {
    if (testStatus === 'typing' || testStatus === 'waiting') {
      const char = userInput.length > prevUserInput.current.length ? userInput[userInput.length - 1] : 'Backspace';
      setActiveKey(char);
      const timeoutId = setTimeout(() => setActiveKey(''), 150);
      prevUserInput.current = userInput;
      return () => clearTimeout(timeoutId);
    }
  }, [userInput, testStatus]);
  
  // Instant Reset Hotkey Effect
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        resetTest();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const resetTest = () => {
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
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (testStatus === 'finished') return;
    if (testStatus === 'waiting' && value.length > 0) {
      setTestStatus('typing');
      setStartTime(Date.now());
    }

    // --- THIS IS THE CORRECTED LOGIC ---
    if (value.endsWith(' ')) {
      const currentWord = words[activeWordIndex];
      const typedWord = value.trim();

      // Only advance if the typed word is a perfect match for the current word
      if (typedWord === currentWord) {
        // The word is correct, so update stats
        // We add the length of the word, plus 1 for the space.
        setCorrectChars(prev => prev + currentWord.length + 1);

        // Check if the test should end
        if (testMode === 'words' && activeWordIndex === wordCount - 1) {
          setTestStatus('finished');
          return; // Exit early to prevent clearing input on the final word
        }
        
        // Refill words if in time mode and getting low
        if (testMode === 'time' && activeWordIndex >= words.length - 5) {
            setWords(prev => [...prev, ...generateWords(wordCount, isPunctuationMode)]);
        }

        // Advance to the next word
        setActiveWordIndex(prev => prev + 1);
        setUserInput('');
      } else {
        // If it's not a perfect match, we don't advance.
        // We just update the input so the user can see their error.
        setUserInput(value);
      }
      return;
    }

    // For any other keypress (not a space), just update the input
    setUserInput(value);
  };

  const appClasses = `${isCursiveMode ? 'cursive-mode' : ''} cursor-${cursorStyle}`;

  return (
    <div className={appClasses} onClick={() => inputRef.current?.focus()}>
      {testStatus === 'waiting' && <Header />}

      <div className="main-content">
        {testStatus === 'waiting' && (
          <Settings 
            isCursiveMode={isCursiveMode} onCursiveToggle={() => setIsCursiveMode(!isCursiveMode)}
            isPunctuationMode={isPunctuationMode} onPunctuationToggle={() => setIsPunctuationMode(!isPunctuationMode)}
            testMode={testMode} onTestModeChange={setTestMode}
            testDuration={testDuration} onTestDurationChange={setTestDuration}
            wordCount={wordCount} onWordCountChange={setWordCount}
            cursorStyle={cursorStyle} onCursorStyleChange={setCursorStyle}
          />
        )}
        
        {testStatus !== 'finished' && (
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
        
        {testStatus !== 'finished' && <Keyboard activeKey={activeKey} />}
      </div>
      
      <input
        ref={inputRef} type="text" className="user-input"
        value={userInput} onChange={handleInputChange} disabled={testStatus === 'finished'}
        autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false"
      />
    </div>
  );
}

export default App;