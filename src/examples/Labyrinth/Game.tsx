import {
  Canvas,
  Rect,
  RoundedRect,
  Shadow,
  Text,
  useSharedValueEffect,
  useValue,
} from '@shopify/react-native-skia';
import React from 'react';
import {useWindowDimensions} from 'react-native';
import {
  SensorType,
  useAnimatedSensor,
  useAnimatedReaction,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const BALL_SIZE = 40;
const WALL_WIDTH = 20;

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

  useSharedValueEffect(() => {
    const yaw = animatedSensor.sensor.value.yaw;
    const pitch = animatedSensor.sensor.value.pitch;

    console.log('yaw', yaw, 'pitch', pitch);

    const newX = startX + pitch * ((screenWidth / screenHeight) * screenWidth);
    const newY = startY + yaw * ((screenWidth / screenHeight) * screenWidth);

    x.current = newX;
    y.current = newY;
    shadowX.current = -(newX / 9 - 20);
    shadowY.current = -(newY / 9 - 34);
  }, animatedSensor);

  /*   useSharedValueEffect(() => {
    x.current = mix(progress.value, 0, 100);
  }, progress); // you can pass other shared values as extra parameters */

  return (
    <Canvas style={{flex: 1, backgroundColor: 'tomato'}}>
      {/* <Rect
        x={WALL_WIDTH / 2}
        y={startY / 2 - BALL_SIZE / 2 + WALL_WIDTH / 2}
        width={screenWidth - WALL_WIDTH}
        height={screenWidth - WALL_WIDTH}
        color="rgba(106,81,64,1)"
      /> */}
      <RoundedRect
        x={x}
        y={y}
        width={BALL_SIZE}
        height={BALL_SIZE}
        r={BALL_SIZE / 2}
        color="#222"
      />
      <Rect
        x={WALL_WIDTH / 2}
        y={startY / 2 - BALL_SIZE / 2 + WALL_WIDTH / 2}
        width={screenWidth - WALL_WIDTH}
        height={screenWidth - WALL_WIDTH}
        style="stroke"
        strokeWidth={WALL_WIDTH}
        color="rgba(225,193,152,1)">
        <Shadow
          dx={shadowX}
          dy={shadowY}
          blur={1}
          color={'rgba(106,81,64,1)'}
        />
      </Rect>
    </Canvas>
  );
};

export default LabyrinthGame;
