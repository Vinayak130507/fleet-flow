'use client';

import { useState, useEffect } from 'react';
import LoadingScreen from '@/components/LoadingScreen';
import LoginPage from '@/components/LoginPage';
import DashboardPage from '@/components/DashboardPage';
import { DashboardPageSkeleton } from '@/components/skeletons';
import { motion } from 'motion/react';
import { 
  Activity, Shield, Truck, Wrench, BarChart3, Map, 
  ArrowRight, Play
} from 'lucide-react';

const Counter = ({ end, suffix = "" }: { end: number, suffix?: string }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end]);
  return <span>{count}{suffix}</span>;
};

const Nav = ({ onLoginClick }: { onLoginClick: () => void }) => (
  <nav className="fixed top-0 left-0 right-0 z-40 bg-[#0A0A0B]/80 backdrop-blur-md border-b border-white/5">
    <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="font-space font-extrabold text-2xl text-[#F0EFE8] tracking-tight">FleetFlow</span>
        <div className="w-2 h-2 rounded-full bg-[#E8FF47] animate-pulse" />
      </div>
      <div className="hidden md:flex items-center gap-8 font-inter text-sm text-[#6E6D6A]">
        <a href="#features" className="hover:text-[#F0EFE8] transition-colors">Features</a>
        <a href="#workflow" className="hover:text-[#F0EFE8] transition-colors">Workflow</a>
        <a href="#metrics" className="hover:text-[#F0EFE8] transition-colors">Metrics</a>
      </div>
      <div className="flex items-center gap-4">
        <button onClick={onLoginClick} className="text-[#F0EFE8] font-inter font-medium px-4 py-2.5 hover:text-[#E8FF47] transition-colors hidden sm:block">
          Log In
        </button>
        <button onClick={onLoginClick} className="bg-[#E8FF47] text-[#0A0A0B] font-inter font-medium px-6 py-2.5 rounded-sm hover:bg-[#d4eb33] transition-colors">
          Get Started
        </button>
      </div>
    </div>
  </nav>
);

