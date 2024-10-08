import {
  Canvas,
  Circle,
  Group,
  vec,
  Text as SkiaText,
  useFont,
} from "@shopify/react-native-skia";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import {
  IOSReferenceFrame,
  SensorType,
  useAnimatedReaction,
  useAnimatedSensor,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import {
  bearing,
  generateLocation,
  getDistanceFromLatLonInKm,
} from "./helpers/geo";
import Geolocation, {
  GeolocationResponse,
} from "@react-native-community/geolocation";
import Arrow from "./components/Arrow";
import { runSpring } from "@app/hooks/animations";
import useTheme from "@app/hooks/useTheme";

const MARGIN = 20;
const ARROW_HEIGHT = 160;
const DESTINATION_REACHED_MARGIN_IN_METERS = 10;

/* const CALIBRATION_INTERVAL = 100;
const CALIBRATION_INTERVALS = 50; // this makes 5 seconds
const CALIBRATION_COUNTDOWN_INITIAL_VALUE =
  CALIBRATION_INTERVAL * CALIBRATION_INTERVALS; */

const Compass = () => {
  const theme = useTheme();
  const { height, width } = useWindowDimensions();
  //const {sensor} = useAnimatedSensor(SensorType.ROTATION, {interval: 'auto'});
  const { sensor: magnet } = useAnimatedSensor(SensorType.MAGNETIC_FIELD, {
    interval: "auto",
    iosReferenceFrame: IOSReferenceFrame.XTrueNorthZVertical,
  });
  const { sensor: rotationSensor } = useAnimatedSensor(SensorType.ROTATION, {
    interval: "auto",
    iosReferenceFrame: IOSReferenceFrame.XTrueNorthZVertical,
  });

  const middleX = width / 2;
  const compassRadius = middleX - MARGIN;
  const middleY = height / 2 - compassRadius / 2;
  const origin = vec(middleX, middleY);

  const enableCompass = useSharedValue(true);

  const compassRotationValue = useSharedValue(Math.PI);
  const compassRotationTransform = useDerivedValue(
    () => [{ rotate: compassRotationValue.value }],
    [compassRotationValue]
  );
  const destinationRotationValue = useSharedValue(0);
  const destinationRotationTransform = useDerivedValue(
    () => [{ rotate: destinationRotationValue.value }],
    [destinationRotationValue]
  );

  /* const calibrationX = useSharedValue(0);
  const calibrationY = useSharedValue(0);
  const calibrationZ = useSharedValue(0); */

  const currentLat = useSharedValue(0);
  const currentLong = useSharedValue(0);
  const currentlocationUpdateDateTime = useSharedValue("");

  const destinationLat = useSharedValue(0);
  const destinationLong = useSharedValue(0);
  const destinationBearing = useSharedValue(0);
  const destinationDistance = useSharedValue(0);

  const arrowColor = useDerivedValue(() => {
    if (
      destinationDistance.value < DESTINATION_REACHED_MARGIN_IN_METERS &&
      destinationBearing.value !== 0
    ) {
      return "lime";
    }
    return "black";
  }, [destinationDistance]);

  const debugText = useSharedValue("no destination yet");
  const accuracyText = useSharedValue("");

  /* const calibrationCountdownValue = useSharedValue(
    CALIBRATION_COUNTDOWN_INITIAL_VALUE,
  );
  const calibrationInterval = useRef<NodeJS.Timer>();
  const calibrationIntervalsPassed = useRef(0); */
  const calibrationCountdownText = useSharedValue("");

  const [showCalibrationTexts, setShowCalibrationTexts] = useState(false);

  /* let xValues = useRef<number[]>([]);
  let yValues = useRef<number[]>([]);
  let zValues = useRef<number[]>([]);

  const calibrate = () => {
    if (calibrationInterval.value) {
      console.log('calibration already in progress');
      return;
    }
    calibrationCountdownValue.value = CALIBRATION_COUNTDOWN_INITIAL_VALUE;
    console.log('calibration started...');
    setShowCalibrationTexts(true);

    calibrationInterval.value = setInterval(() => {
      if (calibrationIntervalsPassed.value >= CALIBRATION_INTERVALS) {
        console.log('calibration done.');
        setShowCalibrationTexts(false);
        calibrationIntervalsPassed.value = 0;

        !!calibrationInterval.value &&
          clearInterval(calibrationInterval.value);
        calibrationInterval.value = undefined;
        calibrationCountdownValue.value = 0;

        // 2. take the average of this data for each axis
        const xAverage = getAverage(xValues.value);
        const yAverage = getAverage(yValues.value);
        const zAverage = getAverage(zValues.value);

        calibrationX.value = xAverage;
        calibrationY.value = yAverage;
        calibrationZ.value = zAverage;

        // 3. subtract the average from the current value as correction
        // this is done within the useSharedValueEffect
        return;
      }

      // 1. record the min and max values of the magnetometer over a period of time
      let {x, y, z} = magnet.value;
      xValues.value = [...xValues.value, x];
      yValues.value = [...yValues.value, y];
      zValues.value = [...zValues.value, z];

      const remainingCalibrationDuration =
        calibrationCountdownValue.value - CALIBRATION_INTERVAL;

      calibrationCountdownValue.value = remainingCalibrationDuration;
      calibrationCountdownText.value =
        remainingCalibrationDuration.toString();

      calibrationIntervalsPassed.value += 1;
    }, CALIBRATION_INTERVAL);
  }; */

  const generateRandomDestination = useCallback(async () => {
    if (!currentLat.value || !currentLong.value) {
      Alert.alert("", "no current location");
      return;
    }
    const maxDistanceInMeters = 80;
    const minDistanceInMeters = 5;
    const randomLatLong = generateLocation(
      currentLat.value,
      currentLong.value,
      maxDistanceInMeters,
      minDistanceInMeters
    );
    destinationLat.value = randomLatLong.latitude;
    destinationLong.value = randomLatLong.longitude;
    console.log(
      "random destination",
      randomLatLong.latitude,
      randomLatLong.longitude
    );
  }, [currentLat, currentLong, destinationLat, destinationLong]);

  useAnimatedReaction(
    () => magnet.value,
    (value) => {
      if (!enableCompass.value) return;
      //const {yaw} = sensor.value;

      /* let {x, y, z} = magnet.value; */
      const { yaw } = rotationSensor.value;

      /* if (!calibrationX.value) {
      // auto calibrate
      if (!calibrationInterval.value) {
        calibrate();
      }
      return;
    } */

      /* const correctionX = calibrationX.value || x;
    const correctionY = calibrationY.value || y;
    const correctionZ = calibrationZ.value || z;
    x -= correctionX;
    y -= correctionY;
    z -= correctionZ;

    const xCorrected = Math.cos(pitch) * x - Math.sin(pitch) * z;
    const yCorrected = Math.cos(roll) * y - Math.sin(roll) * z;

    const headingInRadians =
      Math.atan2(yCorrected, xCorrected) * (180 / Math.PI);
    const headingInDegrees =
      (toDegrees(headingInRadians) / 180) * Math.PI + 180;
    const headingInRotationValue = (headingInDegrees / 180) * Math.PI;

    console.log(headingInRadians); */

      // rotation scale: -PI to PI
      //console.log(headingInRotationValue);
      compassRotationValue.value = yaw - Math.PI / 2;
    },
    [enableCompass]
  );

  const calculateBearingToDestination = useCallback(() => {
    if (!enableCompass.value) return;
    // calculate the bearing from the current location to the destination
    const newBearing = bearing(
      currentLat.value,
      currentLong.value,
      destinationLat.value,
      destinationLong.value
    );

    const distance = getDistanceFromLatLonInKm(
      currentLat.value,
      currentLong.value,
      destinationLat.value,
      destinationLong.value
    );

    if (newBearing !== destinationBearing.value) {
      const text =
        "head " +
        Math.round(newBearing) +
        " degrees to destination. distance: " +
        Math.round(distance * 1000) +
        " m";
      debugText.value = text;
    }
    destinationDistance.value = distance * 1000;
    destinationBearing.value = newBearing;

    const newDestinationRotationValue = (newBearing * Math.PI) / 180;
    if (destinationRotationValue.value !== newDestinationRotationValue) {
      // runSpring(destinationRotationValue.value, newDestinationRotationValue);
    }
  }, [
    currentLat,
    currentLong,
    debugText,
    destinationBearing,
    destinationDistance,
    destinationLat,
    destinationLong,
    destinationRotationValue,
    enableCompass,
  ]);

  const processCurrentLocation = useCallback(
    (pos: GeolocationResponse) => {
      // get current location
      const { latitude, longitude, accuracy } = pos.coords;
      currentLat.value = latitude;
      currentLong.value = longitude;

      accuracyText.value =
        "current location accuracy: " + Math.round(accuracy) + " m";

      if (destinationLat.value === 0) {
        // generate a random destination
        generateRandomDestination();
      }

      calculateBearingToDestination();

      //alert('pos: ' + JSON.stringify(pos));
    },
    [
      accuracyText,
      calculateBearingToDestination,
      currentLat,
      currentLong,
      destinationLat,
      generateRandomDestination,
    ]
  );

  const forceGetCurrentLocation = useCallback(() => {
    Geolocation.getCurrentPosition(
      (pos) => {
        currentlocationUpdateDateTime.value =
          "location updated at " + new Date().toLocaleTimeString();
        processCurrentLocation(pos);
      },
      (error) => {
        alert("woops");
      },
      {
        maximumAge: 0,
        // enableHighAccuracy: true, // does not work
      }
    );
  }, [currentlocationUpdateDateTime, processCurrentLocation]);

  const watchPosition = useCallback(() => {
    Geolocation.watchPosition(
      (pos) => {
        currentlocationUpdateDateTime.value =
          "location updated at " + new Date().toLocaleTimeString();
        processCurrentLocation(pos);
      },
      () => {
        alert("error");
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 0,
        maximumAge: 0,
      }
    );
  }, [currentlocationUpdateDateTime, processCurrentLocation]);

  const init = useCallback(() => {
    Geolocation.requestAuthorization(
      () => {},
      (error) => {
        alert(error);
      }
    );

    // 1. determine a random radius between 5 and 100 meters
    // 2. determine a random angle between 0 and 360 degrees
    // 3. convert the radius + angle to a cartesian coordinate
    // 4. determine the bearing from the current location to the random coordinate
    watchPosition();

    // 5. draw a circle within the circle to where the random coordinate is, maximum to the edge of the circle
    // 6. this should allow us to see us heading towards the random coordinate
  }, [watchPosition]);

  useEffect(() => {
    init();
  }, [init, watchPosition]);

  const font = useFont(
    require("@app/assets/fonts/SFPRODISPLAYREGULAR.otf"),
    14
  );

  if (!font) return null;

  return (
    <View style={{ flex: 1 }}>
      <Canvas style={{ flex: 1 }}>
        <Circle
          cx={middleX}
          cy={middleY}
          r={compassRadius}
          color="black"
          style="stroke"
          strokeWidth={4}
        />
        <Group transform={compassRotationTransform} origin={origin}>
          {/* This group points north */}
          <SkiaText
            x={middleX - 5} // TODO: fix magic number
            y={middleY + compassRadius + 10}
            font={font}
            color="red"
            text={"N"}
            transform={[{ rotate: Math.PI }]}
            origin={vec(middleX, middleY + compassRadius - 10)}
          />
          {/* <Rect
            x={middleX - NEEDLE_WIDTH / 2}
            y={middleY}
            width={NEEDLE_WIDTH}
            height={NEEDLE_HEIGHT}
            color="black"
          /> */}
          <Group
            transform={destinationRotationTransform}
            origin={vec(middleX, middleY)}
          >
            {/* This group points towards the destination. Relative to north. */}

            <Arrow
              translateX={middleX - ARROW_HEIGHT * 0.2}
              translateY={middleY}
              height={ARROW_HEIGHT}
              color={arrowColor}
            />
            <Circle
              cx={middleX}
              cy={middleY + compassRadius}
              r={12}
              color="lime"
            />
            <SkiaText
              x={middleX - 16}
              y={middleY + compassRadius + 10}
              font={font}
              color="lime"
              text={"DEST"}
              transform={[{ rotate: Math.PI }]}
              origin={vec(middleX, middleY + compassRadius - 10)}
            />
          </Group>
        </Group>
        {/* <Circle cx={middleX} cy={middleY} r={12} color="red" /> */}
        <SkiaText x={40} y={40} font={font} color="black" text={debugText} />
        <SkiaText x={40} y={60} font={font} color="black" text={accuracyText} />
        <SkiaText
          x={40}
          y={80}
          font={font}
          color="black"
          text={currentlocationUpdateDateTime}
        />
        {showCalibrationTexts && (
          <>
            <SkiaText
              x={40}
              y={120}
              font={font}
              color="black"
              text={"Calibrating... Move the device over all axes. "}
            />
            <SkiaText
              x={40}
              y={140}
              font={font}
              color="black"
              text={calibrationCountdownText}
            />
          </>
        )}
      </Canvas>
      <View
        style={{
          flexDirection: "row",
          gap: theme.space.m,
          alignSelf: "center",
          bottom: MARGIN * 2,
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: "#ccc",
            padding: 8,
            borderRadius: 4,
          }}
          onPress={() => {
            generateRandomDestination();
            calculateBearingToDestination();
          }}
        >
          <Text style={{ textAlign: "center" }}>New dest</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: "#ccc",
            padding: 8,
            borderRadius: 4,
          }}
          onPress={() => {
            if (!enableCompass.value) {
              init();
              forceGetCurrentLocation();
            }

            enableCompass.value = !enableCompass.value;
          }}
        >
          <Text style={{ textAlign: "center" }}>start/stop</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: "#ccc",
            padding: 8,
          }}
          onPress={forceGetCurrentLocation}
        >
          <Text style={{ textAlign: "center" }}>force get pos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Compass;
