// src/components/Settings.tsx
import React from 'react';

type TestMode = 'words' | 'time';
type TestDuration = 15 | 30 | 60;
type CursorStyle = 'line' | 'block' | 'underline';
type WordCount = 10 | 25 | 50 | 100;

interface SettingsProps {
  isCursiveMode: boolean;
  onCursiveToggle: () => void;
  isPunctuationMode: boolean;
  onPunctuationToggle: () => void;
  testMode: TestMode;
  onTestModeChange: (mode: TestMode) => void;
  testDuration: TestDuration;
  onTestDurationChange: (duration: TestDuration) => void;
  wordCount: WordCount;
  onWordCountChange: (count: WordCount) => void;
  cursorStyle: CursorStyle;
  onCursorStyleChange: (style: CursorStyle) => void;
}

const Settings: React.FC<SettingsProps> = ({ 
  isCursiveMode, onCursiveToggle, 
  isPunctuationMode, onPunctuationToggle,
  testMode, onTestModeChange,
  testDuration, onTestDurationChange,
  wordCount, onWordCountChange,
  cursorStyle, onCursorStyleChange,
}) => {
  return (
    <div className="settings">
      <div className="settings-group">
        <button onClick={onCursiveToggle} className={isCursiveMode ? 'active' : ''}>
          Challenge
        </button>
        <button onClick={onPunctuationToggle} className={isPunctuationMode ? 'active' : ''}>
          Punctuation
        </button>
      </div>
      <div className="settings-group">
        <button onClick={() => onTestModeChange('words')} className={testMode === 'words' ? 'active' : ''}>
          Words
        </button>
        <button onClick={() => onTestModeChange('time')} className={testMode === 'time' ? 'active' : ''}>
          Time
        </button>
      </div>

      {testMode === 'words' && (
        <div className="settings-group">
          <button onClick={() => onWordCountChange(10)} className={wordCount === 10 ? 'active' : ''}>10</button>
          <button onClick={() => onWordCountChange(25)} className={wordCount === 25 ? 'active' : ''}>25</button>
          <button onClick={() => onWordCountChange(50)} className={wordCount === 50 ? 'active' : ''}>50</button>
          <button onClick={() => onWordCountChange(100)} className={wordCount === 100 ? 'active' : ''}>100</button>
        </div>
      )}

      {testMode === 'time' && (
        <div className="settings-group">
          <button onClick={() => onTestDurationChange(15)} className={testDuration === 15 ? 'active' : ''}>15s</button>
          <button onClick={() => onTestDurationChange(30)} className={testDuration === 30 ? 'active' : ''}>30s</button>
          <button onClick={() => onTestDurationChange(60)} className={testDuration === 60 ? 'active' : ''}>60s</button>
        </div>
      )}

      <div className="settings-group">
        <button onClick={() => onCursorStyleChange('line')} className={cursorStyle === 'line' ? 'active' : ''}>Line</button>
        <button onClick={() => onCursorStyleChange('block')} className={cursorStyle === 'block' ? 'active' : ''}>Block</button>
        <button onClick={() => onCursorStyleChange('underline')} className={cursorStyle === 'underline' ? 'active' : ''}>Underline</button>
      </div>
    </div>
  );
};

export default Settings;