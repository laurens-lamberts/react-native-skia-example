import { Circle, Group, SkMatrix, vec } from "@shopify/react-native-skia";
import React from "react";
import { coordinateToXY } from "../helpers/Geo";
import { MarkerType } from "../types/MarkerType";
import {
  SharedValue,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { getMarkerMatrixBasedOnGestureMatrix } from "../helpers/MatrixHelpers";

interface Props {
  marker: MarkerType;
  region: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  matrix: SharedValue<SkMatrix>;
}

export const CANVAS_SIZE = 60;
const CENTER = CANVAS_SIZE / 2;
export const MIN_SIZE = 40;

const CustomMarker = ({ marker, region, matrix }: Props) => {
  const coordinateXY = coordinateToXY({
    latitude: marker.latitude,
    longitude: marker.longitude,
    mapLatitude: region.latitude,
    mapLongitude: region.longitude,
    mapLatitudeDelta: region.latitudeDelta,
    mapLongitudeDelta: region.longitudeDelta,
  });

  const markerMatrix = useDerivedValue(() => {
    return getMarkerMatrixBasedOnGestureMatrix({
      matrix,
      coordinateXY: {
        x: coordinateXY.x,
        y: coordinateXY.y,
      },
      offsetXY: {
        x: -CENTER,
        y: -CENTER,
      },
    });
  }, [matrix.value, coordinateXY.x, coordinateXY.y]);

  return (
    <Group matrix={markerMatrix}>
      {/* marker border */}
      <Circle cx={CANVAS_SIZE / 2} cy={CANVAS_SIZE / 2} r={10} color={"#444"} />
      <Group>
        {/* Background */}
        <Circle
          cx={CANVAS_SIZE / 2}
          cy={CANVAS_SIZE / 2}
          r={10}
          color={"white"}
        />
        {/* marker-small center dot */}
        <Circle
          cx={CANVAS_SIZE / 2}
          cy={CANVAS_SIZE / 2}
          r={5}
          color={"#666"}
        />
      </Group>
    </Group>
  );
};

export default CustomMarker;
