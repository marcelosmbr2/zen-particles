import React, { createContext, useContext, useState, useCallback } from 'react';
import { AppState, ShapeType } from './types';

const AppContext = createContext<AppState | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [shape, setShape] = useState<ShapeType>(ShapeType.SPHERE);
  const [color, setColor] = useState<string>('#60A5FA'); // Tailwind blue-400
  const [particleCount] = useState<number>(12000);
  
  // Hand tracking state
  const [handDistance, setHandDistance] = useState(0);
  const [handDetected, setHandDetected] = useState(false);
  const [gestureTension, setGestureTension] = useState(0);

  const setHandData = useCallback((dist: number, detected: boolean, tension: number) => {
    setHandDistance(dist);
    setHandDetected(detected);
    setGestureTension(tension);
  }, []);

  const resetState = useCallback(() => {
    setShape(ShapeType.SPHERE);
    setColor('#60A5FA');
  }, []);

  const value: AppState = {
    shape,
    color,
    particleCount,
    handDistance,
    handDetected,
    gestureTension,
    setShape,
    setColor,
    setHandData,
    resetState
  };

  return React.createElement(AppContext.Provider, { value }, children);
};

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppStore must be used within AppProvider");
  return context;
};