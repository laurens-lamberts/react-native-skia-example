import { Canvas, Group } from "@shopify/react-native-skia";
import React, { useState } from "react";
import { Text, TouchableOpacity, useWindowDimensions } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  SensorType,
  runOnJS,
  useAnimatedReaction,
  useAnimatedSensor,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
import { runSpring } from "@app/hooks/animations";
import { FIXED_MENU_HEIGHT } from "@app/config/general";

const MAGIC_NUMBER_VERTICAL_COLLISION = 10; // Unsure why, but this value is necessary to get a correct collision detection vertically with the bounds of the game box.
const AROUND_GAMEBOX_MARGIN = 10;

const Maze = () => {
  const insets = useSafeAreaInsets();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const animatedSensor = useAnimatedSensor(SensorType.ROTATION, {
    interval: 10,
  }); // <- initialization
  const [fellDown, setFellDown] = useState(false);

  const effectiveScreenHeight = screenHeight - FIXED_MENU_HEIGHT;

  const BALL_RADIUS = BALL_SIZE / 2;
  const ballRadius = useSharedValue(BALL_RADIUS);
  const startX = screenWidth / 2 - BALL_SIZE / 2;
  const startY =
    effectiveScreenHeight / 2 -
    BALL_SIZE / 2 -
    (FIXED_MENU_HEIGHT + insets.top); // TODO: correct with where the view starts (onlayout y)
  const ballX = useSharedValue(startX + BALL_RADIUS);
  const ballY = useSharedValue(startY + BALL_RADIUS);
  const shadowX = useSharedValue(startX);
  const shadowY = useSharedValue(startY);
  const falling = useSharedValue(false);

  const velocityX = useSharedValue(0);
  const velocityY = useSharedValue(0);

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
    ballX.value = startX;
    ballY.value = startY;
    falling.value = false;
    ballRadius.value = BALL_RADIUS;
    setFellDown(false);
  };

  const fallInHole = () => {
    "worklet";
    falling.value = true;
    runOnJS(setFellDown)(true);
    runSpring(ballRadius.value * 0.85, {
      mass: 2,
      velocity: 100,
      damping: 10,
      stiffness: 100,
    });
  };

  const checkHoles = () => {
    "worklet";
    if (
      holes.find(
        (hole) =>
          hole.x < ballX.value - BALL_RADIUS &&
          hole.x + HOLE_SIZE >
            ballX.value + BALL_SIZE - BALL_FALL_SENSITIVITY - BALL_RADIUS &&
          hole.y < ballY.value - BALL_RADIUS &&
          hole.y + HOLE_SIZE >
            ballY.value + BALL_SIZE - BALL_FALL_SENSITIVITY - BALL_RADIUS
      )
    ) {
      fallInHole();
    }
  };
  const moveBall = (xDelta: number, yDelta: number) => {
    "worklet";
    let isInObstacle = false;
    let xDeltaBall = xDelta * BALL_SPEED_FACTOR;
    let yDeltaBall = yDelta * BALL_SPEED_FACTOR;

    // Collision detection with the obstacles
    if (
      isInObstacleOne(ballX.value, ballY.value) ||
      isInObstacleTwo(ballX.value, ballY.value)
    ) {
      isInObstacle = true;

      if (velocityX.value || velocityY.value) {
        xDeltaBall = -velocityX.value * 0.5;
        yDeltaBall = -velocityY.value * 0.5;

        // TODO: the side of the obstacle that is approached should affect the line below, to be either + or -.
        // Side = +, top or bottom = -.
        /* if (direction === 'horizontal') {
          ballX.value += xDeltaBall;
        } else { */
        ballX.value -= xDeltaBall;
        /* } */
        ballY.value += yDeltaBall;
      }
    }

    // Collision detection with the outer walls of the box
    if (
      (xDeltaBall < 0 &&
        ballX.value > WALL_WIDTH + BALL_RADIUS + AROUND_GAMEBOX_MARGIN * 2) ||
      (xDeltaBall > 0 &&
        ballX.value <
          screenWidth -
            WALL_WIDTH -
            BALL_SIZE +
            BALL_RADIUS -
            AROUND_GAMEBOX_MARGIN * 2)
    ) {
      ballX.value += xDeltaBall;
    }
    if (
      (yDeltaBall < 0 &&
        ballY.value >
          gameBoxStartY +
            WALL_WIDTH +
            BALL_RADIUS -
            MAGIC_NUMBER_VERTICAL_COLLISION) ||
      (yDeltaBall > 0 &&
        ballY.value <
          gameBoxStartY +
            gameBoxHeight -
            WALL_WIDTH -
            BALL_SIZE +
            BALL_RADIUS +
            MAGIC_NUMBER_VERTICAL_COLLISION)
    ) {
      ballY.value += yDeltaBall;
    }
    if (isInObstacle) {
      velocityX.value = 0;
      velocityY.value = 0;
    } else {
      velocityX.value = xDeltaBall;
      velocityY.value = yDeltaBall;
    }
  };

  const moveShadows = (xDelta: number, yDelta: number) => {
    "worklet";
    // Set the shadow based on absolute motion
    const xAbsolute = startX + xDelta;
    const yAbsolute = startY + yDelta;
    shadowX.value = -(xAbsolute / 9 - 20);
    shadowY.value = -(yAbsolute / 9 - 34);
  };

  // GAME LOOP (based on motion)
  useAnimatedReaction(
    () => animatedSensor.sensor.value,
    (value) => {
      const { yaw, pitch, roll } = value;

      // Move the ball based on motion over time

      // TODO: give the ball a mass (acceleration)
      const xDelta =
        roll * ((screenWidth / effectiveScreenHeight) * screenWidth);
      const yDelta =
        pitch * ((screenWidth / effectiveScreenHeight) * screenWidth);

      moveShadows(xDelta, yDelta);
      if (falling.value) return;

      moveBall(xDelta, yDelta);
      checkHoles();
    }
  );

  return (
    <>
      <Canvas style={{ flex: 1 }}>
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

export default Maze;
