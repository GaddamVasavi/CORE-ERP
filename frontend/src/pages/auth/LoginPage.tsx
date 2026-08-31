import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { apiClient } from '../../api/client';
import { useAuthStore } from '../../store/authStore';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const setLoginData = useAuthStore((state) => state.setLoginData);
  const [email, setEmail] = useState('admin@coreerp.com');
  const [password, setPassword] = useState('Admin@CoreERP2026!');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await apiClient.post('/auth/login', { email, password });
      if (response.data.success) {
        setLoginData(response.data.data);
        navigate('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials or connection error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden p-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-blue-600 mx-auto flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-blue-500/30 mb-3">
            C
          </div>
          <h2 className="text-2xl font-bold text-slate-900">CoreERP Sign In</h2>
          <p className="text-xs text-slate-500 mt-1">One Platform. Every Business Process. One Source of Truth.</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="w-4 h-4" />}
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock className="w-4 h-4" />}
            required
          />
          <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
            Sign In to Enterprise Workspace
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          Need a new workspace?{' '}
          <Link to="/register" className="text-blue-600 font-semibold hover:underline">
            Register Tenant
          </Link>
        </div>
      </div>
    </div>
  );
};
