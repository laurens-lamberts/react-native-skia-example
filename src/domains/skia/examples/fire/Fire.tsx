import React from "react";
import { View, useWindowDimensions } from "react-native";
import { Canvas, Group } from "@shopify/react-native-skia";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Line from "./Line";
import { useLoop } from "@app/hooks/animations";

const MINIMUM_HEIGHT = 50;
const HEIGHT_DEVIATION = 8; // a number between 5 and 12 would do.

export default function Fire() {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [numberOfLines] = React.useState(24);

  const loopAnimation = useLoop({});

  const lineObjects = React.useMemo(() => {
    const _lineObjects = [];
    const centerIndex = Math.floor(numberOfLines / 2);
    for (let i = 0; i < numberOfLines; i++) {
      const distanceFromCenter = Math.abs(i - centerIndex);

      const height = Math.max(
        MINIMUM_HEIGHT,
        (numberOfLines - distanceFromCenter) *
          (Math.random() * HEIGHT_DEVIATION + 20)
      );

      _lineObjects.push({
        height,
        width: screenWidth / numberOfLines,
      });
    }
    return _lineObjects;
  }, [numberOfLines, screenWidth]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "black",
      }}
    >
      <Canvas
        style={{ width: screenWidth, height: screenHeight }}
        mode="continuous"
      >
        <Group transform={[{ translateY: screenHeight - insets.bottom - 60 }]}>
          {lineObjects.map((lineObject, index) => (
            <Line
              key={index}
              lineObject={lineObject}
              index={index}
              loopAnimation={loopAnimation}
            />
          ))}
        </Group>
      </Canvas>
    </View>
  );
}
