import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Lock, 
  Coins, 
  Cpu, 
  Key, 
  Zap, 
  User, 
  Building, 
  Sparkles,
  Star,
  Award
} from 'lucide-react';
import { useWallet } from '../../context/WalletContext';
import { useAgreements } from '../../context/AgreementContext';

/**
 * HeroVisual.jsx
 * Immaculate Officer Eva with 3D Atomic Photon Orbits & Balanced Telemetry.
 * - Pristine EVE android anatomy with integrated golden officer crest.
 * - Pure luminous atomic photon orbits (zero text overlap).
 * - 4 spacious, ergonomic corner telemetry cards with live Web3 data.
 */
export const HeroVisual = () => {
  const { connected, address, truncateAddress } = useWallet();
  const { agreements } = useAgreements();

  // Perspective simulation mode: 'tenant' | 'landlord'
  const [activeRoleMode, setActiveRoleMode] = useState('tenant');
  
  // Active expanded chip: null | 'balance' | 'speed' | 'auth' | 'protocol'
  const [expandedChip, setExpandedChip] = useState(null);

  // Robot emotional state: 'normal' | 'happy' | 'blink'
  const [robotMood, setRobotMood] = useState('normal');

  // Click shockwave animation trigger count
  const [pulseCount, setPulseCount] = useState(0);

  // ─── SLOW-DAMPED 3D CURSOR TRACKING ─────────────────────────────────────────
  const mouseTarget = useRef({ x: 0, y: 0 });
  const mouseCurrent = useRef({ x: 0, y: 0 });
  const [headPose, setHeadPose] = useState({ rx: 0, ry: 0, eyeX: 0, eyeY: 0, wingRoll: 0 });

  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      mouseTarget.current = { x: nx, y: ny };
    };

    window.addEventListener('mousemove', handleGlobalMouseMove, { passive: true });

    let animationFrameId;
    const LERP_SPEED = 0.03; // Smooth, slow, organic damping

    const loop = () => {
      mouseCurrent.current.x += (mouseTarget.current.x - mouseCurrent.current.x) * LERP_SPEED;
      mouseCurrent.current.y += (mouseTarget.current.y - mouseCurrent.current.y) * LERP_SPEED;

      const curX = mouseCurrent.current.x;
      const curY = mouseCurrent.current.y;

      setHeadPose({
        ry: curX * 24,        // Head yaw angle (-24deg to +24deg)
        rx: -curY * 15,       // Head pitch angle (-15deg to +15deg)
        eyeX: curX * 10,      // Cyan LED eye tracking offset X
        eyeY: curY * 6,       // Cyan LED eye tracking offset Y
        wingRoll: curX * 8,   // Wing aerodynamic sway
        bodyPitch: -curY * 6, // Torso pitch
      });

      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Periodic natural eye blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setRobotMood((prev) => (prev === 'normal' ? 'blink' : prev));
      setTimeout(() => {
        setRobotMood((prev) => (prev === 'blink' ? 'normal' : prev));
      }, 180);
    }, 3800);

    return () => clearInterval(blinkInterval);
  }, []);

  // Live count-up animation for locked XLM
  const targetXLM = activeRoleMode === 'tenant' ? 1500 : 1335;
  const [displayXLM, setDisplayXLM] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 800;
    const steps = 30;
    const increment = targetXLM / steps;
    const interval = duration / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= targetXLM) {
        setDisplayXLM(targetXLM);
        clearInterval(timer);
      } else {
        setDisplayXLM(Math.floor(start));
      }
    }, interval);

    return () => clearInterval(timer);
  }, [targetXLM, activeRoleMode]);

  // Click on Officer Eva triggers happy salute + atomic radiant shockwave
  const handleOfficerClick = () => {
    setRobotMood('happy');
    setPulseCount((prev) => prev + 1);
    setTimeout(() => {
      setRobotMood('normal');
    }, 2000);
  };

  return (
    <div className="relative w-full max-w-xl mx-auto flex flex-col items-center justify-center p-3 sm:p-5 select-none perspective-[1400px]">
      
      {/* ─── ROLE SIMULATION SEGMENTED TOGGLE (Top Center) ─── */}
      <div className="relative sm:absolute z-30 mb-10 sm:mb-0 sm:top-0 flex items-center gap-1.5 p-1 rounded-2xl bg-card/90 backdrop-blur-xl border border-primary/30 shadow-xl">
        <button
          type="button"
          onClick={() => setActiveRoleMode('tenant')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeRoleMode === 'tenant'
              ? 'bg-primary text-white shadow-sm'
              : 'text-text-secondary hover:text-text-primary hover:bg-surface/60'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Tenant View</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveRoleMode('landlord')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeRoleMode === 'landlord'
              ? 'bg-primary-glow text-background font-bold shadow-sm'
              : 'text-text-secondary hover:text-text-primary hover:bg-surface/60'
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          <span>Landlord View</span>
        </button>
      </div>

      {/* ─── MOBILE TOP CHIPS CONTAINER (Only visible stacked on mobile) ─── */}
      <div className="flex sm:hidden flex-col gap-3 w-full items-center mb-10 z-20">
        <TelemetryChip1 activeRoleMode={activeRoleMode} displayXLM={displayXLM} expandedChip={expandedChip} setExpandedChip={setExpandedChip} mobile={true} />
        <TelemetryChip2 expandedChip={expandedChip} setExpandedChip={setExpandedChip} mobile={true} />
      </div>

      {/* ─── 3D PERSPECTIVE ATOMIC STAGE ─── */}
      <div className="relative w-full max-w-sm sm:max-w-none aspect-square sm:aspect-auto sm:h-full flex items-center justify-center pt-2 pb-4 sm:pt-8 sm:pb-4 mx-auto my-4 sm:my-0">
        
        {/* Ambient Deep Space Nebula Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-primary-glow/10 to-transparent rounded-full blur-[100px] pointer-events-none" />

        {/* Radiant Atomic Shockwave on Click */}
        <AnimatePresence>
          {pulseCount > 0 && (
            <motion.div
              key={pulseCount}
              initial={{ scale: 0.5, opacity: 0.9 }}
              animate={{ scale: 2.8, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="absolute w-48 h-48 rounded-full border-2 border-cyan-400/80 shadow-stellar-glow pointer-events-none z-20"
            />
          )}
        </AnimatePresence>

        {/* ─── 3D ATOMIC PHOTON ORBITAL RINGS ─── */}
        <div 
          className="absolute w-[88%] h-[88%] pointer-events-none flex items-center justify-center z-0"
          style={{ transform: 'rotateX(65deg) rotateY(24deg)', transformStyle: 'preserve-3d' }}
        >
          <motion.div
            animate={{ rotateZ: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            className="relative w-full h-full rounded-full border-2 border-cyan-400/35 shadow-[0_0_15px_rgba(56,189,248,0.2)] flex items-center justify-center"
          >
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 flex items-center justify-center">
              <div className="w-5 h-5 rounded-full bg-cyan-400 shadow-[0_0_20px_#38bdf8] flex items-center justify-center animate-pulse">
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>
            </div>
          </motion.div>
        </div>

        <div 
          className="absolute w-[88%] h-[88%] pointer-events-none flex items-center justify-center z-0"
          style={{ transform: 'rotateX(-65deg) rotateY(24deg)', transformStyle: 'preserve-3d' }}
        >
          <motion.div
            animate={{ rotateZ: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            className="relative w-full h-full rounded-full border-2 border-purple-400/35 shadow-[0_0_15px_rgba(168,85,247,0.2)] flex items-center justify-center"
          >
            <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 flex items-center justify-center">
              <div className="w-5 h-5 rounded-full bg-purple-400 shadow-[0_0_20px_#c084fc] flex items-center justify-center animate-pulse">
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>
            </div>
          </motion.div>
        </div>

        <div 
          className="absolute w-[94%] h-[94%] pointer-events-none flex items-center justify-center z-0"
          style={{ transform: 'rotateX(82deg) rotateY(-10deg)', transformStyle: 'preserve-3d' }}
        >
          <motion.div
            animate={{ rotateZ: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
            className="relative w-full h-full rounded-full border border-dashed border-indigo-400/30 flex items-center justify-center"
          >
            <div className="absolute top-1/2 -left-2 -translate-y-1/2 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-indigo-400 shadow-[0_0_15px_#818cf8] flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* ─── IMMACULATE OFFICER EVA ─── */}
        <motion.div
          animate={{ 
            y: [-8, 8, -8],
            rotateZ: headPose.ry * 0.03,
          }}
          transition={{ 
            y: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' },
            rotateZ: { duration: 0.2 }
          }}
          onClick={handleOfficerClick}
          className="relative z-10 flex flex-col items-center justify-center cursor-pointer group my-auto"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <motion.div
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            className="relative w-36 h-28 rounded-[50%/60%_60%_40%_40%] p-2.5 flex flex-col items-center justify-center shadow-2xl transition-transform"
            style={{
              background: 'radial-gradient(ellipse at 35% 25%, #ffffff 0%, #f8fafc 40%, #e2e8f0 75%, #94a3b8 100%)',
              boxShadow: '0 20px 40px -10px rgba(0,0,0,0.65), inset -3px -5px 10px rgba(0,0,0,0.15), inset 3px 5px 12px rgba(255,255,255,0.9), 0 0 30px rgba(56,189,248,0.25)',
              rotateY: headPose.ry,
              rotateX: headPose.rx,
              transformStyle: 'preserve-3d',
            }}
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center justify-center z-20 pointer-events-none">
              <div className="px-3 py-1 rounded-full bg-slate-900/95 border border-amber-400/80 shadow-[0_0_12px_rgba(251,191,36,0.4)] flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span className="text-[8px] font-mono font-extrabold text-amber-300 uppercase tracking-wider">
                  Officer Eva
                </span>
              </div>
            </div>
            <div className="absolute top-1.5 left-5 w-14 h-5 rounded-full bg-gradient-to-b from-white to-transparent opacity-80 blur-[1px] pointer-events-none" />
            <div className="relative w-28 h-18 rounded-[50%/60%_60%_40%_40%] bg-gradient-to-b from-slate-950 via-black to-slate-950 border border-slate-700/60 shadow-inner flex items-center justify-center overflow-hidden p-2 mt-1">
              <div className="absolute -top-2 left-2 right-2 h-6 bg-gradient-to-b from-white/30 to-transparent rounded-full blur-[1.5px] pointer-events-none" />
              <motion.div 
                style={{ x: headPose.eyeX, y: headPose.eyeY }}
                className="flex items-center gap-5 transition-transform duration-75"
              >
                {/* Left Eye */}
                {robotMood === 'blink' ? (
                  <div className="w-6 h-1 rounded-full bg-cyan-300 shadow-[0_0_12px_#38bdf8]" />
                ) : robotMood === 'happy' ? (
                  <div className="w-6 h-5 border-t-[4px] border-l-[3px] border-r-[3px] border-transparent border-t-cyan-300 rounded-t-full shadow-[0_-2px_12px_#38bdf8] -rotate-6" />
                ) : (
                  <div className="w-5 h-6 rounded-[50%/60%_60%_40%_40%] bg-cyan-300 shadow-[0_0_18px_#38bdf8,inset_0_0_4px_#ffffff] flex items-center justify-center -rotate-12">
                    <div className="w-1.5 h-2 rounded-full bg-white shadow-sm" />
                  </div>
                )}
                {/* Right Eye */}
                {robotMood === 'blink' ? (
                  <div className="w-6 h-1 rounded-full bg-cyan-300 shadow-[0_0_12px_#38bdf8]" />
                ) : robotMood === 'happy' ? (
                  <div className="w-6 h-5 border-t-[4px] border-l-[3px] border-r-[3px] border-transparent border-t-cyan-300 rounded-t-full shadow-[0_-2px_12px_#38bdf8] rotate-6" />
                ) : (
                  <div className="w-5 h-6 rounded-[50%/60%_60%_40%_40%] bg-cyan-300 shadow-[0_0_18px_#38bdf8,inset_0_0_4px_#ffffff] flex items-center justify-center rotate-12">
                    <div className="w-1.5 h-2 rounded-full bg-white shadow-sm" />
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
          <div className="relative mt-2 flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
            <motion.div
              className="absolute -left-9 top-2 w-7 h-28 rounded-[50%/70%_30%_30%_70%] shadow-xl flex flex-col items-center pt-3"
              style={{
                background: 'radial-gradient(ellipse at 30% 20%, #ffffff 0%, #f1f5f9 50%, #cbd5e1 80%, #94a3b8 100%)',
                boxShadow: '-6px 10px 20px rgba(0,0,0,0.35), inset -2px -3px 6px rgba(0,0,0,0.12), inset 2px 3px 6px rgba(255,255,255,0.85)',
                rotateZ: -12 - headPose.wingRoll,
                y: headPose.rx * 0.25,
              }}
            >
              <div className="w-3.5 h-1 bg-amber-400/80 rounded-full shadow-[0_0_4px_#fbbf24]" />
            </motion.div>
            <motion.div
              className="relative w-28 h-34 rounded-[50%/20%_20%_80%_80%] shadow-2xl flex flex-col items-center justify-start pt-2 overflow-hidden"
              style={{
                background: 'radial-gradient(ellipse at 35% 25%, #ffffff 0%, #f8fafc 45%, #e2e8f0 75%, #94a3b8 100%)',
                boxShadow: '0 22px 42px -8px rgba(0,0,0,0.6), inset -3px -6px 12px rgba(0,0,0,0.15), inset 3px 5px 10px rgba(255,255,255,0.9)',
                rotateY: headPose.ry * 0.35,
                rotateX: headPose.bodyPitch || 0,
                transformStyle: 'preserve-3d',
              }}
            >
              <div className="w-18 h-4 rounded-full bg-slate-900 shadow-inner flex items-center justify-center border border-slate-700/60 mb-2 gap-1">
                <div className="w-1.5 h-2 bg-gradient-to-b from-amber-400 to-amber-600 rotate-45 rounded-[1px]" />
                <span className="text-[7px] font-mono font-bold text-amber-300">SEC-01</span>
              </div>
              <div className="w-11 h-11 rounded-full bg-card/90 border-2 border-cyan-400/70 flex items-center justify-center shadow-[0_0_15px_rgba(56,189,248,0.3)]">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-400 via-primary to-primary-glow flex items-center justify-center text-white shadow-inner animate-pulse">
                  <Shield className="w-4 h-4 text-white" />
                </div>
              </div>
              <span className="text-[8px] font-mono font-extrabold text-slate-800 mt-2 tracking-wider">
                RENTVAULT
              </span>
            </motion.div>
            <motion.div
              className="absolute -right-9 top-2 w-7 h-28 rounded-[50%/30%_70%_70%_30%] shadow-xl flex flex-col items-center pt-3"
              style={{
                background: 'radial-gradient(ellipse at 30% 20%, #ffffff 0%, #f1f5f9 50%, #cbd5e1 80%, #94a3b8 100%)',
                boxShadow: '6px 10px 20px rgba(0,0,0,0.35), inset -2px -3px 6px rgba(0,0,0,0.12), inset 2px 3px 6px rgba(255,255,255,0.85)',
                rotateZ: 12 - headPose.wingRoll,
                y: headPose.rx * 0.25,
              }}
            >
              <div className="w-3.5 h-1 bg-amber-400/80 rounded-full shadow-[0_0_4px_#fbbf24]" />
            </motion.div>
          </div>
          <span className="text-[9.5px] text-text-muted mt-3 font-mono opacity-80 group-hover:opacity-100 transition-opacity flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Officer Eva on Duty • Click to Salute</span>
          </span>
        </motion.div>

        {/* ─── DESKTOP CORNER TELEMETRY CHIPS (Only absolute on sm: block) ─── */}
        <TelemetryChip1 activeRoleMode={activeRoleMode} displayXLM={displayXLM} expandedChip={expandedChip} setExpandedChip={setExpandedChip} mobile={false} />
        <TelemetryChip2 expandedChip={expandedChip} setExpandedChip={setExpandedChip} mobile={false} />
        <TelemetryChip3 mobile={false} />
        <TelemetryChip4 connected={connected} truncateAddress={truncateAddress} address={address} expandedChip={expandedChip} setExpandedChip={setExpandedChip} mobile={false} />
      </div>

      {/* ─── MOBILE BOTTOM CHIPS CONTAINER (Only visible stacked on mobile) ─── */}
      <div className="flex sm:hidden flex-col gap-3 w-full items-center mt-12 z-20">
        <TelemetryChip3 mobile={true} />
        <TelemetryChip4 connected={connected} truncateAddress={truncateAddress} address={address} expandedChip={expandedChip} setExpandedChip={setExpandedChip} mobile={true} />
      </div>

    </div>
  );
};

// Extracted Subcomponents for DRY rendering (Mobile stacked vs Desktop absolute)

const TelemetryChip1 = ({ activeRoleMode, displayXLM, expandedChip, setExpandedChip, mobile }) => (
  <motion.div 
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.1 }}
    whileHover={{ scale: 1.04 }}
    onClick={() => setExpandedChip(expandedChip === 'balance' ? null : 'balance')}
    className={`${mobile ? 'relative w-full sm:hidden' : 'hidden sm:flex absolute top-2 -left-3'} z-20 bg-card/95 backdrop-blur-xl border px-3.5 py-2.5 rounded-2xl shadow-xl flex-col gap-1 max-w-[280px] sm:max-w-[220px] cursor-pointer transition-all duration-300 ${
      expandedChip === 'balance' ? 'border-cyan-400 ring-2 ring-cyan-400/20 shadow-[0_0_20px_rgba(56,189,248,0.25)]' : 'border-border/90 hover:border-cyan-400/40'
    }`}
  >
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-400 flex-shrink-0">
        <Coins className="w-4 h-4" />
      </div>
      <div>
        <div className="text-[9.5px] text-text-muted uppercase tracking-wider font-semibold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>{activeRoleMode === 'tenant' ? 'Locked Deposit' : 'Net Settlement'}</span>
        </div>
        <div className="text-xs font-extrabold text-text-primary font-mono tracking-tight">
          {displayXLM.toLocaleString('en-US')}.00 XLM
        </div>
      </div>
    </div>
    {expandedChip === 'balance' && (
      <motion.div 
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="pt-2 mt-1.5 border-t border-border/60 text-[9.5px] font-mono space-y-1 text-text-secondary"
      >
        <div className="flex justify-between"><span>Security Deposit:</span><span className="text-text-primary font-bold">1,200.00 XLM</span></div>
        <div className="flex justify-between"><span>Utility Reserve:</span><span className="text-text-primary font-bold">300.00 XLM</span></div>
        <div className="flex justify-between text-cyan-400 font-bold pt-1 border-t border-border/40"><span>Contract Custody:</span><span>100% On-Chain</span></div>
      </motion.div>
    )}
  </motion.div>
);

const TelemetryChip2 = ({ expandedChip, setExpandedChip, mobile }) => (
  <motion.div 
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.2 }}
    whileHover={{ scale: 1.04 }}
    onClick={() => setExpandedChip(expandedChip === 'speed' ? null : 'speed')}
    className={`${mobile ? 'relative w-full sm:hidden' : 'hidden sm:flex absolute top-4 -right-3'} z-20 bg-card/95 backdrop-blur-xl border px-3 py-2 rounded-2xl shadow-xl flex-col gap-1 max-w-[280px] sm:max-w-[200px] cursor-pointer transition-all duration-300 ${
      expandedChip === 'speed' ? 'border-primary-glow ring-2 ring-primary/20 shadow-stellar-glow' : 'border-border/90 hover:border-primary/40'
    }`}
  >
    <div className="flex items-center gap-2.5">
      <div className="w-7 h-7 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary-glow flex-shrink-0">
        <Zap className="w-3.5 h-3.5 text-primary" />
      </div>
      <div>
        <div className="text-[9.5px] text-text-muted uppercase tracking-wider font-semibold">Consensus Speed</div>
        <div className="text-[11px] font-bold text-text-primary font-mono flex items-center gap-1">
          3.8s Finality <span className="text-[8.5px] text-cyan-400 font-sans font-medium">• SCP</span>
        </div>
      </div>
    </div>
    {expandedChip === 'speed' && (
      <motion.div 
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        className="pt-2 mt-1.5 border-t border-border/60 text-[9.5px] text-text-secondary"
      >
        Zero banking delays. Near-instant settlement on Stellar Testnet.
      </motion.div>
    )}
  </motion.div>
);

const TelemetryChip3 = ({ mobile }) => (
  <motion.div 
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.3 }}
    whileHover={{ scale: 1.04 }}
    className={`${mobile ? 'relative w-full sm:hidden' : 'hidden sm:flex absolute bottom-2 left-0'} z-20 bg-card/95 backdrop-blur-xl border border-cyan-400/40 px-3.5 py-2.5 rounded-2xl shadow-xl items-center gap-2.5 max-w-[280px] sm:max-w-none`}
  >
    <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
      <Cpu className="w-4 h-4" />
    </div>
    <div>
      <div className="text-[9.5px] text-text-muted uppercase tracking-wider font-semibold">Smart Escrow</div>
      <div className="text-[11px] font-bold text-text-primary font-mono">
        Soroban Protocol 20
      </div>
    </div>
  </motion.div>
);

const TelemetryChip4 = ({ connected, truncateAddress, address, expandedChip, setExpandedChip, mobile }) => (
  <motion.div 
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.4 }}
    whileHover={{ scale: 1.04 }}
    onClick={() => setExpandedChip(expandedChip === 'auth' ? null : 'auth')}
    className={`${mobile ? 'relative w-full sm:hidden' : 'hidden sm:flex absolute bottom-2 right-0'} z-20 bg-card/95 backdrop-blur-xl border px-3.5 py-2.5 rounded-2xl shadow-xl flex-col gap-1 cursor-pointer max-w-[280px] sm:max-w-none transition-all duration-300 ${
      expandedChip === 'auth' ? 'border-cyan-400 ring-2 ring-cyan-400/20 shadow-[0_0_20px_rgba(56,189,248,0.25)]' : 'border-border/90 hover:border-cyan-400/40'
    }`}
  >
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-xl bg-surface border border-border flex items-center justify-center text-cyan-400 flex-shrink-0">
        <Key className="w-4 h-4" />
      </div>
      <div>
        <div className="text-[9.5px] text-text-muted uppercase tracking-wider font-semibold">Freighter Auth</div>
        {connected ? (
          <div className="text-xs font-bold text-cyan-400 flex items-center gap-1.5 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" /> {truncateAddress(address)}
          </div>
        ) : (
          <div className="text-xs font-bold text-text-primary flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Non-Custodial Key
          </div>
        )}
      </div>
    </div>
    {expandedChip === 'auth' && (
      <motion.div 
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        className="pt-2 mt-1.5 border-t border-border/60 text-[9.5px] text-text-secondary font-mono"
      >
        Ed25519 public key cryptographic authorization.
      </motion.div>
    )}
  </motion.div>
);
