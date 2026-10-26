import {AbsoluteFill, Sequence, interpolate, spring, useVideoConfig} from 'remotion';
import {Title} from './Title';
import {Logo} from './Logo';
import {Stats} from './Stats';
import {Contact} from './Contact';
import {Background} from './Background';

export const RemotionVideo = () => {
  const {fps, durationInFrames} = useVideoConfig();

  return (
    <AbsoluteFill style={{backgroundColor: '#0a0f1a'}}>
      <Background />

      <Sequence from={0} durationInFrames={durationInFrames}>
        <Logo />
      </Sequence>

      <Sequence from={30} durationInFrames={durationInFrames - 30}>
        <Title />
      </Sequence>

      <Sequence from={90} durationInFrames={durationInFrames - 90}>
        <Stats />
      </Sequence>

      <Sequence from={180} durationInFrames={durationInFrames - 180}>
        <Contact />
      </Sequence>
    </AbsoluteFill>
  );
};