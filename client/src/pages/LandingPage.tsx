import React from 'react';
import { Compass, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LandingPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-20 text-center flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-800 text-xs font-semibold mb-8 shadow-xs">
        <Compass className="w-4 h-4 text-neutral-900" />
        <span>AI-POWERED CAREER INTELLIGENCE PLATFORM</span>
      </div>

      <h1 className="text-5xl sm:text-6xl font-extrabold text-neutral-900 tracking-tight mb-6">
        SkillCompass
      </h1>

      <p className="text-xl sm:text-2xl text-neutral-600 max-w-3xl font-light italic mb-10 leading-relaxed">
        “Know where you are. See where the industry is going. Know what to learn next.”
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          to="/register"
          className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-sm px-6 py-3 rounded-xl transition shadow-xs"
        >
          <span>Get Started</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 bg-white hover:bg-neutral-50 text-neutral-900 font-semibold text-sm px-6 py-3 rounded-xl border border-neutral-200 transition shadow-xs"
        >
          <span>Login</span>
        </Link>
      </div>
    </div>
  );
};

