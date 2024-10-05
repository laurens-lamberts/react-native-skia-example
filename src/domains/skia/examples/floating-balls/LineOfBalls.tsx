import React from "react";
import { Group, SkMatrix } from "@shopify/react-native-skia";
import { translate } from "@app/helpers/MatrixHelpers";
import Ball from "./Ball";
import { useWindowDimensions } from "react-native";
import { SharedValue, useDerivedValue } from "react-native-reanimated";
import { DEFAULT_BALL_RADIUS, TRAPEZIUM_EFFECT } from "./config";

interface Props {
  offsetY: SharedValue<number>;
  amplitude: SharedValue<number>;
  yStart: number;
  xStart: number;
  numberOfBallsHorizontally: number;
  viewingAngleHorizontal: SharedValue<number>;
  viewingAngleVertical: SharedValue<number>;
  matrix: SharedValue<SkMatrix>;
}

const LineOfBalls = ({
  offsetY,
  amplitude,
  yStart,
  xStart,
  numberOfBallsHorizontally,
  viewingAngleHorizontal,
  viewingAngleVertical,
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

  const matrixOffset = useDerivedValue(
    () =>
      translate(
        matrix.value,
        Math.tan((viewingAngleHorizontal.value * Math.PI) / 180) * xStart +
          radius,
        Math.tan((viewingAngleVertical.value * Math.PI) / 180) * yStart
      ),
    [xStart, viewingAngleHorizontal, matrix]
  );
  /* const groupTransform = useDerivedValue(
    () => [
      {
        translateX:
          Math.tan((viewingAngleHorizontal.value * Math.PI) / 180) * xStart +
          radius,
      },
      { translateY: yStart },
    ],
    [xStart, viewingAngleHorizontal]
  ); */

  return (
    <Group /* transform={groupTransform}  */ matrix={matrixOffset}>
      {balls.map((ball, index) => (
        <Ball
          key={index}
          x={ball.x}
          offsetY={offsetY}
          index={index}
          amplitude={amplitude}
          radius={radius}
          viewingAngleVertical={viewingAngleVertical}
        />
      ))}
    </Group>
  );
};

export default LineOfBalls;
