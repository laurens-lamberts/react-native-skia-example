import {
  Fill,
  Group,
  Image,
  Rect,
  SkiaReadonlyValue,
  useDerivedValue,
  useImage,
  useLoop,
  useValueEffect,
  vec,
} from '@shopify/react-native-skia';
import React from 'react';
import {BIRD_SIZE, BIRD_X, SHOW_DEBUG} from './Config';

interface Props {
  birdY: SkiaReadonlyValue<number>;
}
const Bird = ({birdY}: Props) => {
  /* const flapProgress = useLoop({
    duration: 3000,
    //easing: Easing.inOut(Easing.ease),
  }); */

  let image = require('./assets/yellowbird-upflap.png');

  /* const loopImage = useValueEffect(flapProgress, () => {
    image = require('./assets/yellowbird-upflap.png');
  }); */
  /* const rotateTransform = useDerivedValue(
    () => [{rotate: mix(progress.current, -Math.PI, 0)}],
    [progress],
  ); */

  const skiaImage = useImage(image);

  const center = vec(BIRD_SIZE / 2, BIRD_SIZE / 2 - 64);

  return (
    <Group origin={center} /* transform={transform} */>
      {!!skiaImage && (
        <>
          {SHOW_DEBUG && (
            <Rect
              x={BIRD_X}
              y={birdY}
              width={BIRD_SIZE}
              height={BIRD_SIZE}
              color="yellow"
            />
          )}

          <Image
            x={BIRD_X}
            y={birdY}
            width={BIRD_SIZE}
            height={BIRD_SIZE}
            image={skiaImage}
            fit="contain"></Image>
        </>
      )}
    </Group>
  );
};

export default Bird;
