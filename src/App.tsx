import { useState, useEffect, useRef } from 'react';
import './index.css';
import WordDisplay from './components/WordDisplay';
import Header from './components/Header';
import Results from './components/Results';
import Settings from './components/Settings';
import { generateWords } from './utils/words';

type TestMode = 'words' | 'time';
type TestDuration = 15 | 30 | 60;

const WORD_COUNT = 40;

function App() {
  const [words, setWords] = useState<string[]>([]);
  const [userInput, setUserInput] = useState('');
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [testStatus, setTestStatus] = useState<'waiting' | 'typing' | 'finished'>('waiting');

  // Settings State
  const [isCursiveMode, setIsCursiveMode] = useState(false);
  const [isPunctuationMode, setIsPunctuationMode] = useState(false);
  const [testMode, setTestMode] = useState<TestMode>('words');
  const [testDuration, setTestDuration] = useState<TestDuration>(30);

  // Stats State
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const [incorrectChars, setIncorrectChars] = useState(0);
  const [wpmHistory, setWpmHistory] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    resetTest();
  }, [isPunctuationMode, testMode, testDuration]);

  // Timer for time-based mode and WPM history tracking
  useEffect(() => {
    let interval: number | undefined;
    if (testStatus === 'typing' && startTime) {
      interval = setInterval(() => {
        const newElapsedTime = (Date.now() - startTime) / 1000;
        setElapsedTime(newElapsedTime);

        // WPM calculation for history
        const currentWpm = newElapsedTime > 0 ? (correctChars / 5) / (newElapsedTime / 60) : 0;
        setWpmHistory(prevHistory => [...prevHistory, currentWpm]);
        
        // Handle end of test for time mode
        if (testMode === 'time' && newElapsedTime >= testDuration) {
          setTestStatus('finished');
          clearInterval(interval);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [testStatus, startTime, correctChars, testMode, testDuration]);

  const resetTest = () => {
    setWords(generateWords(WORD_COUNT, isPunctuationMode));
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
    if (testStatus === 'waiting') {
      setTestStatus('typing');
      setStartTime(Date.now());
    }

    if (value.endsWith(' ')) {
      if (value.trim() === '') {
        setUserInput('');
        return;
      }
        
      const currentWord = words[activeWordIndex];
      const typedWord = value.trim();

      setIncorrectChars(prev => prev + Math.abs(currentWord.length - typedWord.length));
      for (let i = 0; i < Math.min(currentWord.length, typedWord.length); i++) {
        if (typedWord[i] === currentWord[i]) {
          setCorrectChars(prev => prev + 1);
        } else {
          setIncorrectChars(prev => prev + 1);
        }
      }
      setCorrectChars(prev => prev + 1); // For the space

      if (testMode === 'words' && activeWordIndex === words.length - 1) {
        setTestStatus('finished');
      } else {
        if (testMode === 'time' && activeWordIndex === words.length - 1) {
            setWords(prev => [...prev, ...generateWords(WORD_COUNT, isPunctuationMode)]);
        }
        setActiveWordIndex(prev => prev + 1);
        setUserInput('');
      }
      return;
    }

    setUserInput(value);
  };

  const appClasses = isCursiveMode ? 'cursive-mode' : '';

  return (
    <div className={appClasses}>
      <Header />
      {testStatus !== 'finished' && (
        <Settings 
          isCursiveMode={isCursiveMode}
          onCursiveToggle={() => setIsCursiveMode(!isCursiveMode)}
          isPunctuationMode={isPunctuationMode}
          onPunctuationToggle={() => setIsPunctuationMode(!isPunctuationMode)}
          testMode={testMode}
          onTestModeChange={setTestMode}
          testDuration={testDuration}
          onTestDurationChange={setTestDuration}
        />
      )}
      
      {testStatus !== 'finished' && (
        <WordDisplay 
          words={words} 
          activeWordIndex={activeWordIndex} 
          userInput={userInput} 
        />
      )}
      
      {testStatus === 'finished' && (
        <Results 
          correctChars={correctChars}
          incorrectChars={incorrectChars}
          duration={testMode === 'time' ? testDuration : elapsedTime}
          wpmHistory={wpmHistory}
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
    </div>
  );
}

export default App;