import React, { useMemo } from "react";
import { useWindowDimensions } from "react-native";
import {
  Box,
  rect,
  LinearGradient,
  vec,
  Group,
} from "@shopify/react-native-skia";
import {
  SharedValue,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";

const MAX_GRADIENT_REPETITIONS = 5;
const FIRE_COLORS = [
  "#FFF7D6",
  "#FFE39F",
  "#FFC700",
  "#FFA000",
  "#FF6F00",
  "#FF3D00",
  "#FF0000",
];

interface Props {
  lineObject: {
    width: number;
    height: number;
  };
  index: number;
  loopAnimation: SharedValue<number>;
}

export default function Line({ lineObject, index, loopAnimation }: Props) {
  const { height: screenHeight } = useWindowDimensions();

  const gradient = useMemo(() => {
    //return FIRE_COLORS;
    const numberOfGradientRepetitions =
      ((Math.floor(Math.random() * (MAX_GRADIENT_REPETITIONS - 1)) + 1) *
        lineObject.height) /
      screenHeight; // larger lines have a greater chance to get more gradient repetitions

    const fireColorsIncludingInvert = FIRE_COLORS.slice()
      .reverse()
      .concat(FIRE_COLORS);

    let completeGradient = [];

    for (let i = 0; i < numberOfGradientRepetitions; i++) {
      completeGradient.push(...fireColorsIncludingInvert);
    }
    return completeGradient;
  }, [lineObject.height, screenHeight]);

  const deviatedHeight = useDerivedValue(() => {
    return (
      lineObject.height * (Math.random() * 0.2 + 0.85) * loopAnimation.value
    );
  }, [lineObject, loopAnimation]);

  const deviatedBox = useDerivedValue(() => {
    return rect(
      0 + index * lineObject.width,
      0,
      lineObject.width,
      deviatedHeight.value
    );
  }, [deviatedHeight, index, lineObject.width]);
  const deviatedTransform = useDerivedValue(() => {
    return [
      {
        translateY: -deviatedHeight.value,
      },
    ];
  }, [deviatedHeight]);
  const deviatedGradientEnd = useDerivedValue(() => {
    return vec(0, deviatedHeight.value);
  }, [deviatedHeight]);

  const gradientPositions = useDerivedValue(() => {
    // should interpolate colors at loopAnimation

    /* return interpolateColors(
      loopAnimation.value,
      [0, 1],
      ['#FFF7D6', '#FF0000'], //gradient
    ); */
    return gradient.map((v, _index) => {
      return Math.abs(
        loopAnimation.value * _index * Math.max(Math.random(), 0.4)
      );
    });
  }, [gradient, loopAnimation]);

  return (
    <Group transform={deviatedTransform}>
      <Box color="#FF6F00" box={deviatedBox}>
        <LinearGradient
          start={vec(0, 0)}
          end={deviatedGradientEnd}
          colors={gradient}
          positions={gradientPositions}
          // mode={"repeat"}
          /* positions={gradient.map(() => {
            return Math.random() * 0.3 + 0.15;
          })} */
          //origin={{x: 0, y: 0}}
        />
      </Box>
    </Group>
  );
}