const Hero = ({ onLoginClick }: { onLoginClick: () => void }) => (
  <section className="relative pt-40 pb-20 px-6 overflow-hidden">
    {/* Animated CSS Grid Background */}
    <div className="absolute inset-0 z-0 opacity-20" 
         style={{
           backgroundImage: 'linear-gradient(#E8FF47 1px, transparent 1px), linear-gradient(90deg, #E8FF47 1px, transparent 1px)',
           backgroundSize: '50px 50px',
           maskImage: 'radial-gradient(ellipse at center, black 0%, transparent 70%)',
           WebkitMaskImage: 'radial-gradient(ellipse at center, black 0%, transparent 70%)'
         }} 
    />
    <div className="max-w-7xl mx-auto relative z-10 text-center">
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="font-space font-extrabold text-6xl md:text-8xl text-[#F0EFE8] tracking-tighter leading-tight mb-6"
      >
        Fleet <span className="text-[#E8FF47]">Intelligence.</span><br />
        Zero Chaos.
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="font-inter text-xl text-[#6E6D6A] max-w-2xl mx-auto mb-10"
      >
        The modular fleet & logistics management SaaS built for modern operations. 
        Take control of your vehicles, drivers, and maintenance in one unified platform.
      </motion.p>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
      >
        <button onClick={onLoginClick} className="w-full sm:w-auto bg-[#E8FF47] text-[#0A0A0B] font-inter font-medium px-8 py-4 rounded-sm hover:bg-[#d4eb33] transition-colors flex items-center justify-center gap-2">
          Start Free Trial <ArrowRight size={18} />
        </button>
        <button className="w-full sm:w-auto bg-white/5 text-[#F0EFE8] font-inter font-medium px-8 py-4 rounded-sm hover:bg-white/10 transition-colors flex items-center justify-center gap-2 border border-white/10">
          <Play size={18} /> Watch Demo
        </button>
      </motion.div>

      {/* KPI Counters */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto border-y border-white/10 py-10"
      >
        {[
          { label: "Active Vehicles", value: 1250, suffix: "+" },
          { label: "Trips Logged", value: 8400, suffix: "k" },
          { label: "Uptime", value: 99, suffix: "%" },
          { label: "Data Points/sec", value: 500, suffix: "+" }
        ].map((stat, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="font-space font-bold text-4xl text-[#F0EFE8] mb-2">
              <Counter end={stat.value} suffix={stat.suffix} />
            </div>
            <div className="font-inter text-sm text-[#6E6D6A] uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </motion.div>
    </div>
  </section>
);

const DashboardPreview = () => (
  <section className="py-20 px-6">
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="max-w-6xl mx-auto"
    >
      <div className="rounded-xl border border-white/10 bg-[#0A0A0B] shadow-[0_0_50px_rgba(232,255,71,0.05)] overflow-hidden">
        {/* Browser Header */}
        <div className="h-12 border-b border-white/10 bg-white/[0.02] flex items-center px-4 gap-2">
          <div className="w-3 h-3 rounded-full bg-white/20" />
          <div className="w-3 h-3 rounded-full bg-white/20" />
          <div className="w-3 h-3 rounded-full bg-white/20" />
          <div className="ml-4 h-6 w-64 bg-white/5 rounded-md border border-white/5" />
        </div>
        {/* Dashboard Content */}
        <div className="p-8 grid grid-cols-1 lg:grid-cols-4 gap-6 bg-[#0A0A0B]">
          {/* Sidebar */}
          <div className="hidden lg:flex flex-col gap-4 border-r border-white/10 pr-6">
            <div className="h-8 w-32 bg-white/10 rounded mb-8" />
            {[1,2,3,4,5].map(i => (
              <div key={i} className="h-4 w-full bg-white/5 rounded" />
            ))}
          </div>
          {/* Main Content */}
          <div className="col-span-1 lg:col-span-3">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-space font-bold text-2xl text-[#F0EFE8]">Command Center</h3>
              <div className="h-8 w-32 bg-[#E8FF47]/10 border border-[#E8FF47]/20 rounded text-[#E8FF47] flex items-center justify-center text-sm font-inter">Live Sync</div>
            </div>
            {/* KPI Cards */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { title: "Fleet Health", val: "94%", color: "text-[#E8FF47]" },
                { title: "Active Trips", val: "142", color: "text-[#47FFCE]" },
                { title: "Alerts", val: "3", color: "text-orange-400" }
              ].map((kpi, i) => (
                <div key={i} className="p-4 border border-white/10 rounded-lg bg-white/[0.02]">
                  <div className="text-sm text-[#6E6D6A] mb-2">{kpi.title}</div>
                  <div className={`font-space font-bold text-3xl ${kpi.color}`}>{kpi.val}</div>
                </div>
              ))}
            </div>
            {/* Table */}
            <div className="border border-white/10 rounded-lg overflow-hidden">
              <table className="w-full text-left font-inter text-sm">
                <thead className="bg-white/[0.02] border-b border-white/10 text-[#6E6D6A]">
                  <tr>
                    <th className="p-4 font-medium">Vehicle ID</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium">Driver</th>
                    <th className="p-4 font-medium">ETA</th>
                  </tr>
                </thead>
                <tbody className="text-[#F0EFE8]">
                  {[
                    { id: "TRK-8492", status: "On Trip", driver: "Alex M.", eta: "14 mins", color: "bg-[#47FFCE]/10 text-[#47FFCE] border-[#47FFCE]/20" },
                    { id: "TRK-1024", status: "Idle", driver: "Unassigned", eta: "-", color: "bg-[#E8FF47]/10 text-[#E8FF47] border-[#E8FF47]/20" },
                    { id: "TRK-5591", status: "In Shop", driver: "Sarah K.", eta: "2 days", color: "bg-orange-400/10 text-orange-400 border-orange-400/20" },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-white/5 last:border-0">
                      <td className="p-4 font-mono">{row.id}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs border ${row.color}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="p-4">{row.driver}</td>
                      <td className="p-4 text-[#6E6D6A]">{row.eta}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  </section>
);

const Features = () => {
  const features = [
    { icon: <Activity />, title: "Command Center", desc: "Real-time visibility into your entire fleet operations with live telemetry." },
    { icon: <Truck />, title: "Vehicle Registry", desc: "Complete lifecycle management from procurement to decommissioning." },
    { icon: <Map />, title: "Trip Dispatcher", desc: "AI-powered routing and intelligent dispatching for maximum efficiency." },
    { icon: <Wrench />, title: "Maintenance Logs", desc: "Predictive maintenance scheduling and digital repair tracking." },
    { icon: <Shield />, title: "Driver Safety", desc: "Behavior monitoring, compliance tracking, and automated safety scoring." },
    { icon: <BarChart3 />, title: "Analytics", desc: "Deep operational insights and custom reporting for data-driven decisions." }
  ];

  return (
    <section id="features" className="py-24 px-6 bg-[#0A0A0B]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-space font-extrabold text-4xl md:text-5xl text-[#F0EFE8] mb-4">Modular by Design</h2>
          <p className="font-inter text-[#6E6D6A] max-w-2xl mx-auto">Everything you need to run a modern logistics operation, built into discrete modules that work perfectly together.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group p-8 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-[#E8FF47]/30 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-[#E8FF47]/10 text-[#E8FF47] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {f.icon}
              </div>
              <h3 className="font-space font-bold text-xl text-[#F0EFE8] mb-3">{f.title}</h3>
              <p className="font-inter text-[#6E6D6A] leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Workflow = () => {
  const steps = [
    "Vehicle Intake", "Compliance", "Dispatching", "Completion", "Maintenance", "Analytics"
  ];

  return (
    <section id="workflow" className="py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="font-space font-extrabold text-4xl md:text-5xl text-[#F0EFE8] mb-4">The FleetFlow Pipeline</h2>
          <p className="font-inter text-[#6E6D6A] max-w-2xl mx-auto">A streamlined workflow that connects every phase of your operation.</p>
        </div>
        
        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10 -translate-y-1/2 hidden md:block" />
          
          <div className="grid grid-cols-1 md:grid-cols-6 gap-8 relative z-10">
            {steps.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 rounded-full bg-[#0A0A0B] border-2 border-[#E8FF47] text-[#E8FF47] flex items-center justify-center font-space font-bold text-lg mb-4 shadow-[0_0_15px_rgba(232,255,71,0.2)]">
                  {i + 1}
                </div>
                <div className="font-inter font-medium text-[#F0EFE8]">{step}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const MetricsStrip = () => (
  <section id="metrics" className="py-20 bg-[#E8FF47] text-[#0A0A0B]">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
        {[
          { metric: "87%", desc: "Reduction in manual logs" },
          { metric: "3x", desc: "Faster dispatch routing" },
          { metric: "100%", desc: "Compliance visibility" }
        ].map((m, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <div className="font-space font-extrabold text-6xl mb-2">{m.metric}</div>
            <div className="font-inter font-medium text-lg opacity-80">{m.desc}</div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const CTA = ({ onLoginClick }: { onLoginClick: () => void }) => (
  <section className="py-32 px-6 text-center">
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="max-w-3xl mx-auto"
    >
      <h2 className="font-space font-extrabold text-5xl md:text-6xl text-[#F0EFE8] mb-8">Ready to optimize your fleet?</h2>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button onClick={onLoginClick} className="w-full sm:w-auto bg-[#E8FF47] text-[#0A0A0B] font-inter font-medium px-8 py-4 rounded-sm hover:bg-[#d4eb33] transition-colors">
          Get Started Now
        </button>
        <button className="w-full sm:w-auto bg-transparent text-[#F0EFE8] font-inter font-medium px-8 py-4 rounded-sm hover:bg-white/5 transition-colors border border-white/20">
          Talk to Sales
        </button>
      </div>
    </motion.div>
  </section>
);

const Footer = () => (
  <footer className="border-t border-white/10 py-12 px-6">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex items-center gap-2">
        <span className="font-space font-bold text-xl text-[#F0EFE8]">FleetFlow</span>
        <div className="w-1.5 h-1.5 rounded-full bg-[#E8FF47]" />
      </div>
      <div className="font-inter text-sm text-[#6E6D6A]">
        © {new Date().getFullYear()} FleetFlow Inc. All rights reserved.
      </div>
    </div>
  </footer>
);

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('Fleet Manager');
  const [showSkeleton, setShowSkeleton] = useState(false);

  const handleLogin = (role: string) => {
    setShowLogin(false);
    setUserRole(role);
    setShowSkeleton(true);
    setTimeout(() => {
      setShowSkeleton(false);
      setIsLoggedIn(true);
    }, 1500);
  };

  if (showSkeleton) {
    return <DashboardPageSkeleton />;
  }

  if (isLoggedIn) {
    return <DashboardPage role={userRole} onLogout={() => setIsLoggedIn(false)} />;
  }

  if (showLogin) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <main className="min-h-screen bg-[#0A0A0B] text-[#F0EFE8] font-inter selection:bg-[#E8FF47] selection:text-[#0A0A0B]">
      {loading ? (
        <LoadingScreen onComplete={() => setLoading(false)} />
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <Nav onLoginClick={() => setShowLogin(true)} />
          <Hero onLoginClick={() => setShowLogin(true)} />
          <DashboardPreview />
          <Features />
          <Workflow />
          <MetricsStrip />
          <CTA onLoginClick={() => setShowLogin(true)} />
          <Footer />
        </motion.div>
      )}
    </main>
  );
}
