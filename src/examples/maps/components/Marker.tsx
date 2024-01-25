import { Circle, Group } from "@shopify/react-native-skia";
import React from "react";
import { coordinateToXY } from "../helpers/Geo";
import { MarkerType } from "../types/MarkerType";
import { useDerivedValue, useSharedValue } from "react-native-reanimated";

interface Props {
  marker: MarkerType;
  initialRegion: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
}

export const CANVAS_SIZE = 60;
export const MIN_SIZE = 40;

const CustomMarker = ({ marker, initialRegion }: Props) => {
  const size = useSharedValue(20);
  const r = useDerivedValue(() => size.value / 2, [size]);
  const rBorderShrunk = useSharedValue(size.value / 4);

  const coordinateXY = coordinateToXY({
    latitude: marker.latitude,
    longitude: marker.longitude,
    mapLatitude: initialRegion.latitude,
    mapLongitude: initialRegion.longitude,
    mapLatitudeDelta: initialRegion.latitudeDelta,
    mapLongitudeDelta: initialRegion.longitudeDelta,
  });

  return (
    <Group
      transform={[
        { translateX: coordinateXY.x },
        { translateY: coordinateXY.y },
      ]}
    >
      {/* marker border */}
      <Circle cx={CANVAS_SIZE / 2} cy={CANVAS_SIZE / 2} r={r} color={"#444"} />
      <Group>
        {/* Background */}
        <Circle
          cx={CANVAS_SIZE / 2}
          cy={CANVAS_SIZE / 2}
          r={size}
          color={"white"}
        />
        {/* marker-small center dot */}
        <Circle
          cx={CANVAS_SIZE / 2}
          cy={CANVAS_SIZE / 2}
          r={rBorderShrunk}
          color={"#666"}
        />
      </Group>
    </Group>
  );
};

export default CustomMarker;
