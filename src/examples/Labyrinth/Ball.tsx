import {
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
}

const Ball = ({
  x,
  y,
  shadowX,
  shadowY,
  startX,
  startY,
  screenWidth,
}: BallInterface) => {
  const ballShadowX = useValue(0);
  const ballShadowY = useValue(0);

  useDerivedValue(() => {
    ballShadowX.current = shadowX.current / 1.5;
    ballShadowY.current = shadowY.current / 1.5;
  }, [shadowX, shadowY]);

  return (
    <RoundedRect
      x={x}
      y={y}
      width={BALL_SIZE}
      height={BALL_SIZE}
      r={BALL_SIZE / 2}
      color="#CCC">
      <Shadow
        dx={ballShadowX}
        dy={ballShadowY}
        blur={1}
        color={'rgba(106,81,64,1)'}
      />
      <RadialGradient // The light glare on the ball
        // TODO: set the origin to center
        c={vec(startX, startY)}
        r={screenWidth * 0.8}
        colors={['#AAA', '#333']}
      />
    </RoundedRect>
  );
};

export default Ball;
