import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-neutral-200 bg-white py-8 text-center text-xs text-neutral-500">
      <div className="max-w-7xl mx-auto px-4 space-y-1">
        <p className="font-medium text-neutral-700">© {new Date().getFullYear()} SkillCompass. AI-Powered Career Intelligence Platform.</p>
        <p className="text-neutral-400 font-mono text-[11px]">Know where you are. See where the industry is going. Know what to learn next.</p>
      </div>
    </footer>
  );
};
