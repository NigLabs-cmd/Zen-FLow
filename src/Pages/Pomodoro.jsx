import React, { useState, useEffect, useRef } from 'react'; 
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';

const Pomodoro = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const audioRef = useRef(null);

  // 1. Initial Audio Setup
  useEffect(() => {
    audioRef.current = new Audio('/piano-focus.mp3'); 
    audioRef.current.loop = true;
    return () => {
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  // 2. Music Fade-Out Logic
  const fadeOutMusic = () => {
    if (audioRef.current && !audioRef.current.paused) {
      let volume = 1;
      const fadeInterval = setInterval(() => {
        if (volume > 0.1) {
          volume -= 0.1;
          audioRef.current.volume = volume;
        } else {
          audioRef.current.pause();
          audioRef.current.volume = 1; // Reset for next time
          setIsMusicPlaying(false);
          clearInterval(fadeInterval);
        }
      }, 150); // Fades out over 1.5 seconds
    }
  };

  // 3. Integrated Timer & Music Logic
  useEffect(() => {
    let timer = null;
    if (isActive && timeLeft > 0) {
      // START MUSIC when timer starts
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().catch(e => console.log("Audio play blocked"));
        setIsMusicPlaying(true);
      }
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      // FADE MUSIC when timer ends
      setIsActive(false);
      fadeOutMusic();
      
      // Notify User
      const msg = isBreak ? "Break over! Back to work." : "Work session finished! Take a break.";
      alert(msg);
      
      // Switch Mode
      const nextMode = !isBreak;
      setIsBreak(nextMode);
      setTimeLeft(nextMode ? 5 * 60 : 25 * 60);
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft, isBreak]);

  // 4. Interaction Handlers
  const toggleTimer = () => {
    if (isActive) {
      // Pause music if manually pausing timer
      audioRef.current.pause();
      setIsMusicPlaying(false);
    }
    setIsActive(!isActive);
  };
  
  const resetTimer = () => {
    setIsActive(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0; // Rewind track
    }
    setIsMusicPlaying(false);
    setTimeLeft(isBreak ? 5 * 60 : 25 * 60);
  };

  const toggleMusicManually = () => {
    if (isMusicPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsMusicPlaying(!isMusicPlaying);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      {/* Mode Badge */}
      <div className={`mb-4 px-6 py-2 rounded-full font-bold uppercase tracking-widest text-sm transition-colors ${
        isBreak ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'
      }`}>
        {isBreak ? '☕ Break Time' : ' Deep Focus'}
      </div>
      
      {/* Timer Display */}
      <div className="text-[12rem] font-black leading-none mb-4 tabular-nums tracking-tighter text-gray-900 dark:text-white">
        {minutes}:{seconds.toString().padStart(2, '0')}
      </div>

      {/* Music Control */}
      <button 
        onClick={toggleMusicManually}
        className={`mb-12 flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
          isMusicPlaying 
            ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400' 
            : 'bg-white/5 border-white/10 text-gray-500 hover:text-white'
        }`}
      >
        {isMusicPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
        <span className="text-sm font-medium">Piano Focus Mode</span>
      </button>

      {/* Controls */}
      <div className="flex gap-6">
        <button 
          onClick={toggleTimer}
          className="bg-indigo-600 hover:bg-indigo-700 text-white w-24 h-24 rounded-full flex items-center justify-center shadow-2xl shadow-indigo-500/20 transition transform hover:scale-105 active:scale-95"
        >
          {isActive ? <Pause size={40} /> : <Play size={40} className="ml-1" fill="white" />}
        </button>
        <button 
          onClick={resetTimer}
          className="bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 w-24 h-24 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-white/10 transition"
        >
          <RotateCcw size={32} />
        </button>
      </div>
    </div>
  );
};

export default Pomodoro;