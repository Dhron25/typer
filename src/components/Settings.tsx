// src/components/Settings.tsx
import React from 'react';

type TestMode = 'words' | 'time';
type TestDuration = 15 | 30 | 60;

interface SettingsProps {
  isCursiveMode: boolean;
  onCursiveToggle: () => void;
  isPunctuationMode: boolean;
  onPunctuationToggle: () => void;
  testMode: TestMode;
  onTestModeChange: (mode: TestMode) => void;
  testDuration: TestDuration;
  onTestDurationChange: (duration: TestDuration) => void;
}

const Settings: React.FC<SettingsProps> = ({ 
  isCursiveMode, onCursiveToggle, 
  isPunctuationMode, onPunctuationToggle,
  testMode, onTestModeChange,
  testDuration, onTestDurationChange,
}) => {
  return (
    <div className="settings">
      <div className="settings-group">
        <button onClick={onCursiveToggle} className={isCursiveMode ? 'active' : ''}>
          Cursive
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
      {testMode === 'time' && (
        <div className="settings-group">
          <button onClick={() => onTestDurationChange(15)} className={testDuration === 15 ? 'active' : ''}>15s</button>
          <button onClick={() => onTestDurationChange(30)} className={testDuration === 30 ? 'active' : ''}>30s</button>
          <button onClick={() => onTestDurationChange(60)} className={testDuration === 60 ? 'active' : ''}>60s</button>
        </div>
      )}
    </div>
  );
};

export default Settings;