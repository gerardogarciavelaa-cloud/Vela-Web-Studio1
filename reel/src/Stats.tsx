import {AbsoluteFill, interpolate, spring, useVideoConfig} from 'remotion';

const TEAL = '#22d3ee';

const items = [
  {number: '7 Días', label: 'Garantía de Entrega'},
  {number: '+502', label: 'Soporte Directo WhatsApp'},
  {number: '100%', label: 'Dark Fintech Estética'},
];

export const Stats = () => {
  const {fps} = useVideoConfig();

  return (
    <AbsoluteFill style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 40}}>
      <div style={{display: 'flex', gap: 40, flexWrap: 'wrap', justifyContent: 'center', padding: '0 20px'}}>
        {items.map((it, i) => (
          <div key={i} style={{background: 'rgba(17,24,39,0.7)', border: '1px solid rgba(30,41,59,0.8)', borderRadius: 16, padding: '28px 36px', minWidth: 180, animation: `cardIn 0.6s cubic-bezier(0.23,1,0.32,1) ${i * 120}ms both`}}>
              <div style={{color: TEAL, fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800, fontFamily: 'Inter, sans-serif', textShadow: '0 0 20px rgba(34,211,238,0.3)'}}>{it.number}</div>
              <div style={{color: '#94a3b8', fontSize: 'clamp(12px, 1.6vw, 16px)', marginTop: 8, fontFamily: 'Inter, sans-serif'}}>{it.label}</div>
            </div>
        ))}
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </AbsoluteFill>
  );
};