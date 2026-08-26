import React, { useEffect, useRef } from 'react';

/**
 * ThreeBackground.jsx
 * Ultra-lightweight, 60+ FPS 3D Canvas Perspective Mesh & Node Constellation.
 * Provides subtle, professional depth, mouse parallax, and Stellar Midnight ambient drift.
 */
export const ThreeBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse parallax state with smooth damping
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let scrollY = window.scrollY;

    // Handle mouse movement for subtle 3D camera parallax
    const handleMouseMove = (e) => {
      // Normalized between -1 and 1
      mouse.targetX = (e.clientX / width) * 2 - 1;
      mouse.targetY = (e.clientY / height) * 2 - 1;
    };

    const handleScroll = () => {
      scrollY = window.scrollY;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    // ─── 3D Particle Constellation Parameters ─────────────────────────────────
    const NUM_PARTICLES = Math.min(Math.floor(width / 22), 65);
    const FOV = 450; // Focal length for 3D perspective projection
    const BOUNDS = 700;

    class Particle3D {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = (Math.random() - 0.5) * BOUNDS * 2;
        this.y = (Math.random() - 0.5) * BOUNDS * 2;
        this.z = initial ? (Math.random() - 0.5) * BOUNDS * 1.5 : BOUNDS;
        
        // Subtle drift velocities
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.vz = -0.4 - Math.random() * 0.4; // Slowly moves toward camera

        this.baseRadius = 1.2 + Math.random() * 1.8;
        // Color palette: Stellar Cyan, Indigo, Violet
        const palette = [
          'rgba(59, 130, 246, ',   // Blue
          'rgba(99, 102, 241, ',   // Indigo
          'rgba(168, 85, 247, ',   // Violet
          'rgba(56, 189, 248, ',   // Sky
        ];
        this.colorPrefix = palette[Math.floor(Math.random() * palette.length)];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.z += this.vz;

        // Reset if behind camera or too far
        if (this.z < -FOV + 50) {
          this.z = BOUNDS;
          this.x = (Math.random() - 0.5) * BOUNDS * 2;
          this.y = (Math.random() - 0.5) * BOUNDS * 2;
        }
      }
    }

    const particles = Array.from({ length: NUM_PARTICLES }, () => new Particle3D());

    // ─── 3D Coordinate Rotation & Projection Math ────────────────────────────
    let angleX = 0;
    let angleY = 0;

    const render = () => {
      // Smooth lerp mouse parallax
      mouse.x += (mouse.targetX - mouse.x) * 0.04;
      mouse.y += (mouse.targetY - mouse.y) * 0.04;

      // Base rotation + subtle mouse tilt + scroll pitch
      angleY += 0.0008;
      const rotY = angleY + mouse.x * 0.3;
      const rotX = mouse.y * 0.2 + (scrollY * 0.0002);

      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      // Clear with dark transparent canvas
      ctx.clearRect(0, 0, width, height);

      // Projected screen positions array
      const projected = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.update();

        // 3D rotation around Y then X
        const x1 = p.x * cosY - p.z * sinY;
        const z1 = p.z * cosY + p.x * sinY;

        const y2 = p.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + p.y * sinX;

        // 3D Perspective Projection formula
        const depth = z2 + FOV + 150;
        if (depth <= 0) continue;

        const scale = FOV / depth;
        const screenX = width / 2 + x1 * scale;
        const screenY = height / 2 + y2 * scale;
        const radius = Math.max(p.baseRadius * scale, 0.4);
        const alpha = Math.min(Math.max((depth / (BOUNDS + FOV)), 0.1), 0.85);

        projected.push({
          x: screenX,
          y: screenY,
          radius,
          scale,
          alpha,
          colorPrefix: p.colorPrefix,
          rawZ: z2,
        });
      }

      // Draw 3D connection lines between nearby nodes
      const MAX_DIST = 130;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const p1 = projected[i];
          const p2 = projected[j];

          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < MAX_DIST) {
            const lineAlpha = (1 - dist / MAX_DIST) * 0.18 * Math.min(p1.alpha, p2.alpha);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${lineAlpha})`;
            ctx.lineWidth = 0.75 * Math.min(p1.scale, p2.scale);
            ctx.stroke();
          }
        }
      }

      // Draw 3D glowing particle nodes
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];

        // Soft outer radial glow
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3.5);
        glow.addColorStop(0, `${p.colorPrefix}${p.alpha * 0.6})`);
        glow.addColorStop(1, `${p.colorPrefix}0)`);

        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Core bright dot
        ctx.fillStyle = `${p.colorPrefix}${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw subtle background geometric ambient rings in deep space
      const centerX = width / 2 + mouse.x * 35;
      const centerY = height / 2.2 + mouse.y * 35;

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angleY * 0.5);

      // Outer ellipse
      ctx.beginPath();
      ctx.ellipse(0, 0, width * 0.38, height * 0.22, Math.PI / 6, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(79, 70, 229, 0.04)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Inner ellipse
      ctx.beginPath();
      ctx.ellipse(0, 0, width * 0.22, height * 0.13, -Math.PI / 4, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.035)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* 3D Canvas Layer */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ opacity: 0.95 }}
      />
      
      {/* Vignette Overlay for Crisp Typography Contrast */}
      <div 
        className="absolute inset-0 bg-radial from-transparent via-background/40 to-background/90 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 30%, transparent 20%, rgba(11, 15, 25, 0.45) 60%, rgba(11, 15, 25, 0.85) 100%)'
        }}
      />
    </div>
  );
};
