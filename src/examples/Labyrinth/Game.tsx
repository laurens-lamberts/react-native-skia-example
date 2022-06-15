import {
  Canvas,
  Easing,
  Group,
  runSpring,
  runTiming,
  useSharedValueEffect,
  useValue,
} from '@shopify/react-native-skia';
import React from 'react';
import {useWindowDimensions} from 'react-native';
import {
  SensorType,
  useAnimatedSensor,
  withTiming,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Ball from './Ball';
import {
  BALL_SPEED_FACTOR,
  BALL_SIZE,
  WALL_WIDTH,
  HOLE_SIZE,
  FALL_SENSITIVITY,
} from './Config';
import Floor from './Floor';
import GameBox from './GameBox';

const LabyrinthGame = () => {
  const insets = useSafeAreaInsets();
  const {width: screenWidth, height: screenHeight} = useWindowDimensions();
  const animatedSensor = useAnimatedSensor(SensorType.ROTATION, {interval: 10}); // <- initialization

  const approximateCanvasHeight =
    screenHeight / 2 - BALL_SIZE / 2 - insets.top - 50; // 50 is the fixed menu height

  const startX = screenWidth / 2 - BALL_SIZE / 2;
  const startY = approximateCanvasHeight;
  const x = useValue(startX);
  const y = useValue(startY);
  const shadowX = useValue(startX);
  const shadowY = useValue(startY);
  const falling = useValue(false);
  const ballSize = useValue(BALL_SIZE);

  const gameBoxStartY = startY / 2 - BALL_SIZE / 2 + WALL_WIDTH / 2;
  const gameBoxWidth = screenWidth - WALL_WIDTH;
  const gameBoxHeight = screenWidth - WALL_WIDTH;

  const holes = [
    {x: WALL_WIDTH + 20, y: gameBoxStartY + WALL_WIDTH + 10},
    {
      x: gameBoxWidth - WALL_WIDTH - 40,
      y: gameBoxStartY + WALL_WIDTH + 10,
    },
  ];

  const checkHoles = () => {
    if (
      !!holes.find(
        h =>
          h.x < x.current &&
          h.x + HOLE_SIZE > x.current + BALL_SIZE - FALL_SENSITIVITY &&
          h.y < y.current &&
          h.y + HOLE_SIZE > y.current + BALL_SIZE - FALL_SENSITIVITY,
      )
    ) {
      falling.current = true;
      runTiming(ballSize, BALL_SIZE * 0.85, {
        duration: 300,
        easing: Easing.ease,
      });
      //ballSize.current = withTiming()
    }
  };

  // GAME LOOP (based on motion)
  useSharedValueEffect(() => {
    if (falling.current) return;
    const yaw = animatedSensor.sensor.value.yaw;
    const pitch = animatedSensor.sensor.value.pitch;

    // Move the ball based on motion over time
    // TODO: give the ball a mass (acceleration)
    const xDelta = pitch * ((screenWidth / screenHeight) * screenWidth);
    const yDelta = yaw * ((screenWidth / screenHeight) * screenWidth);

    const xDeltaBall = xDelta * BALL_SPEED_FACTOR;
    const yDeltaBall = yDelta * BALL_SPEED_FACTOR;

    if (
      (xDeltaBall < 0 && x.current > WALL_WIDTH) ||
      (xDeltaBall > 0 && x.current < screenWidth - WALL_WIDTH - BALL_SIZE)
    ) {
      x.current += xDeltaBall;
    }
    if (
      (yDeltaBall < 0 && y.current > gameBoxStartY + WALL_WIDTH) ||
      (yDeltaBall > 0 &&
        y.current < gameBoxStartY + gameBoxHeight - WALL_WIDTH - BALL_SIZE)
    ) {
      y.current += yDeltaBall;
    }

    // Set the shadow based on absolute motion
    const xAbsolute = startX + xDelta;
    const yAbsolute = startY + yDelta;
    shadowX.current = -(xAbsolute / 9 - 20);
    shadowY.current = -(yAbsolute / 9 - 34);

    checkHoles();
  }, animatedSensor);

  return (
    <Canvas style={{flex: 1, backgroundColor: 'tomato'}}>
      <Group>
        <Floor startY={startY} />
        <GameBox
          y={gameBoxStartY}
          shadowX={shadowX}
          shadowY={shadowY}
          width={gameBoxWidth}
          height={gameBoxHeight}
          holes={holes}>
          <Ball
            x={x}
            y={y}
            shadowX={shadowX}
            shadowY={shadowY}
            startX={startX}
            startY={startY}
            screenWidth={screenWidth}
            ballSize={ballSize}
          />
        </GameBox>
      </Group>
    </Canvas>
  );
};

export default LabyrinthGame;
