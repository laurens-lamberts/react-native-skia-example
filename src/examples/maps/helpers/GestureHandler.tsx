import type { SkMatrix, SkRect } from "@shopify/react-native-skia";
import { Skia } from "@shopify/react-native-skia";
import React from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { Matrix4, multiply4, toMatrix3, identity4 } from "react-native-redash";

import { concat, vec3 } from "./MatrixHelpers";
import { useWindowDimensions } from "react-native";

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
    .onChange((e) => {
      matrix.value = multiply4(
        Matrix4.translate(e.changeX, e.changeY, 0),
        matrix.value
      );
    })
    .onEnd(() => {
      offset.value = matrix.value;
    });

  const rotate = Gesture.Rotation()
    .onBegin((e) => {
      offset.value = matrix.value;
    })
    .onChange((e) => {
      const centerX = screenWidth / 2;
      const centerY = screenHeight / 2;

      const translateToCenter = Matrix4.translate(centerX, centerY, 0);
      const rotateMatrix = Matrix4.rotateZ(e.rotation);
      const translateBack = Matrix4.translate(-centerX, -centerY, 0);

      let combinedMatrix = multiply4(translateToCenter, rotateMatrix);
      combinedMatrix = multiply4(combinedMatrix, translateBack);

      matrix.value = multiply4(combinedMatrix, offset.value);
    });

  const scale = Gesture.Pinch()
    .onBegin((e) => {
      offset.value = matrix.value;
    })
    .onChange((e) => {
      const centerX = screenWidth / 2;
      const centerY = screenHeight / 2;

      const translateToCenter = Matrix4.translate(centerX, centerY, 0);
      const scaleMatrix = Matrix4.scale(e.scale, e.scale, 1);
      const translateBack = Matrix4.translate(-centerX, -centerY, 0);

      let combinedMatrix = multiply4(translateToCenter, scaleMatrix);
      combinedMatrix = multiply4(combinedMatrix, translateBack);

      matrix.value = multiply4(combinedMatrix, offset.value);
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
    <GestureDetector gesture={Gesture.Simultaneous(scale, pan, rotate)}>
      <Animated.View style={style} />
    </GestureDetector>
  );
};
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
