import React from 'react';
import Scene from './components/Scene';
import UI from './components/UI';
import HandTracker from './components/HandTracker';
import { AppProvider } from './store';

const App: React.FC = () => {
  return (
    <AppProvider>
      <main className="relative w-full h-screen overflow-hidden bg-black text-white selection:bg-blue-500/30">
        {/* 3D Scene Background */}
        <Scene />
        
        {/* Logic Layer (Invisible/Hidden Video) */}
        <HandTracker />
        
        {/* UI Overlay */}
        <UI />
      </main>
    </AppProvider>
  );
};

export default App;
