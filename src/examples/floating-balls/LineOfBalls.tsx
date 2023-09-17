import React, { useEffect } from "react";
import {
  Group,
  SkMatrix,
  Skia,
  SkiaMutableValue,
  SkiaValue,
  processTransform2d,
  useComputedValue,
  useSharedValueEffect,
  useValue,
} from "@shopify/react-native-skia";
import Ball from "./Ball";
import { useWindowDimensions } from "react-native";
import { DEFAULT_BALL_RADIUS, TRAPEZIUM_EFFECT } from "./FloatingBalls";
import {
  SharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated";

interface Props {
  offsetY: SkiaValue<number>;
  amplitude: SharedValue<number>;
  yStart: number;
  xStart: number;
  numberOfBallsHorizontally: number;
  viewingAngleHorizontal: SharedValue<number>;
  matrix: SharedValue<SkMatrix>;
}

const LineOfBalls = ({
  offsetY,
  amplitude,
  yStart,
  xStart,
  numberOfBallsHorizontally,
  viewingAngleHorizontal,
  matrix,
}: Props) => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  let radius = DEFAULT_BALL_RADIUS;

  let widthToOccupy = screenWidth; // for the first row, the entire width of screen may be occupied
  widthToOccupy -= yStart / TRAPEZIUM_EFFECT;
  const factor = 1 - yStart / screenHeight;

  radius *= factor;

  const margin =
    (widthToOccupy - numberOfBallsHorizontally * (radius * 2)) /
    numberOfBallsHorizontally;

  const lineMargin = screenWidth - widthToOccupy;

  const balls = React.useMemo(() => {
    const _balls: { x: number }[] = new Array(numberOfBallsHorizontally);

    for (let i = 0; i < numberOfBallsHorizontally; i++) {
      _balls.push({
        x:
          i * (widthToOccupy / numberOfBallsHorizontally) +
          Math.max(0, margin / 2) +
          lineMargin / 2,
      });
    }
    return _balls;
  }, [lineMargin, margin, numberOfBallsHorizontally, widthToOccupy, xStart]);

  const groupTransform = useComputedValue(
    () => [
      {
        translateX:
          Math.tan((viewingAngleHorizontal.value * Math.PI) / 180) * xStart +
          radius,
      },
      { translateY: yStart },
    ],
    [xStart, viewingAngleHorizontal]
  );
  /* const groupTransform2 = useDerivedValue(() => [
    {
      translateX:
        Math.tan((viewingAngleHorizontal.value * Math.PI) / 180) * xStart +
        radius,
    },
    { translateY: yStart },
  ]); */

  /* 
  const groupMatrix = useComputedValue(() => {
    return processTransform2d([
      {
        translateX:
          Math.tan((viewingAngleHorizontal.value * Math.PI) / 180) * xStart +
          radius,
      },
      { translateY: yStart },
    ]);
  }, [matrix]); */

  return (
    <Group transform={groupTransform} /* matrix={matrix} */>
      {balls.map((ball, index) => (
        <Ball
          key={index}
          x={ball.x}
          offsetY={offsetY}
          index={index}
          amplitude={amplitude}
          radius={radius}
        />
      ))}
    </Group>
  );
};

export default LineOfBalls;
