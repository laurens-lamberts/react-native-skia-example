import {
  Group,
  RadialGradient,
  Shadow,
  SkMatrix,
  Skia,
  Circle as SkiaCircle,
  vec,
} from "@shopify/react-native-skia";
import React from "react";
import {
  Easing,
  IOSReferenceFrame,
  SensorType,
  SharedValue,
  useAnimatedSensor,
  useDerivedValue,
} from "react-native-reanimated";
import { coordinateToXY } from "../helpers/Geo";
import { useLoop, useTiming } from "@app/hooks/animations";
import { getMarkerMatrixBasedOnGestureMatrix } from "../helpers/MatrixHelpers";

const SIZE = 18;
const CANVAS_SIZE_WITH_MARGIN = SIZE * 6;
const MARGIN = (CANVAS_SIZE_WITH_MARGIN - SIZE) / 2;
const CENTER = MARGIN + SIZE / 2;
const CORRECTION_FOR_NORTH = Math.PI / 4;
const NARROWING_VALUE = 16;

const UserLocationIndicator = ({
  coordinates,
  accuracy,
  mapHeading,
  initialRegion,
  matrix,
}: {
  coordinates?: { latitude: number; longitude: number };
  accuracy?: number;
  mapHeading: SharedValue<number>;
  initialRegion: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  matrix: SharedValue<SkMatrix>;
}) => {
  const isAccurate = true; //(accuracy || 999) < USER_LOCATION_ACCURACY_THRESHOLD; // TODO

  const breath = useLoop({
    duration: 1400,
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    reverse: true,
  });
  const MAX_SIZE_INNER_CIRCLE = SIZE / 2.5;
  const MIN_SIZE_INNER_CIRCLE = MAX_SIZE_INNER_CIRCLE / 1.3;
  const AVG_SIZE_INNER_CIRCLE =
    (MAX_SIZE_INNER_CIRCLE + MIN_SIZE_INNER_CIRCLE) / 2;

  const innerCircleRadius = useDerivedValue(() => {
    return isAccurate
      ? breath.value * (MAX_SIZE_INNER_CIRCLE - MIN_SIZE_INNER_CIRCLE) +
          MIN_SIZE_INNER_CIRCLE
      : AVG_SIZE_INNER_CIRCLE;
  }, [breath, isAccurate]);

  const innerCircleColor = useDerivedValue(() => {
    return isAccurate ? "lightblue" : "gray";
  }, [accuracy]);

  const { sensor: rotationSensor } = useAnimatedSensor(SensorType.ROTATION, {
    interval: "auto",
    iosReferenceFrame: IOSReferenceFrame.XTrueNorthZVertical,
  });
  const compassRotationValue = useDerivedValue(() => {
    return rotationSensor?.value?.yaw
      ? rotationSensor.value.yaw
      : CORRECTION_FOR_NORTH;
  }, [rotationSensor?.value?.yaw]);

  const coordinateXY = coordinateToXY({
    latitude: coordinates?.latitude || 0,
    longitude: coordinates?.longitude || 0,
    mapLatitude: initialRegion.latitude,
    mapLongitude: initialRegion.longitude,
    mapLatitudeDelta: initialRegion.latitudeDelta,
    mapLongitudeDelta: initialRegion.longitudeDelta,
  });

  const compassWrapperTransform = useDerivedValue(
    () => [{ translateX: coordinateXY.x }, { translateY: coordinateXY.y }],
    [coordinateXY.x, coordinateXY.y]
  );
  const compassRotationTransform = useDerivedValue(
    () => [
      {
        rotate:
          -compassRotationValue.value -
          CORRECTION_FOR_NORTH -
          (mapHeading.value * Math.PI) / 180,
      },
    ],
    [compassRotationValue.value, mapHeading.value]
  );

  const bearingOpacity = useTiming(isAccurate ? 0.5 : 0, {
    duration: 800,
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  });

  if (!coordinates?.latitude || !coordinates.longitude) return null;

  const clippingPath = Skia.Path.Make();
  clippingPath.moveTo(0, 0);
  clippingPath.lineTo(CENTER - NARROWING_VALUE, 0);
  clippingPath.lineTo(CENTER, CENTER - SIZE / 2);
  clippingPath.lineTo(CENTER - SIZE / 2, CENTER);
  clippingPath.lineTo(0, CENTER - NARROWING_VALUE);
  clippingPath.lineTo(0, 0);
  clippingPath.close();

  const userLocationIndicatorMatrix = useDerivedValue(() => {
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

  /* Our neutral rotation is exactly pointing to north. */
  return (
    <Group matrix={userLocationIndicatorMatrix}>
      <Group transform={compassWrapperTransform} origin={vec(CENTER, CENTER)}>
        <Group
          transform={compassRotationTransform}
          origin={vec(CENTER, CENTER)}
        >
          <SkiaCircle
            cx={CENTER}
            cy={CENTER}
            r={CANVAS_SIZE_WITH_MARGIN / 2}
            clip={clippingPath}
            opacity={bearingOpacity}
          >
            <RadialGradient
              c={vec(CENTER, CENTER)}
              r={CANVAS_SIZE_WITH_MARGIN / 2}
              colors={["#00FFFF", "#00FFFF60", "#00FFFF00"]}
            />
          </SkiaCircle>
          <SkiaCircle cx={CENTER} cy={CENTER} r={SIZE / 2} color="white">
            <Shadow dx={0} dy={3} blur={3} color={"rgba(0,0,0,0.1)"} />
          </SkiaCircle>
          <SkiaCircle
            cx={CENTER}
            cy={CENTER}
            r={innerCircleRadius}
            color={innerCircleColor}
          />
        </Group>
      </Group>
    </Group>
  );
};
export default UserLocationIndicator;
