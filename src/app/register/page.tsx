'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const { login } = useAuthStore();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const res = await api.post('/auth/register', { name, email, password });
      login(res.data.data.user, res.data.data.accessToken);
      router.push('/account');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-24 pb-16 bg-background px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 md:p-12 border border-border bg-card shadow-xl"
      >
        <div className="text-center mb-10">
          <h1 className="font-heading text-4xl uppercase tracking-tighter mb-2">Join AVREN</h1>
          <p className="text-muted-foreground text-sm uppercase tracking-widest">Create Your Account</p>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-4 mb-6 border border-destructive/20 text-center uppercase tracking-wider font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Full Name</label>
            <Input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 border-border rounded-none focus-visible:ring-accent"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email Address</label>
            <Input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 border-border rounded-none focus-visible:ring-accent"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Password</label>
            <Input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 border-border rounded-none focus-visible:ring-accent"
            />
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-14 rounded-none uppercase tracking-widest text-sm font-bold bg-foreground text-background hover:bg-foreground/90 disabled:opacity-70 mt-8"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Create Account'}
          </Button>
        </form>

        <div className="mt-8 text-center border-t border-border pt-8">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-foreground hover:text-accent font-semibold uppercase tracking-wider ml-1">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
