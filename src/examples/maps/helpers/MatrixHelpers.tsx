import { SkMatrix } from "@shopify/react-native-skia";
import { SharedValue } from "react-native-reanimated";
import type { Matrix4, Transforms3d, Vec3 } from "react-native-redash";
import { multiply4, processTransform3d } from "react-native-redash";

export const vec3 = (x: number, y: number, z: number) => {
  "worklet";
  return [x, y, z] as const;
};

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
  offsetXY,
}: {
  coordinateXY: { x: number; y: number };
  offsetXY: { x: number; y: number };
  matrix: SharedValue<SkMatrix>;
}) => {
  "worklet";
  const originalMatrix = matrix.value.get();

  // Calculate the scale
  const scale = originalMatrix[0];

  // Calculate the new marker translations
  const x = coordinateXY.x * scale + originalMatrix[2] - offsetXY.x * scale;
  const y = coordinateXY.y * scale + originalMatrix[5] - offsetXY.y * scale;

  // [0] = scaleX
  // [1] = rotateX
  // [2] = translateX
  // [3] = rotateY
  // [4] = scaleY
  // [5] = translateY
  return [1, 0, x, 0, 1, y, 0, 0, 1];
};
