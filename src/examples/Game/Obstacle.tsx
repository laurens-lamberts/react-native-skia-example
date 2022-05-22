import {
  Group,
  Rect,
  SkiaClockValue,
  SkiaReadonlyValue,
  SkiaValue,
  Text,
  useCanvas,
  useClockValue,
  useDerivedValue,
  useValue,
  useValueEffect,
} from '@shopify/react-native-skia';
import React, {useState} from 'react';
import {useWindowDimensions} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  BIRD_SIZE,
  OBSTACLE_SPEED,
  OBSTACLE_WIDTH,
  OBSTACLE_FREQ,
  BIRD_X,
  SHOW_DEBUG,
} from './Config';

interface Props {
  canvasWidth: number;
  canvasHeight: number;
  birdY: SkiaReadonlyValue<number>;
  clock: SkiaClockValue;
  points: SkiaValue<number>;
  initialX: number;
  gameOver: () => void;
  minimumGapSize: number;
}
const Obstacle = ({
  birdY,
  clock,
  initialX = 0,
  gameOver,
  points,
  minimumGapSize,
}: Props) => {
  const {height, width} = useWindowDimensions();
  const {size} = useCanvas();
  const canvasWidth = width; //TODO should be: size.current.width, but useCanvas is not consistent
  const canvasHeight = height; //TODO should be: size.current.height, but useCanvas is not consistent

  if (!initialX) initialX = canvasWidth;

  // This could be a boolean, but i'm unsure how to make that work with Skia.
  const pointCounted = useValue(0);

  const firstResetClock = useValue(0);

  const GAP_Y_TOP = useValue(canvasHeight * 0.5);
  const GAP_Y_BOTTOM = useValue(canvasHeight * 0.8);
  const GAP_BOTTOM_HEIGHT = canvasHeight - GAP_Y_BOTTOM.current;

  const x = useDerivedValue(() => {
    let newX = 0;
    const progress = clock.current % (OBSTACLE_FREQ * 2000);

    if (firstResetClock.current === 0) {
      newX = initialX - progress * OBSTACLE_SPEED * 0.1;
    } else {
      const resetOffset = firstResetClock.current % (OBSTACLE_FREQ * 2000);
      newX =
        canvasWidth -
        initialX -
        (progress - resetOffset) * OBSTACLE_SPEED * 0.1;
    }

    // dummy for testing
    newX = canvasWidth - progress * OBSTACLE_SPEED * 0.1;

    if (newX < 0 - OBSTACLE_WIDTH) {
      // Reset the obstacle to a position out of screen
      if (firstResetClock.current === 0)
        firstResetClock.current = clock.current;
      newX = canvasWidth;

      // Set a new gap
      GAP_Y_TOP.current = Math.random() * canvasHeight;
      GAP_Y_BOTTOM.current = Math.random() * (canvasHeight - GAP_Y_TOP.current);
      const gapSize = GAP_Y_BOTTOM.current - GAP_Y_TOP.current;
      if (gapSize < minimumGapSize) {
        // increase the gap so that it meets the minimum size
        const difference = minimumGapSize - gapSize;
        GAP_Y_TOP.current -= difference / 2;
        GAP_Y_BOTTOM.current += difference / 2;
      }
      // Reset that a point has been counted for the next gap
      pointCounted.current = 0;
    }
    return newX;
  }, [clock]);

  // Collision detection
  // Note that this clock differs from the main clock.
  useValueEffect(clock, () => {
    if (pointCounted.current === 1) {
      // Nothing to check, because the obstacle is already passed.
      return;
    }

    // if the bird is at x-coordinates of the obstacle
    if (BIRD_X > x.current - BIRD_SIZE && BIRD_X < x.current + BIRD_SIZE) {
      if (
        birdY.current <= GAP_Y_TOP.current ||
        birdY.current + BIRD_SIZE >= GAP_Y_BOTTOM.current
      ) {
        gameOver();
      } else if (BIRD_X > x.current + BIRD_SIZE / 2) {
        // Obstacle is passed. Count the point.
        // We count the point when the center of the bird passed the right side of the obstacle.
        points.current += 1;
        pointCounted.current = 1;
      }
    }
  });

  return (
    <Group>
      <Rect
        x={x}
        y={0}
        width={OBSTACLE_WIDTH}
        height={GAP_Y_TOP.current}
        color="black"
      />
      <Rect
        x={x}
        y={GAP_Y_BOTTOM.current}
        width={OBSTACLE_WIDTH}
        height={GAP_BOTTOM_HEIGHT}
        color="black"
      />
      {SHOW_DEBUG && (
        <>
          <Text
            x={10}
            y={146}
            text={'obstacle: ' + Math.round(x.current).toString() + ' x'}
            familyName="serif"
            size={16}
          />
          <Text
            x={10}
            y={186}
            text={
              'firstResetClock: ' + firstResetClock.current.toString() + ' ms'
            }
            familyName="serif"
            size={16}
          />
        </>
      )}
    </Group>
  );
};

export default Obstacle;
