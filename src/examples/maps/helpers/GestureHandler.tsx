import type { SkMatrix, SkRect } from "@shopify/react-native-skia";
import { Skia } from "@shopify/react-native-skia";
import React from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { Matrix4, multiply4, toMatrix3, identity4 } from "react-native-redash";

import { concat, vec3 } from "./MatrixHelpers";
import { useWindowDimensions } from "react-native";

type Region = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

interface GestureHandlerProps {
  matrix: SharedValue<SkMatrix>;
  dimensions: SkRect;
  debug?: boolean;
}

export const GestureHandler = ({
  matrix: skMatrix,
  dimensions,
  debug,
}: GestureHandlerProps) => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const { x, y, width, height } = dimensions;
  const origin = useSharedValue(vec3(screenWidth / 2, screenHeight / 2, 0));
  const matrix = useSharedValue(identity4);
  const offset = useSharedValue(identity4);

  useAnimatedReaction(
    () => matrix.value,
    () => {
      skMatrix.value = Skia.Matrix(toMatrix3(matrix.value) as any);
    }
  );

  const pan = Gesture.Pan()
    .onBegin((e) => {
      offset.value = matrix.value;
    })
    .onChange((e) => {
      matrix.value = multiply4(
        Matrix4.translate(e.changeX, e.changeY, 0),
        matrix.value
      );

      origin.value = [
        e.absoluteX + screenWidth / 2,
        e.absoluteY + screenHeight / 2,
        0,
      ];
    });

  const rotate = Gesture.Rotation()
    .onBegin((e) => {
      offset.value = matrix.value;
    })
    .onChange((e) => {
      matrix.value = concat(offset.value, origin.value, [
        { rotateZ: e.rotation },
      ]);
    });

  const scale = Gesture.Pinch()
    .onBegin((e) => {
      offset.value = matrix.value;
    })
    .onChange((e) => {
      matrix.value = concat(offset.value, origin.value, [{ scale: e.scale }]);
      /* 
      const FACTOR = 0.1;
      const topLeft = { x: e.focalX, y: e.focalY };
      const bottomRight = {
        x: e.focalX + width * e.scale * FACTOR,
        y: e.focalY + height * e.scale * FACTOR,
      };
      const latitude = (topLeft.y + bottomRight.y) / 2;
      const longitude = (topLeft.x + bottomRight.x) / 2;
      const latitudeDelta = Math.abs(topLeft.y - bottomRight.y);
      const longitudeDelta = Math.abs(topLeft.x - bottomRight.x);
      const region = { latitude, longitude, latitudeDelta, longitudeDelta };

      runOnJS(onRegionChange)(region); 
      */
    });

  const style = useAnimatedStyle(() => ({
    position: "absolute",
    left: x,
    top: y,
    width,
    height,
    backgroundColor: debug ? "rgba(100, 200, 300, 0.1)" : "transparent",
  }));
  return (
    <GestureDetector gesture={Gesture.Simultaneous(scale, pan /* rotate */)}>
      <Animated.View style={style} />
    </GestureDetector>
  );
};
