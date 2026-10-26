import {AbsoluteFill, interpolate, spring, useVideoConfig} from 'remotion';

const TEAL = '#22d3ee';
const CYAN = '#0891b2';

export const Title = () => {
  const {durationInFrames, fps} = useVideoConfig();

  const appear = spring({frame: 0, durationInFrames: 30, fps, damping: 200});
  const opacity = interpolate(appear, [0, 1], [0, 1]);
  const translateY = interpolate(appear, [0, 1], [40, 0]);

  const line1 = 'Ingeniería Web de Vanguardia';
  const line2 = '& Ciberseguridad Ofensiva';

  const charDelay = 6;
  const wordDelay = 8;

  return (
    <AbsoluteFill style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, opacity, transform: `translateY(${translateY}px)`}}>
      <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12, maxWidth: '90%'}}>
        {line1.split(' ').map((word, wi) => (
          <span key={wi} style={{display: 'inline-block', color: '#e2e8f0', fontSize: 'clamp(28px, 6vw, 72px)', fontWeight: 800, fontFamily: 'Inter, sans-serif', textShadow: '0 0 30px rgba(34,211,238,0.25)', animation: `reveal 0.6s cubic-bezier(0.23,1,0.32,1) ${wi * wordDelay}ms both`}}>
            {word}
          </span>
        ))}
      </div>
      <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12, maxWidth: '90%'}}>
        {line2.split(' ').map((word, wi) => (
          <span key={wi} style={{display: 'inline-block', background: 'linear-gradient(90deg, #22d3ee, #0891b2)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', fontSize: 'clamp(28px, 6vw, 72px)', fontWeight: 800, fontFamily: 'Inter, sans-serif', animation: `reveal 0.6s cubic-bezier(0.23,1,0.32,1) ${(line1.split(' ').length + wi) * wordDelay}ms both`}}>
            {word}
          </span>
        ))}
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes reveal {
          from { opacity: 0; transform: translateY(30px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}} />
    </AbsoluteFill>
  );
};