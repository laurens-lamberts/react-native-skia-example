import React, { useState } from "react";
import {
  Group,
  Rect,
  Text,
  useClock,
  useFont,
} from "@shopify/react-native-skia";
import { Canvas, Fill, useTouchHandler } from "@shopify/react-native-skia";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import {
  BIRD_HEIGHT,
  FALLING_SPEED,
  FALL_ACCELERATE_FACTOR,
  OBSTACLE_MINIMUM_GAP_SIZE,
  SHOW_DEBUG,
  VELOCITY_DECREASE,
  VELOCITY_INCREASE,
  VELOCITY_MAX,
  FLOOR_HEIGHT,
  GRASS_HEIGHT,
} from "./Config";
import Bird from "./Bird";
import Obstacle from "./Obstacle";
import {
  SharedValue,
  runOnJS,
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { FULL_SCREEN } from "@app/config";

interface CanvasContentProps {
  translateY: SharedValue<number>;
  clock: SharedValue<number>;
  gameOver: () => void;
  points: SharedValue<number>;
  size: SharedValue<{ width: number; height: number }>;
}
const CanvasContent = ({
  translateY,
  clock,
  gameOver,
  points,
  size,
}: CanvasContentProps) => {
  const canvasWidth = size.value.width;
  const canvasHeight = size.value.height;

  const font = useFont(require("@app/assets/fonts/SFPRODISPLAYBOLD.otf"), 40);

  const birdY = useSharedValue(0);
  const bottom = useDerivedValue(
    () => canvasHeight - BIRD_HEIGHT - FLOOR_HEIGHT,
    [canvasHeight]
  );

  useDerivedValue(() => {
    birdY.value = bottom.value - translateY.value;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bottom, translateY]);

  return (
    <Group>
      <Fill color="rgba(67,183,192,1)" />
      <Bird birdY={birdY} clock={clock} />
      <Obstacle
        canvasWidth={canvasWidth}
        canvasHeight={canvasHeight}
        birdY={birdY}
        clock={clock}
        gameOver={gameOver}
        initialX={300}
        points={points}
        size={size}
        minimumGapSize={OBSTACLE_MINIMUM_GAP_SIZE} // TODO: decrease over time
      />
      {/* <Obstacle
        canvasWidth={canvasWidth}
        canvasHeight={canvasHeight}
        birdY={birdY}
        clock={clock}
        gameOver={gameOver}
        initialX={600}
        points={points}
        minimumGapSize={OBSTACLE_MINIMUM_GAP_SIZE} // TODO: decrease over time
      /> */}
      <Rect
        x={0}
        y={canvasHeight - FLOOR_HEIGHT}
        width={canvasWidth}
        height={FLOOR_HEIGHT}
        color="rgba(219,211,143,1)"
      />
      <Rect
        x={0}
        y={canvasHeight - FLOOR_HEIGHT + 3}
        width={canvasWidth}
        height={GRASS_HEIGHT}
        color="rgba(102,182,50,1)"
      />
      <Rect
        x={0}
        y={canvasHeight - FLOOR_HEIGHT}
        width={canvasWidth}
        height={3}
        color="#666"
      />
      <Text
        x={canvasWidth / 2 - 8} // TODO: actual center
        y={120}
        text={points.value.toString()}
        font={font}
        color="white"
      />
    </Group>
  );
};

const Flappy = () => {
  const insets = useSafeAreaInsets();
  // This unused state variable ensures Skia values can be drawn on screen
  const [clockState, setClockState] = useState(-1);
  const resetOnNextTap = useSharedValue(0);

  const translateY = useSharedValue(0);
  const velocityY = useSharedValue(0);
  const fallingStart = useSharedValue(0);
  const taps = useSharedValue(0);
  const points = useSharedValue(0);

  const clock = useClock();

  const reset = () => {
    "worklet";
    resetOnNextTap.value = 0;
    points.value = 0;
    // clock.start(); // TODO: fix
  };
  const gameOver = () => {
    "worklet";
    // clock.stop(); // TODO: fix
    resetOnNextTap.value = 1;
  };

  const font = useFont(
    require("@app/assets/fonts/SFPRODISPLAYREGULAR.otf"),
    16
  );

  // GAME LOOP
  useAnimatedReaction(
    () => clock.value,
    (value) => {
      // TODO: with the current setup setting state seems necessary to get the values out for drawings, but drops the JS thread to 30fps on low-end Android.
      // All drawings should be done- and calculations should compute on GPU.
      runOnJS(setClockState)(value);

      if (translateY.value <= 0 && velocityY.value === 0) {
        // Flappy is at the bottom
        fallingStart.value = 0;
        return;
      }

      let acceleratedFallingSpeed = FALLING_SPEED;
      if (fallingStart.value > 0) {
        acceleratedFallingSpeed *=
          (fallingStart.value / translateY.value) * FALL_ACCELERATE_FACTOR + 1;
      }

      translateY.value =
        translateY.value - acceleratedFallingSpeed + velocityY.value;

      if (velocityY.value > 0) {
        velocityY.value -= VELOCITY_DECREASE;
      } else if (fallingStart.value === 0) {
        fallingStart.value = translateY.value;
      }
      if (translateY.value < 0) translateY.value = 0;
    }
  );

  const touchHandler = useTouchHandler({
    onStart: ({}) => {
      if (resetOnNextTap.value === 1) {
        reset();
      }

      taps.value++;
      velocityY.value += VELOCITY_INCREASE;
      if (velocityY.value > VELOCITY_MAX) velocityY.value = VELOCITY_MAX;
      fallingStart.value = 0;
    },
  });

  const size = useSharedValue({ width: 0, height: 0 });

  return (
    <SafeAreaView
      style={{ flex: 1 }}
      edges={FULL_SCREEN ? ["left"] : ["bottom"]}
    >
      <Canvas
        style={{
          flex: 1,
          backgroundColor: "white",
        }}
        debug={SHOW_DEBUG}
        onSize={size}
        onTouch={touchHandler}
      >
        <CanvasContent
          translateY={translateY}
          clock={clock}
          gameOver={gameOver}
          points={points}
          size={size}
        />
        {SHOW_DEBUG && (
          <>
            <Text
              x={10}
              y={insets.top}
              font={font}
              text={"taps: " + taps.value.toString()}
            />
            <Text
              x={10}
              y={insets.top + 20}
              text={"clock: " + Math.round(clock.value).toString() + " ms"}
              font={font}
            />
            <Text
              x={10}
              y={insets.top + 40}
              text={
                "translate: " + Math.round(translateY.value).toString() + " y"
              }
              font={font}
            />
            <Text
              x={10}
              y={insets.top + 60}
              text={
                "velocity: " + Math.round(velocityY.value).toString() + " y"
              }
              font={font}
            />
            <Text
              x={10}
              y={insets.top + 80}
              text={
                "falling: " + Math.round(fallingStart.value).toString() + " y"
              }
              font={font}
            />
          </>
        )}
      </Canvas>
    </SafeAreaView>
  );
};

export default Flappy;
