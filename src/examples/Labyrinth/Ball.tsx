import {
  Circle,
  interpolate,
  RadialGradient,
  Shadow,
  Vector,
} from "@shopify/react-native-skia";
import React from "react";
import {
  Extrapolate,
  Extrapolation,
  SharedValue,
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import {
  BALL_GLARE_FACTOR,
  BALL_RADIUS,
  BALL_SHADOW_OFFSET_FACTOR,
} from "./Config";

interface BallInterface {
  x: SharedValue<number>;
  y: SharedValue<number>;
  shadowX: SharedValue<number>;
  shadowY: SharedValue<number>;
  gameBoxWidth: number;
  gameBoxHeight: number;
  gameBoxY: number;
  ballRadius: SharedValue<number>;
}

const Ball = ({
  x,
  y,
  shadowX,
  shadowY,
  ballRadius,
  gameBoxWidth,
  gameBoxHeight,
  gameBoxY,
}: BallInterface) => {
  const ballShadowX = useSharedValue(0);
  const ballShadowY = useSharedValue(0);

  useDerivedValue(() => {
    ballShadowX.value = shadowX.value * BALL_SHADOW_OFFSET_FACTOR;
    ballShadowY.value = shadowY.value * BALL_SHADOW_OFFSET_FACTOR;
  }, [ballShadowX, ballShadowY, shadowX, shadowY]);

  const positionKey = useDerivedValue(() => x.value + y.value, [x, y]);

  /* const ballColor = useDerivedValue(
    () =>
      interpolateColors(
        ballRadius.value,
        [BALL_RADIUS * 0.7, BALL_RADIUS],
        ['#444', '#888'],
      ),
    [ballRadius],
  ); */

  const glareVector: SharedValue<Vector> = useSharedValue({
    x: x.value,
    y: y.value,
  });

  useAnimatedReaction(
    () => positionKey.value,
    () => {
      const glareOffsetHorizontal = interpolate(
        x.value,
        [0, gameBoxWidth],
        [BALL_RADIUS * BALL_GLARE_FACTOR, -BALL_RADIUS * BALL_GLARE_FACTOR],
        Extrapolation.CLAMP
      );
      const glareOffsetVertical = interpolate(
        y.value - gameBoxY,
        [0, gameBoxHeight],
        [BALL_RADIUS * BALL_GLARE_FACTOR, -BALL_RADIUS * BALL_GLARE_FACTOR],
        Extrapolation.CLAMP
      );
      glareVector.value = {
        x: x.value + glareOffsetHorizontal,
        y: y.value + glareOffsetVertical,
      };
    }
  );

  return (
    <>
      <Circle cx={x} cy={y} r={ballRadius} /*  color={ballColor} */>
        <Shadow
          dx={ballShadowX}
          dy={ballShadowY}
          blur={1}
          color={"rgba(106,81,64,1)"}
        />
        <RadialGradient // The light glare on the ball
          // TODO: set the origin to center
          c={glareVector}
          r={ballRadius}
          colors={["#AAA", "#444"]}
        />
        {/* <RadialGradient
            c={vec(0, 0)}
            r={ballRadius.value}
            colors={['#00ff87', '#60efff']}
          /> */}
      </Circle>
    </>
  );
};

export default Ball;
