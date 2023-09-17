import React from "react";
import { Text, View, useWindowDimensions } from "react-native";
import {
  BlurMask,
  Canvas,
  Easing,
  RoundedRect,
  Skia,
  rect,
  rrect,
  useTiming,
} from "@shopify/react-native-skia";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSharedValue } from "react-native-reanimated";
import LineOfBalls from "./LineOfBalls";
import { GestureDetector, Gesture } from "react-native-gesture-handler";

const STATIC_NUMBER_OF_BALLS_HORIZONTALLY = 8;
const USE_DYNAMIC_NUMBER_OF_BALLS_HORIZONTALLY = true;
const DEFAULT_AMPLITUDE = 10;
export const DEFAULT_BALL_RADIUS = 20;
export const TRAPEZIUM_EFFECT = 1.2; // lower value is more depth
const NUMBER_OF_DEPTH_ROWS = 7;
const VIEWING_ANGLE_VERTICAL = 45; // in degrees
const VIEWING_ANGLE_HORIZONTAL = -7; // in degrees
const PINCH_FACTOR = 1;

// Make configurable in interface;
// 1. Amplitude
// 2. Speed (timing duration)
// 3. viewing angle (both horizontal and vertical)

export default function FloatingBalls() {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const offsetY = useTiming(
    { from: 0, to: 1, loop: true, yoyo: false },
    { duration: 2000, easing: Easing.linear }
  );

  const amplitude = useSharedValue(DEFAULT_AMPLITUDE);

  const viewingAngleVertical = useSharedValue(VIEWING_ANGLE_VERTICAL);
  const viewingAngleHorizontal = useSharedValue(VIEWING_ANGLE_HORIZONTAL);

  const dynamicNumberOfBallsHorizontally = Math.floor(
    screenWidth / (DEFAULT_BALL_RADIUS * 2)
  );

  const numberOfBallsHorizontally = USE_DYNAMIC_NUMBER_OF_BALLS_HORIZONTALLY
    ? dynamicNumberOfBallsHorizontally
    : STATIC_NUMBER_OF_BALLS_HORIZONTALLY;

  const lines = React.useMemo(() => {
    const _lines: { yStart: number; xStart: number }[] = new Array(
      NUMBER_OF_DEPTH_ROWS
    );
    for (let i = 0; i < NUMBER_OF_DEPTH_ROWS; i++) {
      // calculate yStart based on viewing angle and index i
      const yStart =
        Math.tan((VIEWING_ANGLE_VERTICAL * Math.PI) / 180) *
        DEFAULT_BALL_RADIUS *
        i;
      _lines.push({
        yStart,
        xStart: DEFAULT_BALL_RADIUS * i,
      });
    }
    return _lines.reverse();
  }, []);

  const gesture = Gesture.Pan()
    .onChange((e) => {
      viewingAngleHorizontal.value += e.changeX / 10;
      viewingAngleVertical.value += e.changeY / 10;
    })
    .onEnd((e) => {
      /*  viewingAngleHorizontal.current = withDecay({
        velocity: e.velocityX,
        clamp: [-30, 30],
      });
      viewingAngleVertical.current = withDecay({
        velocity: e.velocityY,
        clamp: [-65, 65],
      }); */
    });

  const pinchOrigin = useSharedValue(0);
  const pinch = Gesture.Pinch()
    .onBegin((e) => {
      pinchOrigin.value = e.scale;
    })
    .onChange((e) => {
      // pinching-in seems to go slower. Temp fix for that.
      const pinchFactor = PINCH_FACTOR * (e.scale < pinchOrigin.value ? 6 : 1);

      const newValue =
        amplitude.value + (e.scale - pinchOrigin.value) * pinchFactor;
      const clampedValue = Math.min(Math.max(newValue, 1), 200);
      amplitude.value = clampedValue;
    });

  const matrix = useSharedValue(Skia.Matrix());
  const dimensions = rect(0, 0, screenWidth, screenHeight);

  return (
    <GestureDetector gesture={Gesture.Race(pinch, gesture)}>
      <View
        style={{
          flex: 1,
          backgroundColor: "black",
        }}
      >
        <Canvas
          style={{ width: screenWidth, height: screenHeight }}
          mode="continuous"
        >
          <RoundedRect
            rect={rrect(
              rect(0, 0, screenWidth, screenHeight - insets.bottom - 70),
              0,
              0
            )}
            color={"white"}
          >
            <BlurMask blur={12} style="normal" />
          </RoundedRect>
          {lines.map((line, index) => (
            <LineOfBalls
              key={index}
              offsetY={offsetY}
              amplitude={amplitude}
              yStart={line.yStart}
              xStart={line.xStart}
              numberOfBallsHorizontally={numberOfBallsHorizontally}
              viewingAngleHorizontal={viewingAngleHorizontal}
              matrix={matrix}
            />
          ))}
          {/* <Group transform={[{translateY: screenHeight - insets.bottom - 120}]}>
          <RoundedRect
            x={20}
            y={0}
            width={screenWidth - 40}
            height={6}
            r={25} 
            color="black"
          />
          <Circle cx={amplitudeSliderX} cy={4} r={10} />
        </Group> */}
        </Canvas>
        {/* <GestureHandler matrix={matrix} dimensions={dimensions} /> */}
        <View
          style={{
            alignSelf: "center",
            position: "absolute",
            alignItems: "center",
            bottom: Math.max(insets.bottom, 60),
          }}
        >
          <Text style={{ marginBottom: 4 }}>swipe to change viewing angle</Text>
          <Text>pinch to change amplitude</Text>
        </View>
      </View>
    </GestureDetector>
  );
}
