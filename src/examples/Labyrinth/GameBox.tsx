import {
  Fill,
  Group,
  Points,
  Rect,
  Shadow,
  SkiaValue,
  SkVertices,
  vec,
  Vertices,
} from '@shopify/react-native-skia';
import React, {PropsWithChildren} from 'react';
import {WALL_WIDTH} from './Config';
import Hole from './Hole';

interface GameBoxInterface {
  y: number;
  height: number;
  width: number;
  shadowX: SkiaValue<number>;
  shadowY: SkiaValue<number>;
  holes?: {x: number; y: number}[];
}

const GameBox = ({
  y,
  height,
  width,
  shadowX,
  shadowY,
  children,
  holes,
}: PropsWithChildren<GameBoxInterface>) => {
  const obstacleFirstPoints = [
    vec(WALL_WIDTH, y + height * 0.3),
    vec(WALL_WIDTH + width * 0.6, y + height * 0.3),
    vec(WALL_WIDTH + width * 0.6, y + height * 0.3 + WALL_WIDTH),
    vec(WALL_WIDTH, y + height * 0.3 + WALL_WIDTH),
    vec(WALL_WIDTH, y + height * 0.3),
  ];
  const obstacleSecondPoints = [
    vec(WALL_WIDTH + width * 0.3, y + height * 0.6),
    vec(width, y + height * 0.6),
    vec(width, y + height * 0.6 + WALL_WIDTH),
    vec(WALL_WIDTH + width * 0.3, y + height * 0.6 + WALL_WIDTH),
    vec(WALL_WIDTH + width * 0.3, y + height * 0.6),
  ];

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
      <Vertices
        vertices={obstacleFirstPoints}
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
        vertices={obstacleSecondPoints}
        color="rgba(203,153,96,1)"
        mode="triangleFan">
        <Shadow
          dx={shadowX}
          dy={shadowY}
          blur={0.2}
          color={'rgba(106,81,64,1)'}
        />
      </Vertices>
      {/* <Points
        points={obstaclePoints}
        mode="polygon"
        color="rgba(203,153,96,1)"
        style="fill">
        
      </Points> */}
      <Rect
        x={WALL_WIDTH / 2}
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
