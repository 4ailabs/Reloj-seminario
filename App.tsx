import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SCHEDULE_DATA, COLORS } from './constants';
import { ScheduleBlock } from './types';
import { PlayIcon, PauseIcon, ResetIcon, NextIcon, PrevIcon, FullScreenIcon, VolumeOnIcon, VolumeOffIcon } from './components/Icons';
import { playAlertSound } from './utils/sound';

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const App: React.FC = () => {
  // --- STATE ---
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(SCHEDULE_DATA[0].durationMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Refs for tracking intervals and preventing duplicate alerts
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasWarnedRef = useRef(false);
  const hasEndedRef = useRef(false);

  const currentBlock = SCHEDULE_DATA[currentBlockIndex];
  const nextBlock = SCHEDULE_DATA[currentBlockIndex + 1];

  const totalDuration = currentBlock.durationMinutes * 60;
  const progressPercent = Math.max(0, Math.min(100, ((totalDuration - timeLeft) / totalDuration) * 100));

  // --- DERIVED VISUAL STATE ---
  // Green: > 2 mins. Yellow: <= 2 mins (120s). Red: <= 0.
  let statusColor = 'text-white';
  let progressColor = COLORS[currentBlock.type] || 'bg-blue-500';
  
  if (timeLeft <= 0) {
    statusColor = 'text-red-500 animate-pulse';
    progressColor = 'bg-red-500';
  } else if (timeLeft <= 120) {
    statusColor = 'text-yellow-400';
    progressColor = 'bg-yellow-400';
  }

  // --- EFFECTS ---

  // 1. Clock
  useEffect(() => {
    const clockInterval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(clockInterval);
  }, []);

  // 2. Timer Logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft <= 0 && isRunning) {
      // Timer hit zero, keep running to show 00:00 or could go negative if desired. 
      // Requirement says "Rojo = tiempo agotado". Usually good to stop at 0 for visual clarity.
      setIsRunning(false);
      setTimeLeft(0);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timeLeft]);

  // 3. Alerts
  useEffect(() => {
    if (!soundEnabled || !isRunning) return;

    // Warning at 2:00 (120 seconds)
    if (timeLeft === 120 && !hasWarnedRef.current) {
      playAlertSound('warning');
      hasWarnedRef.current = true;
    }

    // End at 0:00
    if (timeLeft === 0 && !hasEndedRef.current) {
      playAlertSound('end');
      hasEndedRef.current = true;
    }
  }, [timeLeft, isRunning, soundEnabled]);

  // --- HANDLERS ---

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetBlock = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(currentBlock.durationMinutes * 60);
    hasWarnedRef.current = false;
    hasEndedRef.current = false;
  }, [currentBlock]);

  const changeBlock = (index: number) => {
    if (index >= 0 && index < SCHEDULE_DATA.length) {
      setCurrentBlockIndex(index);
      // We need to set the time based on the NEW block, can't rely on 'currentBlock' in this render cycle
      const newBlock = SCHEDULE_DATA[index];
      setTimeLeft(newBlock.durationMinutes * 60);
      setIsRunning(false);
      hasWarnedRef.current = false;
      hasEndedRef.current = false;
      
      // Auto-scroll to agenda item
      const el = document.getElementById(`block-${newBlock.id}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleNext = () => changeBlock(currentBlockIndex + 1);
  const handlePrev = () => changeBlock(currentBlockIndex - 1);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // --- RENDER HELPERS ---
  const getCurrentBlockColor = () => COLORS[currentBlock.type];

  return (
    <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden text-white selection:bg-purple-500 selection:text-white">
      
      {/* LEFT PANEL: TIMER (Main) */}
      <main className="flex-1 flex flex-col relative p-6 md:p-12 items-center justify-center transition-colors duration-500"
            style={{ 
              background: `linear-gradient(to bottom right, #0D1B2A 80%, ${getCurrentBlockColor()}20)` 
            }}>
        
        {/* Header: Clock & Branding */}
        <header className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-10">
          <div>
            <h1 className="text-xl font-bold opacity-70 tracking-widest text-gray-400">SEMINARIO DÍA 1</h1>
            <div className="text-3xl font-mono mt-1 opacity-90">
              {currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </div>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setSoundEnabled(!soundEnabled)} className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition">
              {soundEnabled ? <VolumeOnIcon /> : <VolumeOffIcon />}
            </button>
            <button onClick={toggleFullScreen} className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition">
              <FullScreenIcon />
            </button>
          </div>
        </header>

        {/* Big Timer Display */}
        <div className="flex flex-col items-center w-full max-w-5xl z-0">
          {/* Current Block Label */}
          <div 
            className="text-2xl md:text-4xl font-semibold mb-2 px-6 py-2 rounded-full shadow-lg border border-white/10 text-center"
            style={{ backgroundColor: getCurrentBlockColor() }}
          >
            {currentBlock.title}
          </div>

          {/* Timer Numbers */}
          <div className={`font-mono leading-none tracking-tighter my-8 select-none transition-colors duration-300 ${statusColor}`}
               style={{ fontSize: 'min(25vw, 240px)' }}>
            {formatTime(timeLeft)}
          </div>

          {/* Progress Bar */}
          <div className="w-full h-4 bg-gray-800 rounded-full overflow-hidden mb-8 border border-gray-700">
            <div 
              className={`h-full transition-all duration-1000 ease-linear ${progressColor}`} 
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Controls */}
          <div className="flex items-center gap-6 mt-4">
             <button 
              onClick={handlePrev}
              disabled={currentBlockIndex === 0}
              className="p-4 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition hover:scale-105 active:scale-95"
            >
              <PrevIcon />
            </button>

            <button 
              onClick={toggleTimer}
              className={`p-8 rounded-full shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95 ${
                isRunning ? 'bg-yellow-600 hover:bg-yellow-500' : 'bg-green-600 hover:bg-green-500'
              }`}
            >
              {isRunning ? <PauseIcon /> : <PlayIcon />}
            </button>

            <button 
              onClick={resetBlock}
              className="p-6 rounded-full bg-gray-700 hover:bg-gray-600 transition hover:scale-105 active:scale-95"
              title="Reiniciar Bloque"
            >
              <ResetIcon />
            </button>

            <button 
              onClick={handleNext}
              disabled={currentBlockIndex === SCHEDULE_DATA.length - 1}
              className="p-4 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition hover:scale-105 active:scale-95"
            >
              <NextIcon />
            </button>
          </div>

          {/* Next Block Preview */}
          {nextBlock && (
            <div className="mt-8 text-gray-400 text-lg flex items-center gap-2 opacity-60">
              <span>Siguiente:</span>
              <span className="font-semibold text-gray-200">{nextBlock.title}</span>
              <span className="text-sm border border-gray-600 px-2 py-0.5 rounded">
                {nextBlock.durationMinutes} min
              </span>
            </div>
          )}
        </div>
      </main>

      {/* RIGHT PANEL: AGENDA/SIDEBAR */}
      <aside className="w-full md:w-96 bg-gray-900/90 border-t md:border-t-0 md:border-l border-gray-800 flex flex-col h-[40vh] md:h-full overflow-hidden shadow-2xl z-20">
        <div className="p-4 bg-gray-900 border-b border-gray-800 font-bold text-gray-400 uppercase text-xs tracking-wider">
          Agenda del Día
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {SCHEDULE_DATA.map((block, index) => {
            const isCurrent = index === currentBlockIndex;
            const isPast = index < currentBlockIndex;
            
            return (
              <div 
                key={block.id}
                id={`block-${block.id}`}
                onClick={() => changeBlock(index)}
                className={`
                  relative p-3 rounded-lg cursor-pointer transition-all duration-200 border
                  ${isCurrent ? 'bg-gray-800 border-white/20 shadow-md translate-x-1' : 'border-transparent hover:bg-gray-800/50'}
                  ${isPast ? 'opacity-40' : 'opacity-100'}
                `}
              >
                {/* Left colored accent bar */}
                <div 
                  className="absolute left-0 top-2 bottom-2 w-1 rounded-r-sm"
                  style={{ backgroundColor: COLORS[block.type] }}
                />
                
                <div className="flex justify-between items-start pl-3">
                  <div className="flex-1">
                    <div className={`text-sm font-semibold ${isCurrent ? 'text-white' : 'text-gray-300'}`}>
                      {block.title}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                       <span className="bg-gray-950 px-1.5 rounded">{block.startTimeLabel}</span>
                       <span>•</span>
                       <span>{block.durationMinutes} min</span>
                    </div>
                  </div>
                  {isCurrent && isRunning && (
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse mt-1.5" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Total Time Progress for the day (Simplified visual) */}
        <div className="p-4 bg-gray-900 border-t border-gray-800 text-xs text-gray-500 text-center">
          {currentBlockIndex + 1} de {SCHEDULE_DATA.length} bloques completados
        </div>
      </aside>

    </div>
  );
};

export default App;