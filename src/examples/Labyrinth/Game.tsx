import {
  Canvas,
  Group,
  runSpring,
  useSharedValueEffect,
  useValue,
} from "@shopify/react-native-skia";
import React, { useState } from "react";
import { Text, TouchableOpacity, useWindowDimensions } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  SensorType,
  useAnimatedSensor,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FIXED_MENU_HEIGHT, FULL_SCREEN } from "../../../AppActual";
import Ball from "./Ball";
import {
  BALL_SPEED_FACTOR,
  BALL_SIZE,
  WALL_WIDTH,
  HOLE_SIZE,
  BALL_FALL_SENSITIVITY,
} from "./Config";
import Floor from "./Floor";
import GameBox from "./GameBox";
import { useObstacle } from "./hooks/useObstacle";

const MAGIC_NUMBER_VERTICAL_COLLISION = 10; // Unsure why, but this value is necessary to get a correct collision detection vertically with the bounds of the game box.
const AROUND_GAMEBOX_MARGIN = 10;

const LabyrinthGame = () => {
  const insets = useSafeAreaInsets();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const animatedSensor = useAnimatedSensor(SensorType.ROTATION, {
    interval: 10,
  }); // <- initialization
  const [fellDown, setFellDown] = useState(false);

  const effectiveScreenHeight = FULL_SCREEN
    ? screenHeight
    : screenHeight - FIXED_MENU_HEIGHT;

  const BALL_RADIUS = BALL_SIZE / 2;
  const ballRadius = useValue(BALL_RADIUS);
  const startX = screenWidth / 2 - BALL_SIZE / 2;
  const startY =
    effectiveScreenHeight / 2 -
    BALL_SIZE / 2 -
    (FULL_SCREEN ? BALL_SIZE * 2 : FIXED_MENU_HEIGHT + insets.top);
  const ballX = useValue(startX + BALL_RADIUS);
  const ballY = useValue(startY + BALL_RADIUS);
  const shadowX = useValue(startX);
  const shadowY = useValue(startY);
  const falling = useValue(false);

  const velocityX = useValue(0);
  const velocityY = useValue(0);

  const gameBoxStartY = startY / 2 - BALL_SIZE / 2 + WALL_WIDTH / 2;
  const gameBoxStartX = WALL_WIDTH + AROUND_GAMEBOX_MARGIN;
  const gameBoxWidth = screenWidth - WALL_WIDTH * 2 - AROUND_GAMEBOX_MARGIN * 2;
  const gameBoxHeight =
    screenWidth - WALL_WIDTH * 2 - AROUND_GAMEBOX_MARGIN * 2;

  const holes = [
    {
      x: WALL_WIDTH + 20 + AROUND_GAMEBOX_MARGIN * 2,
      y: gameBoxStartY + WALL_WIDTH + 10,
    },
    {
      x: gameBoxWidth - WALL_WIDTH - 40 + AROUND_GAMEBOX_MARGIN * 2,
      y: gameBoxStartY + gameBoxHeight - WALL_WIDTH / 2 - 40 - HOLE_SIZE / 2,
    },
  ];

  const { isInObstacle: isInObstacleOne } = useObstacle({
    id: 0,
    gameBoxHeight,
    gameBoxWidth,
    gameBoxX: gameBoxStartX,
    gameBoxY: gameBoxStartY,
  });
  const { isInObstacle: isInObstacleTwo } = useObstacle({
    id: 1,
    gameBoxHeight,
    gameBoxWidth,
    gameBoxX: gameBoxStartX,
    gameBoxY: gameBoxStartY,
  });

  const reset = () => {
    ballX.current = startX;
    ballY.current = startY;
    falling.current = false;
    ballRadius.current = BALL_RADIUS;
    setFellDown(false);
  };

  const fallInHole = () => {
    falling.current = true;
    setFellDown(true);
    runSpring(ballRadius, ballRadius.current * 0.85, {
      mass: 2,
      velocity: 100,
      damping: 10,
      stiffness: 100,
    });
  };

  const checkHoles = () => {
    if (
      holes.find(
        (hole) =>
          hole.x < ballX.current - BALL_RADIUS &&
          hole.x + HOLE_SIZE >
            ballX.current + BALL_SIZE - BALL_FALL_SENSITIVITY - BALL_RADIUS &&
          hole.y < ballY.current - BALL_RADIUS &&
          hole.y + HOLE_SIZE >
            ballY.current + BALL_SIZE - BALL_FALL_SENSITIVITY - BALL_RADIUS
      )
    ) {
      fallInHole();
    }
  };
  const moveBall = (xDelta: number, yDelta: number) => {
    let isInObstacle = false;
    let xDeltaBall = xDelta * BALL_SPEED_FACTOR;
    let yDeltaBall = yDelta * BALL_SPEED_FACTOR;

    // Collision detection with the obstacles
    if (
      isInObstacleOne(ballX.current, ballY.current) ||
      isInObstacleTwo(ballX.current, ballY.current)
    ) {
      isInObstacle = true;

      if (velocityX.current || velocityY.current) {
        xDeltaBall = -velocityX.current * 0.5;
        yDeltaBall = -velocityY.current * 0.5;

        // TODO: the side of the obstacle that is approached should affect the line below, to be either + or -.
        // Side = +, top or bottom = -.
        /* if (direction === 'horizontal') {
          ballX.current += xDeltaBall;
        } else { */
        ballX.current -= xDeltaBall;
        /* } */
        ballY.current += yDeltaBall;
      }
    }

    // Collision detection with the outer walls of the box
    if (
      (xDeltaBall < 0 &&
        ballX.current > WALL_WIDTH + BALL_RADIUS + AROUND_GAMEBOX_MARGIN * 2) ||
      (xDeltaBall > 0 &&
        ballX.current <
          screenWidth -
            WALL_WIDTH -
            BALL_SIZE +
            BALL_RADIUS -
            AROUND_GAMEBOX_MARGIN * 2)
    ) {
      ballX.current += xDeltaBall;
    }
    if (
      (yDeltaBall < 0 &&
        ballY.current >
          gameBoxStartY +
            WALL_WIDTH +
            BALL_RADIUS -
            MAGIC_NUMBER_VERTICAL_COLLISION) ||
      (yDeltaBall > 0 &&
        ballY.current <
          gameBoxStartY +
            gameBoxHeight -
            WALL_WIDTH -
            BALL_SIZE +
            BALL_RADIUS +
            MAGIC_NUMBER_VERTICAL_COLLISION)
    ) {
      ballY.current += yDeltaBall;
    }
    if (isInObstacle) {
      velocityX.current = 0;
      velocityY.current = 0;
    } else {
      velocityX.current = xDeltaBall;
      velocityY.current = yDeltaBall;
    }
  };

  const moveShadows = (xDelta: number, yDelta: number) => {
    // Set the shadow based on absolute motion
    const xAbsolute = startX + xDelta;
    const yAbsolute = startY + yDelta;
    shadowX.current = -(xAbsolute / 9 - 20);
    shadowY.current = -(yAbsolute / 9 - 34);
  };

  // GAME LOOP (based on motion)
  useSharedValueEffect(() => {
    const { yaw, pitch, roll } = animatedSensor.sensor.value;

    // Move the ball based on motion over time
    // TODO: give the ball a mass (acceleration)
    const xDelta = roll * ((screenWidth / effectiveScreenHeight) * screenWidth);
    const yDelta =
      pitch * ((screenWidth / effectiveScreenHeight) * screenWidth);

    moveShadows(xDelta, yDelta);
    if (falling.current) return;

    moveBall(xDelta, yDelta);
    checkHoles();
  }, animatedSensor.sensor);

  return (
    <>
      <Canvas style={{ flex: 1, backgroundColor: "tomato" }}>
        <Group>
          <Floor
            startY={startY}
            startX={WALL_WIDTH + 10}
            gameBoxHeight={gameBoxHeight}
            gameBoxWidth={gameBoxWidth}
          />
          <GameBox
            x={gameBoxStartX}
            y={gameBoxStartY}
            shadowX={shadowX}
            shadowY={shadowY}
            width={gameBoxWidth}
            height={gameBoxHeight}
            holes={holes}
          >
            <Ball
              x={ballX}
              y={ballY}
              shadowX={shadowX}
              shadowY={shadowY}
              ballRadius={ballRadius}
              gameBoxHeight={gameBoxHeight}
              gameBoxWidth={gameBoxWidth}
              gameBoxY={gameBoxStartY}
            />
          </GameBox>
        </Group>
      </Canvas>
      {fellDown && (
        <Animated.View
          style={{
            position: "absolute",
            top: effectiveScreenHeight - gameBoxStartY - 100,
            alignSelf: "center",
          }}
          entering={FadeIn}
          exiting={FadeOut}
        >
          <TouchableOpacity
            style={{
              backgroundColor: "teal",
              paddingVertical: 20,
              paddingHorizontal: 40,
              borderRadius: 4,
            }}
            onPress={reset}
          >
            <Text style={{ color: "white" }}>Restart</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </>
  );
};

export default LabyrinthGame;
