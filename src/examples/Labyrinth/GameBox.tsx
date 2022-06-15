import {Rect, Shadow, SkiaValue} from '@shopify/react-native-skia';
import React from 'react';
import {useWindowDimensions} from 'react-native';
import {BALL_SIZE, WALL_WIDTH} from './Config';

interface GameBoxInterface {
  startY: number;
  shadowX: SkiaValue<number>;
  shadowY: SkiaValue<number>;
}

const GameBox = ({startY, shadowX, shadowY}: GameBoxInterface) => {
  const {width: screenWidth, height: screenHeight} = useWindowDimensions();
  return (
    <Rect
      x={WALL_WIDTH / 2}
      y={startY / 2 - BALL_SIZE / 2 + WALL_WIDTH / 2}
      width={screenWidth - WALL_WIDTH}
      height={screenWidth - WALL_WIDTH}
      style="stroke"
      strokeWidth={WALL_WIDTH}
      color="rgba(203,153,96,1)">
      <Shadow
        dx={shadowX}
        dy={shadowY}
        blur={0.2}
        color={'rgba(106,81,64,1)'}
        //inner
      />
    </Rect>
  );
};

export default GameBox;
