import {AbsoluteFill, interpolate, spring, useVideoConfig} from 'remotion';
import {useEffect, useRef} from 'react';

const BG = '#0a0f1a';
const TEAL = '#22d3ee';
const CYAN = '#0891b2';

export const Background = () => {
  const {durationInFrames, fps} = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const N = 40;
    const pts = Array.from({length: N}, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.2 + 0.6,
    }));

    const draw = (frame: number) => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // subtle radial glow
      const grad = ctx.createRadialGradient(
        window.innerWidth / 2, window.innerHeight / 2, 0,
        window.innerWidth / 2, window.innerHeight / 2, window.innerWidth * 0.7
      );
      grad.addColorStop(0, 'rgba(8,145,178,0.10)');
      grad.addColorStop(1, 'rgba(10,15,26,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      // grid
      ctx.strokeStyle = 'rgba(30,41,59,0.25)';
      ctx.lineWidth = 1;
      const offset = (frame * 0.2) % 40;
      for (let x = -offset; x < window.innerWidth; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, window.innerHeight);
        ctx.stroke();
      }
      for (let y = -offset; y < window.innerHeight; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(window.innerWidth, y);
        ctx.stroke();
      }

      // particles
      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > window.innerWidth) p.vx *= -1;
        if (p.y < 0 || p.y > window.innerHeight) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = TEAL;
        ctx.fill();
      }

      // connections
      ctx.strokeStyle = 'rgba(34,211,238,0.12)';
      ctx.lineWidth = 1;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i], b = pts[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < 140) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(() => draw(frame + 1));
    };
    draw(0);

    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <AbsoluteFill>
      <canvas ref={canvasRef} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none'}} />
    </AbsoluteFill>
  );
};