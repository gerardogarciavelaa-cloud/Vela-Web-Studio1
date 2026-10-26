import {Composition, registerRoot} from 'remotion';
import {RemotionVideo} from './Video';

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="video"
        component={RemotionVideo}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};

registerRoot(RemotionRoot);