import {
  Canvas,
  Easing,
  Group,
  runSpring,
  runTiming,
  useSharedValueEffect,
  useValue,
} from '@shopify/react-native-skia';
import React, {useState} from 'react';
import {Text, TouchableOpacity, useWindowDimensions} from 'react-native';
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
  BALL_FALL_SENSITIVITY,
} from './Config';
import Floor from './Floor';
import GameBox from './GameBox';

const LabyrinthGame = () => {
  const insets = useSafeAreaInsets();
  const {width: screenWidth, height: screenHeight} = useWindowDimensions();
  const animatedSensor = useAnimatedSensor(SensorType.ROTATION, {interval: 10}); // <- initialization
  const [fellDown, setFellDown] = useState(false);

  const approximateCanvasHeight =
    screenHeight / 2 - BALL_SIZE / 2 - insets.top - 50; // 50 is the fixed menu height

  const BALL_RADIUS = BALL_SIZE / 2;
  const ballRadius = useValue(BALL_RADIUS);
  const startX = screenWidth / 2 - BALL_SIZE / 2;
  const startY = approximateCanvasHeight;
  const ballX = useValue(startX + BALL_RADIUS);
  const ballY = useValue(startY + BALL_RADIUS);
  const shadowX = useValue(startX);
  const shadowY = useValue(startY);
  const falling = useValue(false);

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

  const reset = () => {
    ballX.current = startX;
    ballY.current = startY;
    falling.current = false;
    ballRadius.current = BALL_RADIUS;
    setFellDown(false);
  };

  const checkHoles = () => {
    if (
      !!holes.find(
        hole =>
          hole.x < ballX.current - BALL_RADIUS &&
          hole.x + HOLE_SIZE >
            ballX.current + BALL_SIZE - BALL_FALL_SENSITIVITY - BALL_RADIUS &&
          hole.y < ballY.current - BALL_RADIUS &&
          hole.y + HOLE_SIZE >
            ballY.current + BALL_SIZE - BALL_FALL_SENSITIVITY - BALL_RADIUS,
      )
    ) {
      falling.current = true;
      setFellDown(true);
      runSpring(ballRadius, ballRadius.current * 0.85, {
        mass: 2,
        velocity: 100,
        damping: 10,
        stiffness: 100,
      });
    }
  };
  const moveBall = (xDelta: number, yDelta: number) => {
    const xDeltaBall = xDelta * BALL_SPEED_FACTOR;
    const yDeltaBall = yDelta * BALL_SPEED_FACTOR;
    if (
      (xDeltaBall < 0 && ballX.current > WALL_WIDTH + BALL_RADIUS) ||
      (xDeltaBall > 0 &&
        ballX.current < screenWidth - WALL_WIDTH - BALL_SIZE + BALL_RADIUS)
    ) {
      ballX.current += xDeltaBall;
    }
    if (
      (yDeltaBall < 0 &&
        ballY.current > gameBoxStartY + WALL_WIDTH + BALL_RADIUS) ||
      (yDeltaBall > 0 &&
        ballY.current <
          gameBoxStartY + gameBoxHeight - WALL_WIDTH - BALL_SIZE + BALL_RADIUS)
    ) {
      ballY.current += yDeltaBall;
    }
  };

  const moveShadows = (xDelta: number, yDelta: number) => {
    // Set the shadow based on absolute motion
    const xAbsolute = startX + xDelta;
    const yAbsolute = startY + yDelta;
    shadowX.current = -(xAbsolute / 9 - 20);
    shadowY.current = -(yAbsolute / 9 - 34);
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

    moveBall(xDelta, yDelta);
    moveShadows(xDelta, yDelta);
    checkHoles();
  }, animatedSensor);

  return (
    <>
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
              x={ballX}
              y={ballY}
              shadowX={shadowX}
              shadowY={shadowY}
              startX={startX}
              startY={startY}
              screenWidth={screenWidth}
              ballRadius={ballRadius}
            />
          </GameBox>
        </Group>
      </Canvas>
      {fellDown && (
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: screenHeight - gameBoxStartY,
            backgroundColor: 'teal',
            paddingVertical: 20,
            paddingHorizontal: 40,
            borderRadius: 4,
            alignSelf: 'center',
          }}
          onPress={reset}>
          <Text style={{color: 'white'}}>Restart</Text>
        </TouchableOpacity>
      )}
    </>
  );
};

export default LabyrinthGame;
