import {
  Circle,
  RadialGradient,
  Shadow,
  SkiaValue,
  useDerivedValue,
  useValue,
  vec,
} from '@shopify/react-native-skia';
import React from 'react';
import {BALL_SHADOW_OFFSET_FACTOR} from './Config';

interface BallInterface {
  startX: number;
  startY: number;
  x: SkiaValue<number>;
  y: SkiaValue<number>;
  shadowX: SkiaValue<number>;
  shadowY: SkiaValue<number>;
  screenWidth: number;
  ballRadius: SkiaValue<number>;
}

const Ball = ({
  x,
  y,
  shadowX,
  shadowY,
  startX,
  startY,
  screenWidth,
  ballRadius,
}: BallInterface) => {
  const ballShadowX = useValue(0);
  const ballShadowY = useValue(0);

  useDerivedValue(() => {
    ballShadowX.current = shadowX.current * BALL_SHADOW_OFFSET_FACTOR;
    ballShadowY.current = shadowY.current * BALL_SHADOW_OFFSET_FACTOR;
  }, [ballShadowX, ballShadowY, shadowX, shadowY]);

  return (
    /* // Oval is used instead of Circle, because i'm not sure about the best way to do position correction.
    as circle has it's origin in the middle, where other shapes have the origin at left top corner. */
    <Circle cx={x} cy={y} r={ballRadius} color="#CCC">
      <Shadow
        dx={ballShadowX}
        dy={ballShadowY}
        blur={1}
        color={'rgba(106,81,64,1)'}
      />
      <RadialGradient // The light glare on the ball
        // TODO: set the origin to center
        c={vec(startX, startY)}
        r={screenWidth * 1.4}
        colors={['#AAA', '#333']}
      />
    </Circle>
  );
};

export default Ball;
