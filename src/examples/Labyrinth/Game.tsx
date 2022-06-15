import {
  Canvas,
  Group,
  useSharedValueEffect,
  useValue,
} from '@shopify/react-native-skia';
import React from 'react';
import {useWindowDimensions} from 'react-native';
import {SensorType, useAnimatedSensor} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Ball from './Ball';
import {BALL_SIZE} from './Config';
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

  useSharedValueEffect(() => {
    const yaw = animatedSensor.sensor.value.yaw;
    const pitch = animatedSensor.sensor.value.pitch;

    const newX = startX + pitch * ((screenWidth / screenHeight) * screenWidth);
    const newY = startY + yaw * ((screenWidth / screenHeight) * screenWidth);

    x.current = newX;
    y.current = newY;
    shadowX.current = -(newX / 9 - 20);
    shadowY.current = -(newY / 9 - 34);
  }, animatedSensor);

  return (
    <Canvas style={{flex: 1, backgroundColor: 'tomato'}}>
      <Group>
        <Floor startY={startY} />
        <Ball x={x} y={y} shadowX={shadowX} shadowY={shadowY} />
        <GameBox startY={startY} shadowX={shadowX} shadowY={shadowY} />
      </Group>
    </Canvas>
  );
};

export default LabyrinthGame;
