import {
  Fill,
  Group,
  Image,
  Rect,
  SkiaClockValue,
  SkiaReadonlyValue,
  SkImage,
  Text,
  useDerivedValue,
  useImage,
  useLoop,
  useValue,
  useValueEffect,
  vec,
} from '@shopify/react-native-skia';
import React, {useRef} from 'react';
import {BIRD_SIZE, BIRD_X, SHOW_DEBUG} from './Config';

interface Props {
  birdY: SkiaReadonlyValue<number>;
  clock: SkiaClockValue;
}
const Bird = ({birdY, clock}: Props) => {
  const images: SkImage[] = [
    useImage(require('./assets/yellowbird-upflap.png')),
    useImage(require('./assets/yellowbird-midflap.png')),
    useImage(require('./assets/yellowbird-downflap.png')),
  ];

  const currentImage = useValue(0);

  useValueEffect(clock, () => {
    if (clock.current % 10 === 0) {
      if (currentImage.current <= images.length - 2) {
        currentImage.current += 1;
      } else {
        currentImage.current = 0;
      }
    }
    /* if (clock.current % 300 === 0) {
      
    } */
  });

  /* const rotateTransform = useDerivedValue(
    () => [{rotate: mix(progress.current, -Math.PI, 0)}],
    [progress],
  ); */

  const center = vec(BIRD_SIZE / 2, BIRD_SIZE / 2 - 64);

  return (
    <Group origin={center} /* transform={transform} */>
      {SHOW_DEBUG && (
        <>
          <Rect
            x={BIRD_X}
            y={birdY}
            width={BIRD_SIZE}
            height={BIRD_SIZE}
            color="yellow"
          />
          <Text
            x={20} // TODO: actual center
            y={200}
            text={currentImage.current.toString()}
            familyName="serif"
            size={20}
          />
        </>
      )}
      <Image
        x={BIRD_X}
        y={birdY}
        width={BIRD_SIZE}
        height={BIRD_SIZE}
        image={images[0]}
        fit="contain"
        opacity={currentImage.current === 0 ? 1 : 0}
      />
      <Image
        x={BIRD_X}
        y={birdY}
        width={BIRD_SIZE}
        height={BIRD_SIZE}
        image={images[1]}
        fit="contain"
        opacity={currentImage.current === 1 ? 1 : 0}
      />
      <Image
        x={BIRD_X}
        y={birdY}
        width={BIRD_SIZE}
        height={BIRD_SIZE}
        image={images[2]}
        fit="contain"
        opacity={currentImage.current === 2 ? 1 : 0}
      />
    </Group>
  );
};

export default Bird;
