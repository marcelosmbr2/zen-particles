import React, { useState } from 'react';
import { useAppStore } from '../store';
import { ShapeType } from '../types';
import { Camera, Palette, Sparkles, User, Heart, Flower, Circle, Disc, Zap, RotateCcw, HelpCircle, X, MousePointer2, MoveHorizontal, Grab, LayoutTemplate } from 'lucide-react';

const colors = [
  '#F87171', // Red
  '#FBBF24', // Amber
  '#34D399', // Emerald
  '#60A5FA', // Blue
  '#818CF8', // Indigo
  '#F472B6', // Pink
  '#FFFFFF', // White
];

const ShapeIcon = ({ type }: { type: ShapeType }) => {
  switch (type) {
    case ShapeType.SPHERE: return <Circle size={20} />;
    case ShapeType.HEART: return <Heart size={20} />;
    case ShapeType.SATURN: return <Disc size={20} />;
    case ShapeType.FLOWER: return <Flower size={20} />;
    case ShapeType.BUDDHA: return <User size={20} />;
    case ShapeType.FIREWORKS: return <Sparkles size={20} />;
    default: return <Circle size={20} />;
  }
};

const UI: React.FC = () => {
  const { shape, setShape, color, setColor, handDetected, handDistance, gestureTension, resetState } = useAppStore();
  const [showHelp, setShowHelp] = useState(false);
  const [showTemplates, setShowTemplates] = useState(true);

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 z-10">
      
      {/* Header */}
      <header className="flex justify-between items-start pointer-events-auto">
        <div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 tracking-tighter">
            ZEN PARTICLES
          </h1>
          <p className="text-gray-400 text-sm mt-1 flex items-center gap-2">
            <Camera size={14} /> 
            {handDetected ? "Hand Tracking Active" : "Waiting for Hands..."}
          </p>
        </div>

        {/* Top Right Controls */}
        <div className="flex gap-3">
             {/* Status Indicators (Mini) */}
             <div className="hidden md:flex gap-4 mr-4">
                <div className="bg-black/40 backdrop-blur-md rounded-lg p-2 border border-white/10 text-xs">
                    <div className="text-gray-400 mb-1">Scale</div>
                    <div className="w-16 h-1 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-blue-500 transition-all duration-100" 
                            style={{ width: `${handDetected ? handDistance * 100 : 0}%` }}
                        />
                    </div>
                </div>
                <div className="bg-black/40 backdrop-blur-md rounded-lg p-2 border border-white/10 text-xs">
                    <div className="text-gray-400 mb-1">Energy</div>
                    <div className="w-16 h-1 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-red-500 transition-all duration-100" 
                            style={{ width: `${handDetected ? gestureTension * 100 : 0}%` }}
                        />
                    </div>
                </div>
            </div>

            <button 
              onClick={() => setShowTemplates(!showTemplates)}
              className={`backdrop-blur-md border border-white/10 p-3 rounded-full text-white transition-all ${showTemplates ? 'bg-blue-500/20 text-blue-400 border-blue-500/50' : 'bg-black/40 hover:bg-white/10'}`}
              title={showTemplates ? "Hide Controls" : "Show Controls"}
            >
              <LayoutTemplate size={20} />
            </button>
            <button 
              onClick={() => setShowHelp(true)}
              className="bg-black/40 hover:bg-white/10 backdrop-blur-md border border-white/10 p-3 rounded-full text-white transition-colors"
              title="Instructions"
            >
              <HelpCircle size={20} />
            </button>
            <button 
              onClick={resetState}
              className="bg-black/40 hover:bg-white/10 backdrop-blur-md border border-white/10 p-3 rounded-full text-white transition-colors"
              title="Reset Scene"
            >
              <RotateCcw size={20} />
            </button>
        </div>
      </header>

      {/* Main Controls */}
      <div className="pointer-events-auto flex flex-col gap-4 items-end sm:items-center sm:flex-row sm:justify-center w-full">
        
        {showTemplates && (
          <>
            {/* Shape Selector */}
            <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl transition-all duration-300 animate-in slide-in-from-bottom-5">
              <div className="flex items-center gap-2 text-white/50 text-xs font-bold uppercase tracking-widest mb-3">
                <Zap size={12} /> Templates
              </div>
              <div className="grid grid-cols-3 gap-2 sm:flex">
                {Object.values(ShapeType).map((t) => (
                  <button
                    key={t}
                    onClick={() => setShape(t)}
                    className={`
                      flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200 w-20 h-20
                      ${shape === t 
                        ? 'bg-white/10 text-white shadow-lg scale-105 border border-white/20' 
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'}
                    `}
                  >
                    <ShapeIcon type={t} />
                    <span className="text-[10px] mt-2 font-medium">{t}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selector */}
            <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl h-fit animate-in slide-in-from-bottom-5 delay-75">
              <div className="flex items-center gap-2 text-white/50 text-xs font-bold uppercase tracking-widest mb-3">
                <Palette size={12} /> Essence
              </div>
              <div className="flex flex-row sm:flex-col gap-2">
                {colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${color === c ? 'border-white scale-110 shadow-[0_0_10px_currentColor]' : 'border-transparent hover:scale-110'}`}
                    style={{ backgroundColor: c, color: c }} // color for shadow
                  />
                ))}
              </div>
            </div>
          </>
        )}

      </div>
      
      {/* Footer Instructions (Brief) */}
      <div className="text-center text-white/30 text-xs mt-4 pointer-events-none animate-pulse">
        {!handDetected 
          ? "Show both hands to camera to interact" 
          : "Hands apart: Expand • Fists: Energy"}
      </div>

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200 pointer-events-auto">
          <div className="bg-gray-900/90 border border-white/10 rounded-3xl max-w-md w-full p-6 relative shadow-2xl ring-1 ring-white/10">
            <button 
              onClick={() => setShowHelp(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
            
            <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
              <Sparkles className="text-blue-400" /> Controls
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-500/20 p-3 rounded-xl text-blue-400">
                  <MoveHorizontal size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">Scale / Expansion</h3>
                  <p className="text-gray-400 text-sm">
                    Show both hands. Move them <strong>apart</strong> to expand the particles, and <strong>together</strong> to condense them.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-red-500/20 p-3 rounded-xl text-red-400">
                  <Grab size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">Energy / Chaos</h3>
                  <p className="text-gray-400 text-sm">
                    <strong>Clench your fists</strong> to inject chaotic energy and jitter into the particles. Open hands to stabilize.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-purple-500/20 p-3 rounded-xl text-purple-400">
                  <MousePointer2 size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">Camera</h3>
                  <p className="text-gray-400 text-sm">
                    <strong>Drag</strong> to rotate the view.<br/>
                    <strong>Scroll</strong> or <strong>Pinch</strong> to zoom in/out.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 text-center">
              <button 
                onClick={() => setShowHelp(false)}
                className="bg-white text-black font-bold py-2 px-8 rounded-full hover:scale-105 transition-transform"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UI;