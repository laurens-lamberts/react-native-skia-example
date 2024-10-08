import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View } from "react-native";
import BottomTabs from "./BottomTabs";
import { NavigationContainer } from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";

type MainRoutes = { BottomTabs: undefined };

const MainStack = createNativeStackNavigator<MainRoutes>();

const Navigation = () => {
  return (
    <View
      style={{ flex: 1 }}
      onLayout={async () => await SplashScreen.hideAsync()}
    >
      <NavigationContainer>
        <MainStack.Navigator
          screenOptions={{
            headerShown: false,
            // orientation: isTablet ? 'default' : 'portrait_up',
            presentation: "fullScreenModal",
            contentStyle: {
              overflow: "hidden",
              // backgroundColor: 'white'
              // backgroundColor: theme.colors.canvas,
            },
          }}
        >
          <MainStack.Screen
            name="BottomTabs"
            component={BottomTabs}
            options={{ presentation: "fullScreenModal", animation: "default" }}
          />
        </MainStack.Navigator>
      </NavigationContainer>
    </View>
  );
};

export default Navigation;
