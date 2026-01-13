import React, { useState, useEffect } from 'react';
import { Play, Square, Music, Headphones } from 'lucide-react';

const BODY_PARTS = ['Chest', 'Back', 'Legs', 'Arms', 'Shoulders', 'Cardio'];

const Gym = ({ onMusicLoad, currentMusic }) => { 
  const [activePart, setActivePart] = useState('Chest');
  const [inputUrl, setInputUrl] = useState(''); // What the user types
  const [embedUrl, setEmbedUrl] = useState(''); // The converted link
  const [timer, setTimer] = useState(0);
  const [isTracking, setIsTracking] = useState(false);

  // Timer Logic
  useEffect(() => {
    let interval;
    if (isTracking) {
      interval = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isTracking]);

  // LINK PARSER: Handles Spotify, YouTube, and YouTube Music
const handleLoadMusic = () => {
    let finalUrl = '';
    try {
      const url = new URL(inputUrl);
      const urlParams = new URLSearchParams(url.search);
      const listId = urlParams.get('list');
      const videoId = urlParams.get('v') || url.pathname.split('/').pop();

      if (inputUrl.includes('spotify.com')) {
        finalUrl = inputUrl.replace('/playlist/', '/embed/playlist/');
      } else if (listId) {
        // This ensures the whole playlist plays
        finalUrl = `https://www.youtube.com/embed/videoseries?list=${listId}&autoplay=1`;
      } else {
        finalUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      }

      // This sends the link to the player in App.jsx
      onMusicLoad(finalUrl); 
      
    } catch (e) {
      alert("Please paste a valid YouTube or Spotify link");
    }
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 px-4">
      <header>
        <h1 className="text-3xl font-bold">Gym Tracker</h1>
        <p className="text-gray-500">Track your sets and stay in the zone.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Side: Timer & Workout Control */}
        <div className="bg-[#121212] p-8 rounded-[2.5rem] border border-white/10 shadow-xl">
          <div className="flex gap-2 mb-8 flex-wrap">
            {BODY_PARTS.map(part => (
              <button
                key={part}
                onClick={() => setActivePart(part)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                  activePart === part 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                  : 'bg-white/5 border border-white/10 text-gray-400'
                }`}
              >
                {part}
              </button>
            ))}
          </div>

          <div className="text-7xl font-mono font-black mb-10 text-center tracking-tighter text-indigo-600 dark:text-indigo-400">
            {formatTime(timer)}
          </div>

          <div className="flex justify-center">
            {!isTracking ? (
              <button 
                onClick={() => setIsTracking(true)} 
                className="w-full flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-2xl font-bold transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl shadow-indigo-500/20"
              >
                <Play size={24} fill="currentColor" /> START {activePart.toUpperCase()}
              </button>
            ) : (
              <button 
                onClick={() => {setIsTracking(false); setTimer(0);}} 
                className="w-full flex items-center justify-center gap-3 bg-red-500 hover:bg-red-600 text-white py-5 rounded-2xl font-bold transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl shadow-red-500/20"
              >
                <Square size={24} fill="currentColor" /> STOP WORKOUT
              </button>
            )}
          </div>
        </div>
       {/* Right Side: Music Center */}
<div className="space-y-6">
  <div className="flex items-center gap-2 text-xl font-bold">
    <Music className="text-indigo-500" />
    <span>Music Center</span>
  </div>

  <div className="flex gap-2">
    <input 
      type="text" 
      placeholder="Paste Spotify or YT Music Link..."
      className="flex-1 bg-white/5 p-4 rounded-2xl outline-none border border-white/10 focus:border-indigo-500 transition text-sm text-white"
      value={inputUrl}
      onChange={(e) => setInputUrl(e.target.value)}
    />
    <button 
      onClick={handleLoadMusic}
      className="bg-indigo-600 text-white px-6 rounded-2xl font-bold hover:bg-indigo-700 transition"
    >
      Load
    </button>
  </div>

  {/* The Player Box - Directly below the button */}
 <div className="aspect-video w-full bg-white/5 rounded-[2rem] overflow-hidden border border-white/10 shadow-xl mt-6">
  {currentMusic ? (
    <iframe
      src={currentMusic}
      width="100%"
      height="100%"
      frameBorder="0"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
      title="Gym Playlist"
    ></iframe>
  ) : (
    <div className="flex flex-col items-center justify-center h-full text-gray-500 opacity-50">
      <Music size={40} className="mb-2" />
      <p className="text-xs">Paste a link and click Load to see your playlist</p>
    </div>
  )}
</div>
</div>
      </div>
    </div>
  );
};

export default Gym;