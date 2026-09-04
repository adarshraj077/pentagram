import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import heroGraphic from '../assets/hero-graphic.jpg';
import featureGraphic from '../assets/feature-graphic.jpg';

const LandingPage = () => {
  return (
    <div className="flex flex-col text-gray-900 font-sans">
      {/* Hero Section (Elegant Dark Blue) */}
      <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#0A1128]">

        {/* Header */}
        <header className="w-full max-w-7xl mx-auto px-6 py-8 flex justify-between items-center relative z-10">
          <h1 className="text-2xl font-medium tracking-tight text-white drop-shadow-sm">Pentagram</h1>
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-sm font-medium text-white hover:text-white/80 transition-colors drop-shadow-sm">
              Read stories
            </Link>
            <Link to="/signup" className="text-sm font-bold bg-white text-black px-6 py-2.5 rounded-none hover:bg-gray-100 transition-colors shadow-lg">
              Start writing
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-6 flex flex-col items-center justify-center relative z-10 text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-4xl flex flex-col items-center"
          >
            <h2 className="text-6xl md:text-8xl font-normal text-white leading-[1.1] mb-6 tracking-tight drop-shadow-md">
              Ideas That<br className="md:hidden" /> Matter
            </h2>
            <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl font-medium drop-shadow-sm">
              A minimal space for thinkers, writers, and creators to share their ideas without the noise of modern social media.
            </p>
            
            <Link to="/signup" className="px-10 py-4 bg-white text-black text-lg font-medium rounded-none hover:bg-gray-50 transition-all shadow-xl transform hover:-translate-y-0.5 duration-200">
              Start writing
            </Link>
          </motion.div>
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

        {/* Feature Card (Green) */}
        <div className="max-w-6xl mx-auto bg-[#a8e6b3] rounded-none overflow-hidden flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 p-12 md:p-20">
            <h4 className="text-4xl md:text-5xl font-normal text-[#2d3a33] mb-6 leading-tight tracking-tight">
              Distraction-free<br/>Environment
            </h4>
            <p className="text-lg text-[#3f5247]">
              Accurately prepare and format your stories to maximize engagement and ensure a seamless reading experience. No popups, no ads, just your words.
            </p>
          </div>
          <div className="w-full md:w-1/2 flex justify-end">
            <img 
              src={featureGraphic} 
              alt="Focus and writing graphic" 
              className="w-full h-auto object-cover mix-blend-multiply"
            />
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
