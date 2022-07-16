import {Rect} from '@shopify/react-native-skia';
import React from 'react';
import {BALL_SIZE, WALL_WIDTH} from './Config';

interface FloorInterface {
  startY: number;
  startX: number;
  gameBoxWidth: number;
  gameBoxHeight: number;
}

const Floor = ({
  startY,
  startX,
  gameBoxWidth,
  gameBoxHeight,
}: FloorInterface) => {
  return (
    <Rect
      x={startX}
      y={startY / 2 - BALL_SIZE / 2 + WALL_WIDTH / 2}
      width={gameBoxWidth}
      height={gameBoxHeight}
      style="fill"
      color="rgba(200,177,134,1)"
    />
  );
};

export default Floor;
