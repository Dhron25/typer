// src/components/Keyboard.tsx
import React from 'react';

const keyboardLayout = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
  [' '], // Spacebar
];

interface KeyboardProps {
  activeKey: string;
}

const Keyboard: React.FC<KeyboardProps> = React.memo(({ activeKey }) => {
  return (
    <div className="keyboard-container">
      {keyboardLayout.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map((key) => {
            const isActive = activeKey.toLowerCase() === key;
            const isSpacebar = key === ' ';
            let keyClass = 'key';
            if (isSpacebar) keyClass += ' key-space';
            if (isActive) keyClass += ' active';
            
            return <div key={key} className={keyClass}>{isSpacebar ? 'space' : key}</div>;
          })}
        </div>
      ))}
    </div>
  );
});

export default Keyboard;