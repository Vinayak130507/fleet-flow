'use client';

import React, { useEffect, useState } from 'react';

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const statuses = ["Connecting fleet...", "Loading assets...", "Ready"];
  const [statusIndex, setStatusIndex] = useState(0);
  const [particles, setParticles] = useState<{ id: number; left: string; duration: string; delay: string; size: string }[]>([]);

  useEffect(() => {
    // Generate particles
    const newParticles = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      duration: `${Math.random() * 3 + 2}s`,
      delay: `${Math.random() * 2}s`,
      size: `${Math.random() * 3 + 1}px`,
    }));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setParticles(newParticles);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndex((prev) => {
        if (prev < statuses.length - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 800);

    const timer = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0A0A0B] overflow-hidden font-inter">
      {/* Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#E8FF47] opacity-[0.03] blur-[100px] rounded-full pointer-events-none" />

      {/* Particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            '--duration': p.duration,
            '--delay': p.delay,
          } as React.CSSProperties}
        />
      ))}

      {/* 3D Truck */}
      <div className="relative w-0 h-0 mb-40" style={{ perspective: '1200px' }}>
        <div className="absolute" style={{ transformStyle: 'preserve-3d', animation: 'spin3d 8s linear infinite' }}>
          {/* Truck Group centered */}
          <div className="absolute" style={{ transformStyle: 'preserve-3d', left: '-83px', top: '-30px' }}>
            
            {/* Trailer (100x60x40) */}
            <div className="absolute left-0 top-0 w-[100px] h-[60px]" style={{ transformStyle: 'preserve-3d' }}>
              {/* Side 1 */}
              <div className="absolute w-[100px] h-[60px] border border-[#E8FF47]/50 bg-[#E8FF47]/10 overflow-hidden" style={{ transform: 'translateZ(20px)' }}>
                <div className="absolute top-[10px] left-0 w-full h-[1px] bg-[#E8FF47]/30" />
                <div className="absolute top-[20px] left-0 w-full h-[1px] bg-[#E8FF47]/30" />
                <div className="absolute top-[30px] left-0 w-full h-[1px] bg-[#E8FF47]/30" />
                <div className="absolute top-[40px] left-0 w-full h-[1px] bg-[#E8FF47]/30" />
                <div className="absolute top-[50px] left-0 w-full h-[1px] bg-[#E8FF47]/30" />
              </div>
              {/* Side 2 */}
              <div className="absolute w-[100px] h-[60px] border border-[#E8FF47]/50 bg-[#E8FF47]/10 overflow-hidden" style={{ transform: 'rotateY(180deg) translateZ(20px)' }}>
                <div className="absolute top-[10px] left-0 w-full h-[1px] bg-[#E8FF47]/30" />
                <div className="absolute top-[20px] left-0 w-full h-[1px] bg-[#E8FF47]/30" />
                <div className="absolute top-[30px] left-0 w-full h-[1px] bg-[#E8FF47]/30" />
                <div className="absolute top-[40px] left-0 w-full h-[1px] bg-[#E8FF47]/30" />
                <div className="absolute top-[50px] left-0 w-full h-[1px] bg-[#E8FF47]/30" />
              </div>
              {/* Grill (Front of trailer) */}
              <div className="absolute w-[40px] h-[60px] border border-[#E8FF47]/50 bg-[#E8FF47]/20 left-[30px]" style={{ transform: 'rotateY(90deg) translateZ(50px)' }} />
              {/* Rear */}
              <div className="absolute w-[40px] h-[60px] border border-[#E8FF47]/50 bg-[#E8FF47]/20 left-[30px]" style={{ transform: 'rotateY(-90deg) translateZ(50px)' }} />
              {/* Roof */}
              <div className="absolute w-[100px] h-[40px] border border-[#E8FF47]/50 bg-[#E8FF47]/20 top-[10px]" style={{ transform: 'rotateX(90deg) translateZ(30px)' }} />
              {/* Floor */}
              <div className="absolute w-[100px] h-[40px] border border-[#E8FF47]/50 bg-[#E8FF47]/20 top-[10px]" style={{ transform: 'rotateX(-90deg) translateZ(30px)' }} />
            </div>

            {/* Cabin (40x46x36) */}
            <div className="absolute left-[102px] top-[14px] w-[40px] h-[46px]" style={{ transformStyle: 'preserve-3d' }}>
              {/* Side 1 */}
              <div className="absolute w-[40px] h-[46px] border border-[#E8FF47]/60 bg-[#E8FF47]/20" style={{ transform: 'translateZ(18px)' }}>
                <div className="absolute top-[4px] right-[4px] w-[16px] h-[18px] bg-[#E8FF47]/40 border border-[#E8FF47]/80 rounded-sm" />
              </div>
              {/* Side 2 */}
              <div className="absolute w-[40px] h-[46px] border border-[#E8FF47]/60 bg-[#E8FF47]/20" style={{ transform: 'rotateY(180deg) translateZ(18px)' }}>
                <div className="absolute top-[4px] left-[4px] w-[16px] h-[18px] bg-[#E8FF47]/40 border border-[#E8FF47]/80 rounded-sm" />
              </div>
              {/* Windshield */}
              <div className="absolute w-[36px] h-[46px] border border-[#E8FF47]/60 bg-[#E8FF47]/30 left-[2px]" style={{ transform: 'rotateY(90deg) translateZ(20px)' }}>
                <div className="absolute top-[4px] left-[4px] w-[28px] h-[18px] bg-[#E8FF47]/40 border border-[#E8FF47]/80 rounded-sm" />
              </div>
              {/* Rear */}
              <div className="absolute w-[36px] h-[46px] border border-[#E8FF47]/60 bg-[#E8FF47]/20 left-[2px]" style={{ transform: 'rotateY(-90deg) translateZ(20px)' }} />
              {/* Roof */}
              <div className="absolute w-[40px] h-[36px] border border-[#E8FF47]/60 bg-[#E8FF47]/30 top-[5px]" style={{ transform: 'rotateX(90deg) translateZ(23px)' }} />
              {/* Floor */}
              <div className="absolute w-[40px] h-[36px] border border-[#E8FF47]/60 bg-[#E8FF47]/30 top-[5px]" style={{ transform: 'rotateX(-90deg) translateZ(23px)' }} />
            </div>

            {/* Hood (24x26x36) */}
            <div className="absolute left-[142px] top-[34px] w-[24px] h-[26px]" style={{ transformStyle: 'preserve-3d' }}>
              {/* Side 1 */}
              <div className="absolute w-[24px] h-[26px] border border-[#E8FF47]/60 bg-[#E8FF47]/20" style={{ transform: 'translateZ(18px)' }} />
              {/* Side 2 */}
              <div className="absolute w-[24px] h-[26px] border border-[#E8FF47]/60 bg-[#E8FF47]/20" style={{ transform: 'rotateY(180deg) translateZ(18px)' }} />
              {/* Grill */}
              <div className="absolute w-[36px] h-[26px] border border-[#E8FF47]/60 bg-[#E8FF47]/30 left-[-6px]" style={{ transform: 'rotateY(90deg) translateZ(12px)' }}>
                <div className="absolute top-[14px] left-[4px] w-[6px] h-[6px] rounded-full bg-[#E8FF47] shadow-[0_0_8px_#E8FF47]" />
                <div className="absolute top-[14px] right-[4px] w-[6px] h-[6px] rounded-full bg-[#E8FF47] shadow-[0_0_8px_#E8FF47]" />
                <div className="absolute top-[4px] left-[12px] w-[12px] h-[16px] flex justify-between">
                  <div className="w-[2px] h-full bg-[#E8FF47]/50" />
                  <div className="w-[2px] h-full bg-[#E8FF47]/50" />
                  <div className="w-[2px] h-full bg-[#E8FF47]/50" />
                </div>
              </div>
              {/* Rear */}
              <div className="absolute w-[36px] h-[26px] border border-[#E8FF47]/60 bg-[#E8FF47]/20 left-[-6px]" style={{ transform: 'rotateY(-90deg) translateZ(12px)' }} />
              {/* Roof */}
              <div className="absolute w-[24px] h-[36px] border border-[#E8FF47]/60 bg-[#E8FF47]/30 top-[-5px]" style={{ transform: 'rotateX(90deg) translateZ(13px)' }} />
              {/* Floor */}
              <div className="absolute w-[24px] h-[36px] border border-[#E8FF47]/60 bg-[#E8FF47]/30 top-[-5px]" style={{ transform: 'rotateX(-90deg) translateZ(13px)' }} />
            </div>

            {/* Wheels */}
            {[10, 35, 75, 105, 140].map((x, i) => (
              <div key={i} style={{ transformStyle: 'preserve-3d' }}>
                <div className="absolute w-[24px] h-[24px] rounded-full border-[3px] border-[#E8FF47] bg-[#0A0A0B] flex items-center justify-center" style={{ left: `${x}px`, top: '48px', transform: 'translateZ(22px)' }}>
                  <div className="w-[6px] h-[6px] rounded-full bg-[#E8FF47]/50" />
                </div>
                <div className="absolute w-[24px] h-[24px] rounded-full border-[3px] border-[#E8FF47] bg-[#0A0A0B] flex items-center justify-center" style={{ left: `${x}px`, top: '48px', transform: 'translateZ(-22px)' }}>
                  <div className="w-[6px] h-[6px] rounded-full bg-[#E8FF47]/50" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Logo */}
      <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 font-space shimmer-text relative z-10">
        FleetFlow
      </h1>

      {/* Status Text */}
      <p className="text-[#E8FF47]/70 font-inter text-sm md:text-base tracking-widest uppercase h-6 relative z-10">
        {statuses[statusIndex]}
      </p>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5">
        <div className="h-full bg-[#E8FF47] shadow-[0_0_15px_#E8FF47] progress-fill" />
      </div>
    </div>
  );
}
