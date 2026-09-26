import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setIsSubmitting(true);
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data?.error?.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-neutral-900 text-center mb-6">Sign in to your account</h2>

      {error && (
        <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-lg text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-neutral-700 mb-1">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:border-neutral-900"
            placeholder="student@university.edu"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-700 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:border-neutral-900"
            placeholder="••••••••"
          />
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>

      <div className="mt-6 text-center text-xs text-neutral-600">
        Don't have an account?{' '}
        <Link to="/register" className="text-neutral-900 font-semibold hover:underline">
          Register
        </Link>
      </div>
    </div>
  );
};

