import {
  Group,
  Points,
  Rect,
  SkiaClockValue,
  SkiaMutableValue,
  SkiaValue,
  Text,
  useComputedValue,
  useValue,
  useValueEffect,
  vec,
} from '@shopify/react-native-skia';
import React, {useCallback} from 'react';
import {useWindowDimensions} from 'react-native';
import {
  BIRD_WIDTH,
  BIRD_HEIGHT,
  OBSTACLE_SPEED,
  OBSTACLE_WIDTH,
  OBSTACLE_FREQ,
  BIRD_X,
  SHOW_DEBUG,
  FLOOR_HEIGHT,
} from './Config';

interface Props {
  canvasWidth: number;
  canvasHeight: number;
  birdY: SkiaValue<number>;
  clock: SkiaClockValue;
  points: SkiaMutableValue<number>;
  initialX: number;
  gameOver: () => void;
  size: SkiaMutableValue<{width: number; height: number}>;
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
  const {height, width} = useWindowDimensions();
  const canvasWidth = size.current.width || width;
  const canvasHeight = size.current.height
    ? size.current.height - FLOOR_HEIGHT
    : height - FLOOR_HEIGHT - 120; // TODO: temp incorrect patch (does not take safearea into account)

  if (!initialX) initialX = canvasWidth;

  // This could be a boolean, but i'm unsure how to make that work with Skia.
  const pointCounted = useValue(0);

  const firstResetClock = useValue(0);

  const GAP_Y_TOP = useValue(canvasHeight * 0.5);
  const GAP_Y_BOTTOM = useValue(canvasHeight * 0.8);
  const GAP_BOTTOM_HEIGHT = canvasHeight - GAP_Y_BOTTOM.current;

  const generateNewGap = useCallback(() => {
    GAP_Y_BOTTOM.current = Math.random() * canvasHeight;
    GAP_Y_TOP.current = GAP_Y_BOTTOM.current - (Math.random() * 100 - 100); //Math.random() * (canvasHeight - GAP_Y_TOP.current);
    const gapSize = GAP_Y_BOTTOM.current - GAP_Y_TOP.current;
    if (gapSize < minimumGapSize) {
      // increase the gap so that it meets the minimum size
      const difference = minimumGapSize - gapSize;
      GAP_Y_TOP.current -= difference / 2;
      GAP_Y_BOTTOM.current += difference / 2;
    }
  }, [GAP_Y_BOTTOM, GAP_Y_TOP, canvasHeight, minimumGapSize]);

  const x = useComputedValue(() => {
    let newX = 0;
    const progress = clock.current % (OBSTACLE_FREQ * 2000);

    /* if (firstResetClock.current === 0) {
      newX = initialX - progress * OBSTACLE_SPEED * 0.1;
    } else {
      const resetOffset = firstResetClock.current % (OBSTACLE_FREQ * 2000);
      newX =
        canvasWidth -
        initialX -
        (progress - resetOffset) * OBSTACLE_SPEED * 0.1;
    } */

    // dummy for testing
    newX = canvasWidth - progress * OBSTACLE_SPEED * 0.1;

    if (newX < 0 - OBSTACLE_WIDTH) {
      // Reset the obstacle to a position out of screen
      if (firstResetClock.current === 0)
        firstResetClock.current = clock.current;
      newX = canvasWidth;

      generateNewGap();

      // Reset that a point has been counted for the next gap
      pointCounted.current = 0;
    }
    return newX;
  }, [canvasWidth, clock, firstResetClock, generateNewGap, pointCounted]);

  // Collision detection
  // Note that this clock differs from the main clock.
  useValueEffect(clock, () => {
    if (pointCounted.current === 1) {
      // Nothing to check, because the obstacle is already passed.
      return;
    }

    // if the bird is at x-coordinates of the obstacle
    if (BIRD_X > x.current - BIRD_WIDTH && BIRD_X < x.current + BIRD_WIDTH) {
      if (
        birdY.current <= GAP_Y_TOP.current ||
        birdY.current + BIRD_HEIGHT >= GAP_Y_BOTTOM.current
      ) {
        gameOver();
      } else if (BIRD_X > x.current + BIRD_WIDTH / 2) {
        // Obstacle is passed. Count the point.
        // We count the point when the center of the bird passed the right side of the obstacle.
        points.current += 1;
        pointCounted.current = 1;
      }
    }
  });

  const bottomObstacleStroke = [
    vec(x.current, canvasHeight),
    vec(x.current, GAP_Y_BOTTOM.current),
    vec(x.current + OBSTACLE_WIDTH, GAP_Y_BOTTOM.current),
    vec(x.current + OBSTACLE_WIDTH, canvasHeight),
  ];

  return (
    <Group>
      <Group>
        <Rect
          x={x}
          y={0}
          width={OBSTACLE_WIDTH}
          height={GAP_Y_TOP.current}
          color="rgba(102,182,50,1)"
        />
        <Rect
          x={x}
          y={0}
          width={OBSTACLE_WIDTH}
          height={GAP_Y_TOP.current}
          color="#666"
          strokeWidth={3}
          style="stroke"
          strokeJoin="bevel"
        />
      </Group>
      <Group>
        <Rect
          x={x}
          y={GAP_Y_BOTTOM.current}
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
            y={146}
            text={'obstacle: ' + Math.round(x.current).toString() + ' x'}
            familyName="serif"
            size={16}
          />
        </>
      )}
    </Group>
  );
};

export default Obstacle;
