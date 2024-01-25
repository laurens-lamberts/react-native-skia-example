import { vec } from "@shopify/react-native-skia";
import { useMemo } from "react";
import { BALL_RADIUS, WALL_WIDTH } from "../Config";

interface ObstacleProps {
  gameBoxWidth: number;
  gameBoxHeight: number;
  gameBoxX: number;
  gameBoxY: number;
  id: number;
}

export const useObstacle = ({
  gameBoxWidth,
  gameBoxHeight,
  gameBoxX,
  gameBoxY,
  id,
}: ObstacleProps) => {
  const vectors = useMemo(
    () => [
      {
        leftTop: vec(
          gameBoxX,
          gameBoxY + gameBoxHeight * 0.33 - WALL_WIDTH / 2
        ),
        rightTop: vec(
          gameBoxX + gameBoxWidth * 0.66,
          gameBoxY + gameBoxHeight * 0.33 - WALL_WIDTH / 2
        ),
        rightBottom: vec(
          gameBoxX + gameBoxWidth * 0.66,
          gameBoxY + gameBoxHeight * 0.33 + WALL_WIDTH - WALL_WIDTH / 2
        ),
        leftBottom: vec(
          gameBoxX,
          gameBoxY + gameBoxHeight * 0.33 + WALL_WIDTH - WALL_WIDTH / 2
        ),
      },
      {
        leftTop: vec(
          gameBoxX + gameBoxWidth * 0.33,
          gameBoxY + gameBoxHeight * 0.66 - WALL_WIDTH / 2
        ),
        rightTop: vec(
          gameBoxWidth + gameBoxX,
          gameBoxY + gameBoxHeight * 0.66 - WALL_WIDTH / 2
        ),
        rightBottom: vec(
          gameBoxWidth + gameBoxX,
          gameBoxY + gameBoxHeight * 0.66 + WALL_WIDTH - WALL_WIDTH / 2
        ),
        leftBottom: vec(
          gameBoxX + gameBoxWidth * 0.33,
          gameBoxY + gameBoxHeight * 0.66 + WALL_WIDTH - WALL_WIDTH / 2
        ),
      },
    ],
    [gameBoxX, gameBoxY, gameBoxHeight, gameBoxWidth]
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
    "worklet";
    const obstacleVectors = vectors[id];
    const { leftTop, rightTop, rightBottom, leftBottom } = obstacleVectors;
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

  return { obstacle, isInObstacle };
};
