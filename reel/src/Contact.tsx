import {AbsoluteFill, interpolate, spring, useVideoConfig} from 'remotion';

const TEAL = '#22d3ee';
const CYAN = '#0891b2';

export const Contact = () => {
  const {fps} = useVideoConfig();

  const appear = spring({frame: 0, durationInFrames: 25, fps, damping: 200});
  const opacity = interpolate(appear, [0, 1], [0, 1]);
  const scale = interpolate(appear, [0, 1], [0.9, 1]);

  return (
    <AbsoluteFill style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, opacity, transform: `scale(${scale})`}}>
      <div style={{color: '#94a3b8', fontSize: 'clamp(14px, 2vw, 20px)', fontFamily: 'Inter, sans-serif', animation: `fadeUp 0.6s ease-out both`}}>Guatemala • WhatsApp +502 4466 1266</div>
      <div style={{display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', padding: '0 20px', animation: `fadeUp 0.6s ease-out 0.15s both`}}>
        {['Vela Express Q999', 'Web Pro Q1,899', 'Commerce Q2,999', 'Enterprise Q4,999'].map((p, i) => (
          <div key={i} style={{background: 'linear-gradient(135deg, rgba(34,211,238,0.12), rgba(8,145,178,0.08))', border: '1px solid rgba(34,211,238,0.3)', borderRadius: 12, padding: '14px 22px', color: TEAL, fontSize: 'clamp(12px, 1.5vw, 16px)', fontWeight: 600, fontFamily: 'Inter, sans-serif', animation: `fadeUp 0.5s ease-out ${0.3 + i * 0.1}s both`}}>{p}</div>
        ))}
      </div>
      <div style={{color: '#64748b', fontSize: 'clamp(10px, 1.2vw, 14px)', fontFamily: 'Inter, sans-serif', marginTop: 10, animation: `fadeUp 0.6s ease-out 0.7s both`}}>Todos los derechos reservados • Vela Web Studio</div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </AbsoluteFill>
  );
};