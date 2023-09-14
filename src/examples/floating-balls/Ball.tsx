import React from 'react';
import {useWindowDimensions} from 'react-native';
import {
  Group,
  Circle,
  Rect,
  SkiaValue,
  useValue,
  useComputedValue,
  vec,
  TwoPointConicalGradient,
  useTiming,
  Easing,
} from '@shopify/react-native-skia';

interface Props {
  x: number;
  offsetY: SkiaValue<number>;
  index: number;
  amplitude: SkiaValue<number>;
  radius: number;
}

const STRING_WIDTH = 1;
const LINE_EXTENSION = 400;
const HORIZONTAL_DEVIATION = 1;

export default function Ball({x, offsetY, index, amplitude, radius}: Props) {
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

  const lineHeight = useComputedValue(() => {
    return y.current + LINE_EXTENSION;
  }, [y]);

  const groupTransform = useComputedValue(() => {
    return [
      {
        translateY: y.current,
      },
    ];
  }, [y]);

  const horizontalDeviationTimer = useTiming(
    {from: 0, to: 1, loop: true, yoyo: true},
    {duration: 2000, easing: Easing.bezier(0.5, 0.01, 0.5, 1)},
  );

  const angleToRotate = useComputedValue(() => {
    const deviation = horizontalDeviationTimer.current * HORIZONTAL_DEVIATION;
    const randomness = (Math.random() - 0.5) * 0.05; // TODO: this is no proper randomness. It cannot be amplified.
    return [
      {
        rotate:
          (Math.PI / 180) * (deviation - HORIZONTAL_DEVIATION / 2 + randomness),
      },
    ];
  }, [offsetY, horizontalDeviationTimer]);

  return (
    <Group transform={angleToRotate} origin={vec(0, -100)}>
      {/* TODO: the origin is a guess, but does the trick pretty well */}
      <Rect
        x={x - STRING_WIDTH / 2}
        y={-LINE_EXTENSION}
        width={STRING_WIDTH}
        height={lineHeight}
        color="black"
      />
      <Group transform={groupTransform}>
        <Rect
          x={x - 2}
          y={-(radius * 1.3)}
          width={4}
          height={radius * 1.3}
          color="black"
        />
        <Circle cx={x} cy={0} r={radius} color="black">
          {/* <RadialGradient
            c={vec(x, radius * 0.6)}
            r={radius * 4}
            colors={['black', 'white']}
          /> */}
          <TwoPointConicalGradient
            start={vec(x, radius * 0.6)}
            startR={10}
            end={vec(x, 0)}
            endR={60}
            colors={['black', 'white']}
          />
        </Circle>
      </Group>
    </Group>
  );
}
