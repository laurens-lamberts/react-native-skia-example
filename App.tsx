import "react-native-gesture-handler";
import React from "react";
import { LogBox } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Navigation from "@app/navigation/Main";
import * as SplashScreen from "expo-splash-screen";
import { ThemeProvider } from "@app/context/ThemeProvider";

LogBox.ignoreAllLogs();

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const App = () => {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider>
          <Navigation />
        </ThemeProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

export default App;
