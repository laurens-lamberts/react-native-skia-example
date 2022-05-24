import React, {useEffect, useState} from 'react';
import {StyleSheet, Dimensions, View} from 'react-native';
import {
  AnimationState,
  Group,
  Rect,
  SkiaClockValue,
  SkiaReadonlyValue,
  SkiaValue,
  Text,
  useCanvas,
  useCanvasRef,
  useClockValue,
  useDerivedValue,
  useValueEffect,
} from '@shopify/react-native-skia';
import {
  ValueApi,
  Canvas,
  Circle,
  Fill,
  useTouchHandler,
  useValue,
} from '@shopify/react-native-skia';
import {
  EdgeInsets,
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {
  BIRD_WIDTH,
  BIRD_HEIGHT,
  FALLING_SPEED,
  FALL_ACCELERATE_FACTOR,
  OBSTACLE_MINIMUM_GAP_SIZE,
  SHOW_DEBUG,
  VELOCITY_DECREASE,
  VELOCITY_INCREASE,
  VELOCITY_MAX,
  FLOOR_HEIGHT,
  GRASS_HEIGHT,
} from './Config';
import Bird from './Bird';
import Obstacle from './Obstacle';

/* const {height} = Dimensions.get('window');

const bottomBoundary = height - BIRD_HEIGHT - 20;

interface PhysicsAnimationState extends AnimationState {}

const runBouncing = (translate: SkiaValue<number>) => {
  translate.animation = ValueApi.createAnimation<PhysicsAnimationState>(
    (now, state) => {
      if (state === undefined) {
        return {
          current: translate.current,
          finished: false,
        };
      }
      const newState = {
        current: state.current,
        finished: false,
      };
      return newState;
    },
  );
}; */

interface CanvasContentProps {
  translateY: SkiaValue<number>;
  clock: SkiaClockValue;
  gameOver: () => void;
  points: SkiaValue<number>;
}
const CanvasContent = ({
  translateY,
  clock,
  gameOver,
  points,
}: CanvasContentProps) => {
  const {size} = useCanvas();

  const birdY = useValue(0);
  const bottom = useDerivedValue(
    () => size.current.height - BIRD_HEIGHT - FLOOR_HEIGHT ?? 0,
    [size],
  );

  useDerivedValue(() => {
    birdY.current = bottom.current - translateY.current;
  }, [bottom, translateY]);

  return (
    <Group>
      <Fill color="rgba(67,183,192,1)" />
      <Bird birdY={birdY} clock={clock} />
      <Obstacle
        canvasWidth={size.current.width}
        canvasHeight={size.current.height}
        birdY={birdY}
        clock={clock}
        gameOver={gameOver}
        initialX={300}
        points={points}
        minimumGapSize={OBSTACLE_MINIMUM_GAP_SIZE} // TODO: decrease over time
      />
      <Rect
        x={0}
        y={size.current.height - FLOOR_HEIGHT}
        width={size.current.width}
        height={FLOOR_HEIGHT}
        color="rgba(219,211,143,1)"
      />
      <Rect
        x={0}
        y={size.current.height - FLOOR_HEIGHT + 3}
        width={size.current.width}
        height={GRASS_HEIGHT}
        color="rgba(102,182,50,1)"
      />
      <Rect
        x={0}
        y={size.current.height - FLOOR_HEIGHT}
        width={size.current.width}
        height={3}
        color="#666"
      />
      {/* <Obstacle
        canvasWidth={size.current.width}
        canvasHeight={size.current.height}
        birdY={birdY}
        clock={clock}
        gameOver={gameOver}
        initialX={600}
        points={points}
        minimumGapSize={OBSTACLE_MINIMUM_GAP_SIZE} // TODO: decrease over time
      /> */}
      <Text
        x={size.current.width / 2 - 8} // TODO: actual center
        y={120}
        text={points.current.toString()}
        familyName="serif"
        size={40}
        color="white"
      />
    </Group>
  );
};

const Flappy = () => {
  const insets = useSafeAreaInsets();
  // This unused state variable ensures Skia values can be drawn on screen
  const [clockState, setClockState] = useState(-1);
  const resetOnNextTap = useValue(0);

  const translateY = useValue(0);
  const velocityY = useValue(0);
  const fallingStart = useValue(0);
  const taps = useValue(0);
  const points = useValue(0);

  const clock = useClockValue();

  const reset = () => {
    resetOnNextTap.current = 0;
    points.current = 0;
    //taps.current = 0;
    //ref.current?.render();
    clock.start();
  };
  const gameOver = () => {
    clock.stop();
    resetOnNextTap.current = 1;
  };

  // GAME LOOP
  useValueEffect(clock, () => {
    setClockState(clock.current);

    if (translateY.current <= 0 && velocityY.current === 0) {
      // Flappy is at the bottom
      fallingStart.current = 0;
      return;
    }

    let acceleratedFallingSpeed = FALLING_SPEED;
    if (fallingStart.current > 0) {
      acceleratedFallingSpeed *=
        (fallingStart.current / translateY.current) * FALL_ACCELERATE_FACTOR +
        1;
    }

    translateY.current =
      translateY.current - acceleratedFallingSpeed + velocityY.current;

    if (velocityY.current > 0) {
      velocityY.current -= VELOCITY_DECREASE;
    } else if (fallingStart.current === 0) {
      fallingStart.current = translateY.current;
    }
    if (translateY.current < 0) translateY.current = 0;
  });

  const touchHandler = useTouchHandler({
    onStart: ({}) => {
      if (resetOnNextTap.current === 1) {
        reset();
      }

      taps.current++;
      velocityY.current += VELOCITY_INCREASE;
      if (velocityY.current > VELOCITY_MAX) velocityY.current = VELOCITY_MAX;
      fallingStart.current = 0;
    },
  });

  return (
    <SafeAreaView style={{flex: 1}} edges={['bottom']}>
      <Canvas
        style={{
          flex: 1,
          backgroundColor: 'white',
        }}
        debug={SHOW_DEBUG}
        onTouch={touchHandler}>
        <CanvasContent
          translateY={translateY}
          clock={clock}
          gameOver={gameOver}
          points={points}
        />
        {SHOW_DEBUG && (
          <>
            <Text
              x={10}
              y={insets.top}
              text={'taps: ' + taps.current.toString()}
              familyName="serif"
              size={16}
            />
            <Text
              x={10}
              y={insets.top + 20}
              text={'clock: ' + Math.round(clock.current).toString() + ' ms'}
              familyName="serif"
              size={16}
            />
            <Text
              x={10}
              y={insets.top + 40}
              text={
                'translate: ' + Math.round(translateY.current).toString() + ' y'
              }
              familyName="serif"
              size={16}
            />
            <Text
              x={10}
              y={insets.top + 60}
              text={
                'velocity: ' + Math.round(velocityY.current).toString() + ' y'
              }
              familyName="serif"
              size={16}
            />
            <Text
              x={10}
              y={insets.top + 80}
              text={
                'falling: ' + Math.round(fallingStart.current).toString() + ' y'
              }
              familyName="serif"
              size={16}
            />
          </>
        )}
      </Canvas>
    </SafeAreaView>
  );
};

export default Flappy;
