# Vela Web Studio — Remotion Cinematic Reel

Componente de video animado (Dark Fintech, 60FPS) construido con **Remotion**.
Sirve como assets promocional y de marca para la agencia Vela Web Studio.

## Estructura

- `src/Video.tsx` — composición principal (secuencias de Logo → Title → Stats → Contact).
- `src/Background.tsx` — canvas animado de partículas + rejilla de circuitos.
- `src/Logo.tsx` — isotipo de vela con balanceo (sail sway).
- `src/Title.tsx` — tipografía animada con stagger de palabras.
- `src/Stats.tsx` — métricas de confianza con animación de tarjetas.
- `src/Contact.tsx` — catálogo de precios + WhatsApp.

## Comandos

```bash
cd reel
npm install
npx remotion studio     # Previsualizar en el navegador (60FPS)
npx remotion render video   # Renderizar a MP4 (1080p, H.264)
```

## Configuración de render

- **Duración**: ~10 segundos (300 frames @ 30fps).
- **Resolución**: 1920×1080.
- **FPS**: 30 (Remotion por defecto; compatible con 60FPS si se desea).