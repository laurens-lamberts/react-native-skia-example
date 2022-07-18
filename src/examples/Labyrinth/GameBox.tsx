import {
  Group,
  Rect,
  Shadow,
  SkiaValue,
  Vertices,
} from '@shopify/react-native-skia';
import React, {PropsWithChildren} from 'react';
import {WALL_WIDTH} from './Config';
import Hole from './Hole';
import {useObstacle} from './hooks/useObstacle';

interface GameBoxInterface {
  x: number;
  y: number;
  height: number;
  width: number;
  shadowX: SkiaValue<number>;
  shadowY: SkiaValue<number>;
  holes?: {x: number; y: number}[];
}

const GameBox = ({
  x,
  y,
  height,
  width,
  shadowX,
  shadowY,
  children,
  holes,
}: PropsWithChildren<GameBoxInterface>) => {
  const {obstacle: obstacleOne} = useObstacle({
    id: 0,
    gameBoxHeight: height,
    gameBoxWidth: width,
    gameBoxX: x,
    gameBoxY: y,
  });
  const {obstacle: obstacleTwo} = useObstacle({
    id: 1,
    gameBoxHeight: height,
    gameBoxWidth: width,
    gameBoxX: x,
    gameBoxY: y,
  });

  return (
    <Group>
      {/* // TODO: set relative position for hole */}
      {holes?.map(h => (
        <Hole
          key={'x' + h.x.toString() + ',y' + h.y.toString()}
          x={h.x}
          y={h.y}
          shadowX={shadowX}
          shadowY={shadowY}
        />
      ))}
      <Rect
        x={x}
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
      <Vertices
        vertices={obstacleOne}
        color="rgba(203,153,96,1)"
        mode="triangleFan">
        <Shadow
          dx={shadowX}
          dy={shadowY}
          blur={0.2}
          color={'rgba(106,81,64,1)'}
        />
      </Vertices>
      <Vertices
        vertices={obstacleTwo}
        color="rgba(203,153,96,1)"
        mode="triangleFan">
        <Shadow
          dx={shadowX}
          dy={shadowY}
          blur={0.2}
          color={'rgba(106,81,64,1)'}
        />
      </Vertices>
      <Rect
        x={x}
        y={y}
        width={width}
        height={height}
        style="stroke"
        strokeWidth={WALL_WIDTH}
        color="rgba(203,153,96,1)"
      />
    </Group>
  );
};

export default GameBox;
