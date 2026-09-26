import React, { useEffect, useState } from 'react';
import { Compass, Server, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { checkHealth } from '../services/api';

export const LandingPage: React.FC = () => {
  const [backendStatus, setBackendStatus] = useState<string>('Checking backend connection...');
  const [isHealthy, setIsHealthy] = useState<boolean>(false);

  useEffect(() => {
    checkHealth()
      .then((res) => {
        if (res.success) {
          setBackendStatus(res.message);
          setIsHealthy(true);
        }
      })
      .catch(() => {
        setBackendStatus('Backend unreachable (run `npm run dev:server`)');
        setIsHealthy(false);
      });
  }, []);

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

      {/* Backend & Frontend Connectivity Status Badge */}
      <div className="bg-white border border-neutral-200 rounded-xl p-6 max-w-md w-full mb-10 text-left shadow-xs">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-3 flex items-center justify-between">
          <span>System Status</span>
          <span className="flex items-center gap-1.5 text-emerald-700">
            <CheckCircle2 className="w-4 h-4" /> Frontend Ready
          </span>
        </h3>

        <div className="flex items-center gap-3 bg-neutral-50 p-3 rounded-lg border border-neutral-200">
          <Server className={`w-5 h-5 ${isHealthy ? 'text-emerald-700' : 'text-amber-700'}`} />
          <div className="text-xs">
            <span className="font-semibold text-neutral-800">API Health: </span>
            <span className={isHealthy ? 'text-emerald-700 font-mono font-medium' : 'text-amber-700 font-mono font-medium'}>
              {backendStatus}
            </span>
          </div>
        </div>
      </div>

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

