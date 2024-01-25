import type {
  SkiaMutableValue,
  SkMatrix,
  SkRect,
} from "@shopify/react-native-skia";
import { Skia, useSharedValueEffect } from "@shopify/react-native-skia";
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
  onRegionChange: (newRegion: Region) => void;
}

export const GestureHandler = ({
  matrix: skMatrix,
  dimensions,
  debug,
  onRegionChange,
}: GestureHandlerProps) => {
  const { x, y, width, height } = dimensions;
  const origin = useSharedValue(vec3(0, 0, 0));
  const matrix = useSharedValue(identity4);
  const offset = useSharedValue(identity4);

  useAnimatedReaction(
    () => matrix.value,
    () => {
      skMatrix.value = Skia.Matrix(toMatrix3(matrix.value) as any);
    }
  );

  const pan = Gesture.Pan().onChange((e) => {
    matrix.value = multiply4(
      Matrix4.translate(e.changeX, e.changeY, 0),
      matrix.value
    );
  });

  const rotate = Gesture.Rotation()
    .onBegin((e) => {
      origin.value = [e.anchorX, e.anchorY, 0];
      offset.value = matrix.value;
    })
    .onChange((e) => {
      matrix.value = concat(offset.value, origin.value, [
        { rotateZ: e.rotation },
      ]);
    });

  const FACTOR = 0.1;

  const scale = Gesture.Pinch()
    .onBegin((e) => {
      origin.value = [e.focalX, e.focalY, 0];
      offset.value = matrix.value;
    })
    .onChange((e) => {
      matrix.value = concat(offset.value, origin.value, [{ scale: e.scale }]);
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
    });

  const style = useAnimatedStyle(() => ({
    position: "absolute",
    left: x,
    top: y,
    width,
    height,
    backgroundColor: debug ? "rgba(100, 200, 300, 0.1)" : "transparent",
    /*     transform: [
      { translateX: -width / 2 },
      { translateY: -height / 2 },
      { matrix: matrix.value as any },
      { translateX: width / 2 },
      { translateY: height / 2 },
    ], */
  }));
  return (
    <GestureDetector gesture={Gesture.Simultaneous(scale, rotate, pan)}>
      <Animated.View style={style} />
    </GestureDetector>
  );
};
