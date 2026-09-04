import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import heroGraphic from '../assets/hero-graphic.jpg';
import featureGraphic from '../assets/feature-graphic.jpg';

const LandingPage = () => {
  return (
    <div className="flex flex-col text-gray-900 font-sans" style={{ fontFamily: "'Just Another Hand', cursive" }}>
      {/* Hero Section */}
      <div className="min-h-screen flex flex-col relative overflow-hidden bg-gray-50">
        {/* Blurred Background */}
        <div 
          className="absolute inset-0 z-0" 
          style={{ 
            backgroundImage: "url('/two.webp')", 
            backgroundSize: 'cover', 
            backgroundPosition: 'center'
          }} 
        />
        {/* Grainy Texture Overlay */}
        <div 
          className="absolute inset-0 z-0 opacity-15 pointer-events-none mix-blend-overlay"
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }} 
        />

        {/* Header */}
        <header className="w-full max-w-7xl mx-auto px-6 py-8 flex justify-between items-center relative z-10">
          <h1 className="text-4xl font-bold tracking-tight text-[#0D121A] drop-shadow-md">Pentagram</h1>
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-2xl font-bold text-[#0D121A] hover:text-[#0D121A]/80 transition-colors drop-shadow-md">
              Read stories
            </Link>
            <Link to="/signup" className="text-2xl font-bold bg-white text-[#0D121A] px-6 py-2.5 rounded-none hover:bg-gray-200 transition-colors shadow-lg">
              Start writing
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-6 flex flex-col items-center justify-center relative z-10 text-center mb-10">
          <div className="w-full max-w-4xl flex flex-col items-center">
            <h2 
              className="text-[3.5rem] sm:text-[4.5rem] md:text-[6rem] lg:text-[8rem] font-bold text-white leading-[0.9] mb-6 tracking-tight whitespace-nowrap"
              style={{ 
                fontFamily: "'Poetsen One', sans-serif",
                textShadow: "2px 2px 3px #0D121A"
              }}
            >
              Ideas That Matter
            </h2>
            <p 
              className="text-3xl md:text-4xl text-[#0C141B] mb-10 max-w-2xl font-bold"
              style={{ textShadow: "1px 1px 2px rgba(128,128,128,0.6)" }}
            >
              A minimal space for thinkers, writers, and creators to share their ideas without the noise of modern social media.
            </p>
            
            <Link to="/signup" className="px-10 py-4 bg-white text-black text-3xl font-bold rounded-none hover:bg-gray-200 transition-all shadow-xl transform hover:-translate-y-0.5 duration-200">
              Start writing
            </Link>
          </div>
        </main>
      </div>

    {/* Services/Features Section (White) */}
      <div className="bg-white py-24 px-6">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4">Features</p>
          <h3 className="text-5xl md:text-6xl font-normal text-gray-900 leading-[1.1] mb-6 tracking-tight">
            Focus on the words, <br className="hidden md:block" /> so you can handle your ideas.
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Providing writers and thinkers a distraction-free environment since 2026.
          </p>
          <Link to="/signup" className="px-8 py-3 bg-[#2d3a33] text-white text-sm font-bold rounded-none hover:bg-black transition-colors">
            Start writing
          </Link>
        </div>

        {/* Feature Card */}
        <div 
          className="max-w-6xl mx-auto rounded-none overflow-hidden flex flex-col md:flex-row items-center bg-cover bg-center"
          style={{ backgroundImage: "url('/2c7ff62082485f1fc05e129de3bc5ba4.webp')" }}
        >
          <div className="w-full md:w-1/2 p-12 md:p-20">
            <h4 className="text-4xl md:text-5xl font-normal text-white mb-6 leading-tight tracking-tight drop-shadow-sm">
              Your Canvas<br/>for Thought
            </h4>
            <p className="text-lg text-white font-medium drop-shadow-sm">
              Accurately prepare and format your stories to maximize engagement and ensure a seamless reading experience. No popups, no ads, just your words.
            </p>
          </div>
          <div className="w-full md:w-1/2 min-h-[300px] md:min-h-[500px]">
            {/* Empty space to reveal the right side of the background graphic */}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif font-black text-xl">Pentagram</span>
            <span className="text-gray-400 text-sm">© {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-6 text-sm font-medium text-gray-500">
            <Link to="/login" className="hover:text-gray-900 transition-colors">Log in</Link>
            <Link to="/signup" className="hover:text-gray-900 transition-colors">Sign up</Link>
            <a href="#" className="hover:text-gray-900 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
