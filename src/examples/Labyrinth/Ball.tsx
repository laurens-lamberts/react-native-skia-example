import {
  RoundedRect,
  Shadow,
  SkiaValue,
  useDerivedValue,
  useValue,
} from '@shopify/react-native-skia';
import React from 'react';
import {BALL_SIZE} from './Config';

interface BallInterface {
  x: SkiaValue<number>;
  y: SkiaValue<number>;
  shadowX: SkiaValue<number>;
  shadowY: SkiaValue<number>;
}

const Ball = ({x, y, shadowX, shadowY}: BallInterface) => {
  const ballShadowX = useValue(0);
  const ballShadowY = useValue(0);

  useDerivedValue(() => {
    ballShadowX.current = shadowX.current / 2;
    ballShadowY.current = shadowY.current / 2;
  }, [shadowX, shadowY]);

  return (
    <RoundedRect
      x={x}
      y={y}
      width={BALL_SIZE}
      height={BALL_SIZE}
      r={BALL_SIZE / 2}
      color="#222">
      <Shadow
        dx={ballShadowX}
        dy={ballShadowY}
        blur={1}
        color={'rgba(106,81,64,1)'}
      />
    </RoundedRect>
  );
};

export default Ball;
