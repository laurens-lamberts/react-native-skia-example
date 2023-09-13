import React from 'react';
import {useWindowDimensions} from 'react-native';
import {
  Group,
  Circle,
  Rect,
  SkiaValue,
  useValue,
  useComputedValue,
  RadialGradient,
  vec,
} from '@shopify/react-native-skia';
import {BALL_RADIUS} from './FloatingBalls';

interface Props {
  x: number;
  offsetY: SkiaValue<number>;
  index: number;
  amplitude: SkiaValue<number>;
}

const STRING_WIDTH = 4;

export default function Ball({x, offsetY, index, amplitude}: Props) {
  const {height: screenHeight} = useWindowDimensions();
  const STATIC_VERTICAL_OFFSET = screenHeight / 2 - 100;

  const y = useValue(0);

  /*   const MIN_Y = 100;
  const MAX_Y = screenHeight - insets.bottom - 200; */

  useComputedValue(() => {
    const offsetYWithIndex = offsetY.current + index * 0.1;
    y.current =
      Math.sin(offsetYWithIndex * Math.PI * 2) * amplitude.current +
      STATIC_VERTICAL_OFFSET;
  }, [offsetY, index]);

  const groupTransform = useComputedValue(() => {
    return [
      {
        translateY: y.current,
      },
    ];
  }, [y]);

  return (
    <Group>
      <Rect
        x={x - STRING_WIDTH / 2}
        y={0}
        width={STRING_WIDTH}
        height={y}
        color="black"
      />
      <Group transform={groupTransform}>
        <Circle cx={x} cy={0} r={BALL_RADIUS} color="black">
          <RadialGradient
            c={vec(x, BALL_RADIUS * 0.6)}
            r={BALL_RADIUS * 4}
            colors={['black', 'white']}
          />
        </Circle>
      </Group>
    </Group>
  );
}
