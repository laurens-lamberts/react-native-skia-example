import {Rect} from '@shopify/react-native-skia';
import React from 'react';
import {useWindowDimensions} from 'react-native';
import {BALL_SIZE, WALL_WIDTH} from './Config';

interface FloorInterface {
  startY: number;
}

const Floor = ({startY}: FloorInterface) => {
  const {width: screenWidth, height: screenHeight} = useWindowDimensions();
  return (
    <Rect
      x={WALL_WIDTH / 2}
      y={startY / 2 - BALL_SIZE / 2 + WALL_WIDTH / 2}
      width={screenWidth - WALL_WIDTH}
      height={screenWidth - WALL_WIDTH}
      style="fill"
      color="rgba(200,177,134,1)"
    />
  );
};

export default Floor;
