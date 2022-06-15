import {Group, Rect, Shadow, SkiaValue} from '@shopify/react-native-skia';
import React, {PropsWithChildren} from 'react';
import {WALL_WIDTH} from './Config';

interface GameBoxInterface {
  y: number;
  height: number;
  width: number;
  shadowX: SkiaValue<number>;
  shadowY: SkiaValue<number>;
}

const GameBox = ({
  y,
  height,
  width,
  shadowX,
  shadowY,
  children,
}: PropsWithChildren<GameBoxInterface>) => {
  return (
    <Group>
      <Rect
        x={WALL_WIDTH / 2}
        y={y}
        width={width}
        height={height}
        style="stroke"
        strokeWidth={WALL_WIDTH}
        color="rgba(203,153,96,1)">
        <Shadow
          dx={shadowX}
          dy={shadowY}
          blur={0.2}
          color={'rgba(106,81,64,1)'}
          shadowOnly
        />
      </Rect>
      {children}
      <Rect
        x={WALL_WIDTH / 2}
        y={y}
        width={width}
        height={height}
        style="stroke"
        strokeWidth={WALL_WIDTH}
        color="rgba(203,153,96,1)"></Rect>
    </Group>
  );
};

export default GameBox;
