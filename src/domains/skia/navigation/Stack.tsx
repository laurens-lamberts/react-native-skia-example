import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNavigation, useRoute } from "@react-navigation/native";
import Flappy from "../examples/Flappy/Game";
import SkiaOverview from "../screens/Overview";
import FloatingBalls from "../examples/floating-balls/FloatingBalls";
import Maze from "../examples/Labyrinth/Game";
import Compass from "../examples/compass";
import Fire from "../examples/fire/Fire";
import Springboard from "../examples/ios-springboard/Springboard";
import Mount from "../examples/Mount";
import BackdropBlur from "../examples/BackdropBlur";
import CanvasResizeAnimation from "../examples/CanvasResizeAnimation";
import SkiaMaps from "../examples/maps/SkiaMap";

export type SkiaRoutes = {
  Overview: undefined;
  "Floating Balls": undefined;
  Flappy: undefined;
  Maze: undefined;
  Compass: undefined;
  Fire: undefined;
  Springboard: undefined;
  Mount: undefined;
  Blur: undefined;
  Resize: undefined;
  Maps: undefined;
};

const Stack = createNativeStackNavigator<SkiaRoutes>();

const SkiaStack = () => {
  return (
    <>
      <Stack.Navigator>
        <Stack.Screen
          name="Overview"
          component={SkiaOverview}
          options={{
            headerTitle: "Skia examples",
          }}
        />
        <Stack.Screen name="Floating Balls" component={FloatingBalls} />
        <Stack.Screen name="Flappy" component={Flappy} />
        <Stack.Screen name="Maze" component={Maze} />
        <Stack.Screen name="Compass" component={Compass} />
        <Stack.Screen name="Fire" component={Fire} />
        <Stack.Screen name="Springboard" component={Springboard} />
        <Stack.Screen name="Mount" component={Mount} />
        <Stack.Screen name="Blur" component={BackdropBlur} />
        <Stack.Screen name="Resize" component={CanvasResizeAnimation} />
        <Stack.Screen name="Maps" component={SkiaMaps} />
      </Stack.Navigator>
    </>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    top: 40,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  buttonText: {
    color: "white",
    fontSize: 24,
    lineHeight: 24,
  },
});

export default SkiaStack;
