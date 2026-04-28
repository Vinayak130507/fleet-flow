'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, Loader2, Activity, Clock, Bell } from 'lucide-react';
import { motion } from 'motion/react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

import { auth } from '@/lib/firebase';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from 'firebase/auth';

type Role = 'Fleet Manager' | 'Dispatcher' | 'Safety Officer' | 'Financial Analyst';

export default function LoginPage({ onLogin }: { onLogin?: (role: Role) => void }) {
  const [role, setRole] = useState<Role>('Fleet Manager');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'demo@fleetflow.com',
      password: 'password123'
    }
  });

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      if (onLogin) {
        onLogin(role);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'An error occurred during sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      if (onLogin) {
        onLogin(role);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      if (data.email === 'demo@fleetflow.com' && data.password === 'password123') {
        if (onLogin) onLogin(role);
        return;
      }
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex font-inter">
      {/* LEFT PANEL */}
      <div className="hidden lg:flex lg:w-[55%] bg-[#0A0A0B] relative overflow-hidden flex-col justify-between p-12">
        {/* Animated Grid Background */}
        <div 
          className="absolute inset-0 z-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(#E8FF47 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            animation: 'pan-bg 20s linear infinite',
          }}
        />
        
        {/* Top spacing */}
        <div className="relative z-10" />

        {/* Center 3D Monogram */}
        <div className="relative z-10 flex-1 flex items-center justify-center" style={{ perspective: '1000px' }}>
          <div 
            className="w-64 h-64 flex items-center justify-center border-4 border-[#E8FF47]/20 rounded-3xl bg-white/[0.02] backdrop-blur-sm shadow-[0_0_50px_rgba(232,255,71,0.1)]"
            style={{ 
              transformStyle: 'preserve-3d',
              animation: 'slow-spin 12s linear infinite'
            }}
          >
            <span 
              className="font-space font-extrabold text-9xl text-[#E8FF47] tracking-tighter"
              style={{ transform: 'translateZ(50px)' }}
            >
              FF
            </span>
          </div>

          {/* Floating Stat Cards */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[20%] left-[10%] bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl flex items-center gap-4 shadow-xl"
          >
            <div className="w-10 h-10 rounded-full bg-[#E8FF47]/20 flex items-center justify-center text-[#E8FF47]">
              <Activity size={20} />
            </div>
            <div>
              <div className="text-[#F0EFE8] font-bold font-space text-lg">24</div>
              <div className="text-[#6E6D6A] text-xs uppercase tracking-wider">Active Vehicles</div>
            </div>
          </motion.div>

          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-[25%] right-[10%] bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl flex items-center gap-4 shadow-xl"
          >
            <div className="w-10 h-10 rounded-full bg-[#47FFCE]/20 flex items-center justify-center text-[#47FFCE]">
              <Clock size={20} />
            </div>
            <div>
              <div className="text-[#F0EFE8] font-bold font-space text-lg">98%</div>
              <div className="text-[#6E6D6A] text-xs uppercase tracking-wider">On-Time Rate</div>
            </div>
          </motion.div>

          <motion.div 
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute top-[55%] left-[15%] bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl flex items-center gap-4 shadow-xl"
          >
            <div className="w-10 h-10 rounded-full bg-orange-400/20 flex items-center justify-center text-orange-400">
              <Bell size={20} />
            </div>
            <div>
              <div className="text-[#F0EFE8] font-bold font-space text-lg">Zero</div>
              <div className="text-[#6E6D6A] text-xs uppercase tracking-wider">Missed Alerts</div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Logo & Tagline */}
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-space font-extrabold text-3xl text-[#F0EFE8] tracking-tight">FleetFlow</span>
            <div className="w-2 h-2 rounded-full bg-[#E8FF47]" />
          </div>
          <p className="text-[#6E6D6A] font-inter text-sm">Fleet Intelligence. Zero Chaos.</p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full lg:w-[45%] bg-[#F8F7F2] flex items-center justify-center p-8 sm:p-12 lg:p-20">
        <div className="w-full max-w-md">
          <h2 className="font-space font-extrabold text-4xl text-[#0A0A0B] mb-8">Welcome back</h2>

          {/* Role Selector */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-gray-200/50 rounded-lg mb-8">
            {(['Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst'] as Role[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`w-full py-2.5 px-2 text-xs sm:text-sm font-medium rounded-md transition-all ${
                  role === r 
                    ? 'bg-white text-[#0A0A0B] shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-500 -mt-5 mb-6">
            Demo mode uses this selected role to open the matching workspace.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <input
                {...register('email')}
                type="email"
                placeholder="name@company.com"
                className={`w-full px-4 py-3 rounded-lg border bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#E8FF47]/50 focus:border-[#a3b81d] transition-colors ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && (
                <p className="mt-1.5 text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <a href="#" className="text-sm font-medium text-[#8A991A] hover:text-[#6b7812] transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 rounded-lg border bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#E8FF47]/50 focus:border-[#a3b81d] transition-colors ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 bg-white text-[#0A0A0B] border border-gray-300 font-space font-bold text-lg py-3.5 rounded-lg hover:-translate-y-0.5 hover:shadow-lg transition-all flex items-center justify-center disabled:opacity-70"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                'Sign In'
              )}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#F8F7F2] text-gray-500 uppercase font-bold tracking-widest text-[10px]">Or continue with</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full bg-[#E8FF47] text-[#0A0A0B] font-space font-bold text-lg py-3.5 rounded-lg hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#E8FF47]/20 transition-all flex items-center justify-center disabled:opacity-70"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.67-.35-1.39-.35-2.09s.13-1.42.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google Account
            </button>

            {error && (
              <p className="mt-4 text-center text-sm text-red-500 font-medium bg-red-50 p-2 rounded border border-red-100">{error}</p>
            )}
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Don&apos;t have access? <a href="#" className="text-gray-700 hover:underline">Contact your administrator</a>
          </p>
        </div>
      </div>
    </div>
  );
}
