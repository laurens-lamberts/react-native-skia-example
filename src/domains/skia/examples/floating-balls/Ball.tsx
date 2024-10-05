import React from "react";
import { useWindowDimensions } from "react-native";
import {
  Group,
  Circle,
  Rect,
  vec,
  TwoPointConicalGradient,
} from "@shopify/react-native-skia";
import {
  Easing,
  SharedValue,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { useLoop } from "@app/hooks/animations";
import { DEFAULT_BALL_RADIUS } from "./config";

interface Props {
  x: number;
  offsetY: SharedValue<number>;
  index: number;
  amplitude: SharedValue<number>;
  radius: number;
  viewingAngleVertical: SharedValue<number>;
}

const DEFAULT_STRING_WIDTH = 1.2;
const LINE_EXTENSION = 400;
const HORIZONTAL_DEVIATION = 1;

export default function Ball({
  x,
  offsetY,
  index,
  amplitude,
  radius,
  viewingAngleVertical,
}: Props) {
  const { height: screenHeight } = useWindowDimensions();
  const STATIC_VERTICAL_OFFSET = screenHeight / 2 - 100;

  const factor = radius / DEFAULT_BALL_RADIUS;
  const stringWidth = DEFAULT_STRING_WIDTH * factor;

  const y = useSharedValue(0);

  /*   const MIN_Y = 100;
  const MAX_Y = screenHeight - insets.bottom - 200; */

  useDerivedValue(() => {
    const offsetYWithIndex = offsetY.value + index * 0.1;
    y.value =
      Math.sin(offsetYWithIndex * Math.PI * 2) * amplitude.value +
      STATIC_VERTICAL_OFFSET;
  }, [offsetY, index]);

  const lineHeight = useDerivedValue(() => {
    return y.value + LINE_EXTENSION;
  }, [y]);

  const ballTransform = useDerivedValue(() => {
    return [
      {
        translateY: y.value,
      },
    ];
  }, [y]);

  const horizontalDeviationTimer = useLoop({
    from: 0,
    to: 1,
    duration: 2000,
    easing: Easing.bezier(0.5, 0.01, 0.5, 1),
    reverse: true,
  });

  const ballStringTransform = useDerivedValue(() => {
    const deviation = horizontalDeviationTimer.value * HORIZONTAL_DEVIATION;
    const randomness = (Math.random() - 0.5) * 0.05; // TODO: this is no proper randomness. It cannot be amplified.
    return [
      {
        rotate:
          (Math.PI / 180) * (deviation - HORIZONTAL_DEVIATION / 2 + randomness),
      },
    ];
  }, [offsetY, horizontalDeviationTimer]);

  return (
    <Group transform={ballStringTransform} origin={vec(0, -100)}>
      {/* TODO: the origin is a guess, but does the trick pretty well */}
      <Rect
        x={x - stringWidth / 2}
        y={-LINE_EXTENSION}
        width={stringWidth}
        height={lineHeight}
        color="black"
      />
      <Group transform={ballTransform}>
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
            colors={["black", "white"]}
          />
        </Circle>
      </Group>
    </Group>
  );
}
