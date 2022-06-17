import {vec} from '@shopify/react-native-skia';
import {useMemo} from 'react';
import {BALL_RADIUS, WALL_WIDTH} from '../Config';

interface ObstacleProps {
  gameBoxWidth: number;
  gameBoxHeight: number;
  gameBoxY: number;
  id: number;
}

export const useObstacle = ({
  gameBoxWidth,
  gameBoxHeight,
  gameBoxY,
  id,
}: ObstacleProps) => {
  const vectors = useMemo(
    () => [
      {
        leftTop: vec(WALL_WIDTH, gameBoxY + gameBoxHeight * 0.3),
        rightTop: vec(
          WALL_WIDTH + gameBoxWidth * 0.6,
          gameBoxY + gameBoxHeight * 0.3,
        ),
        rightBottom: vec(
          WALL_WIDTH + gameBoxWidth * 0.6,
          gameBoxY + gameBoxHeight * 0.3 + WALL_WIDTH,
        ),
        leftBottom: vec(
          WALL_WIDTH,
          gameBoxY + gameBoxHeight * 0.3 + WALL_WIDTH,
        ),
      },
      {
        leftTop: vec(
          WALL_WIDTH + gameBoxWidth * 0.3,
          gameBoxY + gameBoxHeight * 0.6,
        ),
        rightTop: vec(gameBoxWidth, gameBoxY + gameBoxHeight * 0.6),
        rightBottom: vec(
          gameBoxWidth,
          gameBoxY + gameBoxHeight * 0.6 + WALL_WIDTH,
        ),
        leftBottom: vec(
          WALL_WIDTH + gameBoxWidth * 0.3,
          gameBoxY + gameBoxHeight * 0.6 + WALL_WIDTH,
        ),
      },
    ],
    [gameBoxHeight, gameBoxY, gameBoxWidth],
  );

  const obstacle = useMemo(() => {
    const obstacleVectors = vectors[id];
    const leftTop = obstacleVectors.leftTop;
    const rightTop = obstacleVectors.rightTop;
    const rightBottom = obstacleVectors.rightBottom;
    const leftBottom = obstacleVectors.leftBottom;
    return [leftTop, rightTop, rightBottom, leftBottom, leftTop];
  }, [id, vectors]);

  const isInObstacle = (ballX: number, ballY: number) => {
    const obstacleVectors = vectors[id];
    const {leftTop, rightTop, rightBottom, leftBottom} = obstacleVectors;
    // For now we assume the obstacle is always square
    if (
      leftTop.x < ballX + BALL_RADIUS &&
      rightTop.x > ballX - BALL_RADIUS &&
      /* rightBottom.x > ballX &&
      leftBottom.x < ballX && */
      leftTop.y < ballY + BALL_RADIUS &&
      leftBottom.y > ballY - BALL_RADIUS
      /* rightBottom.y > ballY &&
      leftBottom.y < ballY */
    ) {
      return true;
    }

    return false;
  };

  return {obstacle, isInObstacle};
};
