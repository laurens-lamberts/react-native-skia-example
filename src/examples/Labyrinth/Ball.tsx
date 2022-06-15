import {
  Circle,
  Oval,
  RadialGradient,
  RoundedRect,
  Shadow,
  SkiaValue,
  useDerivedValue,
  useValue,
  vec,
} from '@shopify/react-native-skia';
import React from 'react';
import {BALL_SIZE} from './Config';

interface BallInterface {
  startX: number;
  startY: number;
  x: SkiaValue<number>;
  y: SkiaValue<number>;
  shadowX: SkiaValue<number>;
  shadowY: SkiaValue<number>;
  screenWidth: number;
  ballSize: SkiaValue<number>;
}

const Ball = ({
  x,
  y,
  shadowX,
  shadowY,
  startX,
  startY,
  screenWidth,
  ballSize,
}: BallInterface) => {
  const ballShadowX = useValue(0);
  const ballShadowY = useValue(0);

  useDerivedValue(() => {
    ballShadowX.current = shadowX.current / 1.5;
    ballShadowY.current = shadowY.current / 1.5;
  }, [shadowX, shadowY]);

  return (
    /* // Oval is used instead of Circle, because i'm not sure about the best way to do position correction.
    as circle has it's origin in the middle, where other shapes have the origin at left top corner. */
    <Oval x={x} y={y} width={ballSize} height={ballSize} color="#CCC">
      <Shadow
        dx={ballShadowX}
        dy={ballShadowY}
        blur={1}
        color={'rgba(106,81,64,1)'}
      />
      <RadialGradient // The light glare on the ball
        // TODO: set the origin to center
        c={vec(startX, startY)}
        r={screenWidth * 1.1}
        colors={['#AAA', '#333']}
      />
    </Oval>
  );
};

export default Ball;
