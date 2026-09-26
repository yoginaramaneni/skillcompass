import React from 'react';
import { Outlet } from 'react-router-dom';
import { Compass } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center items-center gap-2 text-neutral-900 font-bold text-2xl tracking-tight">
          <Compass className="w-8 h-8 text-neutral-900" />
          <span>SkillCompass</span>
        </div>
        <p className="text-xs text-neutral-500 font-mono mt-1">AI-Powered Career Intelligence</p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white border border-neutral-200 py-8 px-4 shadow-sm rounded-2xl sm:px-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
