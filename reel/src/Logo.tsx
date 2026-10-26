import {AbsoluteFill, interpolate, spring, useVideoConfig} from 'remotion';
import {useRef, useEffect} from 'react';

const BG = '#0a0f1a';
const TEAL = '#22d3ee';
const CYAN = '#0891b2';

export const Logo = () => {
  const {durationInFrames, fps} = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = (frame: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const mastH = Math.min(canvas.width, canvas.height) * 0.18;
      const mastX = cx - mastH * 0.15;
      const mastY = cy - mastH * 0.5;

      // mast
      ctx.strokeStyle = '#67e8f9';
      ctx.lineWidth = Math.max(2, canvas.width * 0.002);
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(mastX, mastY);
      ctx.lineTo(mastX, mastY + mastH);
      ctx.stroke();

      // sail
      const t = frame / fps;
      const sway = Math.sin(t * 2) * 4;
      ctx.beginPath();
      ctx.moveTo(mastX, mastY + 6);
      ctx.bezierCurveTo(
        mastX + mastH * 0.85 + sway, mastY + mastH * 0.25,
        mastX + mastH * 0.95 + sway, mastY + mastH * 0.6,
        mastX, mastY + mastH
      );
      ctx.closePath();
      const grad = ctx.createLinearGradient(mastX, mastY, mastX + mastH, mastY + mastH);
      grad.addColorStop(0, TEAL);
      grad.addColorStop(1, CYAN);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.strokeStyle = BG;
      ctx.lineWidth = Math.max(1, canvas.width * 0.001);
      ctx.stroke();

      // keel
      ctx.beginPath();
      ctx.moveTo(mastX - mastH * 0.4, mastY + mastH);
      ctx.lineTo(mastX + mastH * 0.4, mastY + mastH);
      ctx.lineTo(mastX + mastH * 0.3, mastY + mastH + mastH * 0.25);
      ctx.lineTo(mastX - mastH * 0.3, mastY + mastH + mastH * 0.25);
      ctx.closePath();
      ctx.fillStyle = '#0e7490';
      ctx.fill();

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