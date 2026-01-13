import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { supabase } from './utils/supabase';
import { CheckCircle, Dumbbell, Clock, LogOut } from 'lucide-react';
import { MessageSquare } from 'lucide-react';


// Pages
import Login from './Pages/Login';
import Tasks from './Pages/Tasks';
import Pomodoro from './Pages/Pomodoro';
import Gym from './Pages/Gym';

function App() {
  const [session, setSession] = useState(null);
  const [musicUrl, setMusicUrl] = React.useState('');

 useEffect(() => {
    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // 2. This is the "Magic" listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      
      // If the user logs in (even in another tab), 
      // this tab will now see the session and show the Tasks page!
      if (event === 'SIGNED_IN') {
        console.log('User signed in successfully!');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // IF NOT LOGGED IN: Show Login
  if (!session) {
    return <Login />;
  }



// 2. Add this function to handle music updates from other pages
const updateMusic = (url) => {
  setMusicUrl(url);
};

  // IF LOGGED IN: Show the App
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#050505] text-white">
        {/* Navigation Dock */}
        <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-2xl border border-white/10 px-8 py-4 rounded-full flex gap-10 z-50 shadow-2xl">
          <Link to="/" className="hover:text-indigo-400 transition"><CheckCircle size={24} /></Link>
          <Link to="/pomodoro" className="hover:text-indigo-400 transition"><Clock size={24} /></Link>
          <Link to="/gym" className="hover:text-indigo-400 transition"><Dumbbell size={24} /></Link>
          <button onClick={() => supabase.auth.signOut()} className="hover:text-red-400 transition">
            <LogOut size={24} />
          </button>
        </nav>
        {/* Global Music Player - Placed here so it stays alive during navigation */}
{/* {musicUrl && (
  <div className="fixed top-6 right-6 z-50 w-80"> 
    <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black/80 backdrop-blur-md">
       <iframe
        src={musicUrl}
        width="100%"
        height="152"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      ></iframe>
      <button 
        onClick={() => setMusicUrl('')}
        className="absolute top-2 right-2 bg-white/10 hover:bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center transition-colors"
      >
        ✕
      </button>
    </div>
  </div>
)} */}

        <main className="max-w-4xl mx-auto pt-12 pb-32 px-4">
          <Routes>
            <Route path="/" element={<Tasks />} />
            <Route path="/pomodoro" element={<Pomodoro />} />
            <Route 
  path="/gym" 
  element={<Gym onMusicLoad={updateMusic} currentMusic={musicUrl} />} 
/>
          </Routes>
        </main>
        {/* Feedback Button */}
<a 
  href="https://docs.google.com/forms/d/e/1FAIpQLSf91h4E3Ds2sds8eMss9PvZoBzwodyRBE9bgukg9HETrUMU2g/viewform?usp=header" 
  target="_blank" 
  rel="noopener noreferrer"
  className="fixed bottom-8 right-8 bg-white/10 hover:bg-indigo-600 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl border border-white/10 transition-all group flex items-center gap-2 z-50"
>
  <MessageSquare size={20} className="group-hover:scale-110 transition-transform" />
  <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out font-medium whitespace-nowrap">
    Give Feedback
  </span>
</a>
      </div>
    </BrowserRouter>
  );
}

export default App;