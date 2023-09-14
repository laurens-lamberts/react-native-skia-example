import React from 'react';
import {Group, SkiaValue} from '@shopify/react-native-skia';
import Ball from './Ball';
import {useWindowDimensions} from 'react-native';
import {DEFAULT_BALL_RADIUS, TRAPEZIUM_EFFECT} from './FloatingBalls';

interface Props {
  offsetY: SkiaValue<number>;
  amplitude: SkiaValue<number>;
  yStart: number;
  numberOfBallsHorizontally: number;
}

const LineOfBalls = ({
  offsetY,
  amplitude,
  yStart,
  numberOfBallsHorizontally,
}: Props) => {
  const {width: screenWidth, height: screenHeight} = useWindowDimensions();
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
    const _balls: {x: number}[] = new Array(numberOfBallsHorizontally);

    for (let i = 0; i < numberOfBallsHorizontally; i++) {
      _balls.push({
        x:
          i * (widthToOccupy / numberOfBallsHorizontally) +
          Math.max(0, margin / 2) +
          lineMargin / 2,
      });
    }
    return _balls;
  }, [lineMargin, margin, numberOfBallsHorizontally, widthToOccupy]);

  return (
    <Group transform={[{translateX: radius}, {translateY: yStart}]}>
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
