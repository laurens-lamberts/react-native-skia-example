import {
  Circle,
  interpolate,
  RadialGradient,
  Shadow,
  SkiaMutableValue,
  SkiaValue,
  useDerivedValue,
  useValue,
  useValueEffect,
  Vector,
} from '@shopify/react-native-skia';
import React from 'react';
import {Extrapolate} from 'react-native-reanimated';
import {
  BALL_GLARE_FACTOR,
  BALL_RADIUS,
  BALL_SHADOW_OFFSET_FACTOR,
} from './Config';

interface BallInterface {
  startX: number;
  startY: number;
  x: SkiaValue<number>;
  y: SkiaValue<number>;
  shadowX: SkiaValue<number>;
  shadowY: SkiaValue<number>;
  screenWidth: number;
  gameBoxWidth: number;
  gameBoxHeight: number;
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
  gameBoxWidth,
  gameBoxHeight,
}: BallInterface) => {
  const ballShadowX = useValue(0);
  const ballShadowY = useValue(0);

  useDerivedValue(() => {
    ballShadowX.current = shadowX.current * BALL_SHADOW_OFFSET_FACTOR;
    ballShadowY.current = shadowY.current * BALL_SHADOW_OFFSET_FACTOR;
  }, [ballShadowX, ballShadowY, shadowX, shadowY]);

  /* const ballColor = useDerivedValue(
    () =>
      interpolateColors(
        ballRadius.current,
        [BALL_RADIUS * 0.7, BALL_RADIUS],
        ['#444', '#888'],
      ),
    [ballRadius],
  ); */

  const glareVector: SkiaMutableValue<Vector> = useValue({
    x: x.current - 4,
    y: y.current - 4,
  });

  useValueEffect(x, () => {
    const glareOffsetHorizontal = interpolate(
      x.current,
      [0, gameBoxWidth],
      [BALL_RADIUS * BALL_GLARE_FACTOR, -BALL_RADIUS * BALL_GLARE_FACTOR],
      Extrapolate.CLAMP,
    );
    const glareOffsetVertical = interpolate(
      y.current,
      [0, gameBoxHeight],
      [BALL_RADIUS * BALL_GLARE_FACTOR, -BALL_RADIUS * BALL_GLARE_FACTOR],
      Extrapolate.CLAMP,
    );
    glareVector.current = {
      x: x.current + glareOffsetHorizontal,
      y: y.current + glareOffsetVertical,
    };
  });

  return (
    <>
      <Circle cx={x} cy={y} r={ballRadius} /*  color={ballColor} */>
        <Shadow
          dx={ballShadowX}
          dy={ballShadowY}
          blur={1}
          color={'rgba(106,81,64,1)'}
        />
        <RadialGradient // The light glare on the ball
          // TODO: set the origin to center
          c={glareVector}
          r={ballRadius}
          colors={['#AAA', '#444']}
        />
        {/* <RadialGradient
            c={vec(0, 0)}
            r={ballRadius.current}
            colors={['#00ff87', '#60efff']}
          /> */}
      </Circle>
    </>
  );
};

export default Ball;
