import {
  Group,
  Points,
  Rect,
  Text,
  useFont,
  vec,
} from "@shopify/react-native-skia";
import React, { useCallback } from "react";
import { useWindowDimensions } from "react-native";
import {
  BIRD_WIDTH,
  BIRD_HEIGHT,
  OBSTACLE_SPEED,
  OBSTACLE_WIDTH,
  OBSTACLE_FREQ,
  BIRD_X,
  SHOW_DEBUG,
  FLOOR_HEIGHT,
} from "./Config";
import {
  SharedValue,
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";

interface Props {
  canvasWidth: number;
  canvasHeight: number;
  birdY: SharedValue<number>;
  clock: SharedValue<number>;
  points: SharedValue<number>;
  initialX: number;
  gameOver: () => void;
  size: SharedValue<{ width: number; height: number }>;
  minimumGapSize: number;
}
const Obstacle = ({
  birdY,
  clock,
  initialX = 0,
  gameOver,
  points,
  minimumGapSize,
  size,
}: Props) => {
  const { height, width } = useWindowDimensions();
  const canvasWidth = size.value.width || width;
  const canvasHeight = size.value.height
    ? size.value.height - FLOOR_HEIGHT
    : height - FLOOR_HEIGHT - 120; // TODO: temp incorrect patch (does not take safearea into account)

  if (!initialX) initialX = canvasWidth;

  // This could be a boolean, but i'm unsure how to make that work with Skia.
  const pointCounted = useSharedValue(0);

  const firstResetClock = useSharedValue(0);

  const GAP_Y_TOP = useSharedValue(canvasHeight * 0.5);
  const GAP_Y_BOTTOM = useSharedValue(canvasHeight * 0.8);
  const GAP_BOTTOM_HEIGHT = canvasHeight - GAP_Y_BOTTOM.value;

  const generateNewGap = useCallback(() => {
    "worklet";
    GAP_Y_BOTTOM.value = Math.random() * canvasHeight;
    GAP_Y_TOP.value = GAP_Y_BOTTOM.value - (Math.random() * 100 - 100); //Math.random() * (canvasHeight - GAP_Y_TOP.value);
    const gapSize = GAP_Y_BOTTOM.value - GAP_Y_TOP.value;
    if (gapSize < minimumGapSize) {
      // increase the gap so that it meets the minimum size
      const difference = minimumGapSize - gapSize;
      GAP_Y_TOP.value -= difference / 2;
      GAP_Y_BOTTOM.value += difference / 2;
    }
  }, [GAP_Y_BOTTOM, GAP_Y_TOP, canvasHeight, minimumGapSize]);

  const x = useDerivedValue(() => {
    let newX = 0;
    const progress = clock.value % (OBSTACLE_FREQ * 2000);

    /* if (firstResetClock.value === 0) {
      newX = initialX - progress * OBSTACLE_SPEED * 0.1;
    } else {
      const resetOffset = firstResetClock.value % (OBSTACLE_FREQ * 2000);
      newX =
        canvasWidth -
        initialX -
        (progress - resetOffset) * OBSTACLE_SPEED * 0.1;
    } */

    // dummy for testing
    newX = canvasWidth - progress * OBSTACLE_SPEED * 0.1;

    if (newX < 0 - OBSTACLE_WIDTH) {
      // Reset the obstacle to a position out of screen
      if (firstResetClock.value === 0) firstResetClock.value = clock.value;
      newX = canvasWidth;

      generateNewGap();

      // Reset that a point has been counted for the next gap
      pointCounted.value = 0;
    }
    return newX;
  }, [canvasWidth, clock, firstResetClock, generateNewGap, pointCounted]);

  // Collision detection
  // Note that this clock differs from the main clock.

  useAnimatedReaction(
    () => clock.value,
    () => {
      if (pointCounted.value === 1) {
        // Nothing to check, because the obstacle is already passed.
        return;
      }

      // if the bird is at x-coordinates of the obstacle
      if (BIRD_X > x.value - BIRD_WIDTH && BIRD_X < x.value + BIRD_WIDTH) {
        if (
          birdY.value <= GAP_Y_TOP.value ||
          birdY.value + BIRD_HEIGHT >= GAP_Y_BOTTOM.value
        ) {
          gameOver();
        } else if (BIRD_X > x.value + BIRD_WIDTH / 2) {
          // Obstacle is passed. Count the point.
          // We count the point when the center of the bird passed the right side of the obstacle.
          points.value += 1;
          pointCounted.value = 1;
        }
      }
    }
  );

  const bottomObstacleStroke = [
    vec(x.value, canvasHeight),
    vec(x.value, GAP_Y_BOTTOM.value),
    vec(x.value + OBSTACLE_WIDTH, GAP_Y_BOTTOM.value),
    vec(x.value + OBSTACLE_WIDTH, canvasHeight),
  ];

  const font = useFont(
    require("@app/assets/fonts/SFPRODISPLAYREGULAR.otf"),
    16
  );

  return (
    <Group>
      <Group>
        <Rect
          x={x}
          y={0}
          width={OBSTACLE_WIDTH}
          height={GAP_Y_TOP.value}
          color="rgba(102,182,50,1)"
        />
        <Rect
          x={x}
          y={0}
          width={OBSTACLE_WIDTH}
          height={GAP_Y_TOP.value}
          color="#666"
          strokeWidth={3}
          style="stroke"
          strokeJoin="bevel"
        />
      </Group>
      <Group>
        <Rect
          x={x}
          y={GAP_Y_BOTTOM.value}
          width={OBSTACLE_WIDTH}
          height={GAP_BOTTOM_HEIGHT}
          color="rgba(102,182,50,1)"
        />
        <Points
          points={bottomObstacleStroke}
          mode="polygon"
          color="#666"
          style="stroke"
          strokeWidth={3}
        />
      </Group>
      {SHOW_DEBUG && (
        <>
          <Text
            x={10}
            y={160}
            text={"obstacle: " + Math.round(x.value).toString() + " x"}
            font={font}
          />
        </>
      )}
    </Group>
  );
};

export default Obstacle;
