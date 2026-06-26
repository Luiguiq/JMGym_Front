import { createContext, useContext, useEffect, useState } from 'react';

const AccessibilityContext = createContext(null);
const TEXT_SIZE_KEY = 'jmgym_text_size';
const MIN_TEXT_SIZE_LEVEL = 1;
const MAX_TEXT_SIZE_LEVEL = 4;

function getInitialTextSizeLevel() {
  const saved = Number(localStorage.getItem(TEXT_SIZE_KEY));
  if (saved >= MIN_TEXT_SIZE_LEVEL && saved <= MAX_TEXT_SIZE_LEVEL) return saved;
  return MIN_TEXT_SIZE_LEVEL;
}

export function AccessibilityProvider({ children }) {
  const [textSizeLevel, setTextSizeLevel] = useState(getInitialTextSizeLevel);

  useEffect(() => {
    document.documentElement.dataset.textSize = String(textSizeLevel);
    localStorage.setItem(TEXT_SIZE_KEY, String(textSizeLevel));
  }, [textSizeLevel]);

  function cycleTextSizeLevel() {
    setTextSizeLevel((level) => (level >= MAX_TEXT_SIZE_LEVEL ? MIN_TEXT_SIZE_LEVEL : level + 1));
  }

  return (
    <AccessibilityContext.Provider value={{ textSizeLevel, cycleTextSizeLevel, maxTextSizeLevel: MAX_TEXT_SIZE_LEVEL }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility debe usarse dentro de AccessibilityProvider');
  }
  return context;
}
