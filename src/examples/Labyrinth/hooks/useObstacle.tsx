import {vec} from '@shopify/react-native-skia';
import {useMemo} from 'react';
import {WALL_WIDTH} from '../Config';

interface ObstacleProps {
  gameboxWidth: number;
  gameBoxHeight: number;
  gameBoxY: number;
  id: number;
}

export const useObstacle = ({
  gameboxWidth,
  gameBoxHeight,
  gameBoxY,
  id,
}: ObstacleProps) => {
  const vectors = useMemo(
    () => [
      {
        leftTop: vec(WALL_WIDTH, gameBoxY + gameBoxHeight * 0.3),
        rightTop: vec(
          WALL_WIDTH + gameboxWidth * 0.6,
          gameBoxY + gameBoxHeight * 0.3,
        ),
        rightBottom: vec(
          WALL_WIDTH + gameboxWidth * 0.6,
          gameBoxY + gameBoxHeight * 0.3 + WALL_WIDTH,
        ),
        leftBottom: vec(
          WALL_WIDTH,
          gameBoxY + gameBoxHeight * 0.3 + WALL_WIDTH,
        ),
      },
    ],
    [gameBoxHeight, gameBoxY, gameboxWidth],
  );

  const obstacle = useMemo(() => {
    const obstacleVectors = vectors[id];
    const leftTop = obstacleVectors.leftTop;
    const rightTop = obstacleVectors.rightTop;
    const rightBottom = obstacleVectors.rightBottom;
    const leftBottom = obstacleVectors.leftBottom;
    return [leftTop, rightTop, rightBottom, leftBottom, leftTop];
  }, [id, vectors]);

  const isInObstacle = () => {};

  return {obstacle, isInObstacle};
};
