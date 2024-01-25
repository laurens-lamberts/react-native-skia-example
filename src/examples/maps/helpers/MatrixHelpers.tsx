import { SkMatrix } from "@shopify/react-native-skia";
import { SharedValue } from "react-native-reanimated";
import type { Matrix4, Transforms3d, Vec3 } from "react-native-redash";
import { multiply4, processTransform3d } from "react-native-redash";

export const vec3 = (x: number, y: number, z: number) => [x, y, z] as const;

export const transformOrigin3d = (
  origin: Vec3,
  transform: Transforms3d
): Transforms3d => {
  "worklet";
  return [
    { translateX: origin[0] },
    { translateY: origin[1] },
    { translateZ: origin[2] },
    ...transform,
    { translateX: -origin[0] },
    { translateY: -origin[1] },
    { translateZ: -origin[2] },
  ];
};

export const concat = (m: Matrix4, origin: Vec3, transform: Transforms3d) => {
  "worklet";
  return multiply4(m, processTransform3d(transformOrigin3d(origin, transform)));
};

export const getMarkerMatrixBasedOnGestureMatrix = ({
  coordinateXY,
  matrix,
  width,
  height,
}: {
  coordinateXY: { x: number; y: number };
  matrix: SharedValue<SkMatrix>;
  width: number;
  height: number;
}) => {
  "worklet";
  const originalMatrix = matrix.value.get();

  // Calculate the scale
  const scale = originalMatrix[0];

  // Calculate the new marker translations
  const markerTranslationX =
    (coordinateXY.x + originalMatrix[2] / scale) * scale;
  const markerTranslationY =
    (coordinateXY.y + originalMatrix[5] / scale) * scale;

  return [
    1, // [0] = scaleX
    0, // [1] = rotateX
    markerTranslationX, // [2] = translateX
    0, // [3] = rotateY
    1, // [4] = scaleY
    markerTranslationY, // [5] = translateY
    0,
    0,
    1,
  ];
};
