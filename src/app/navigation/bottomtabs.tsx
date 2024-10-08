import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Platform } from "react-native";

const Tab = createBottomTabNavigator();

import SkiaOverview from "@domains/skia/screens/Overview";
import ListsOverview from "@domains/lists/screens/Overview";
import TabBarIcon from "./components/TabBarIcon";

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={
        {
          // headerShown: false,
          // tabBarInactiveTintColor: theme.colors.gray,
          // tabBarActiveTintColor: theme.colors.primary,
        }
      }
    >
      <Tab.Screen
        name="Skia"
        component={SkiaOverview}
        options={{
          tabBarIcon: ({ focused }) =>
            TabBarIcon({
              focused,
              iconFocused: "start-active",
              iconUnfocused: "start-inactive",
            }),
        }}
      />
      <Tab.Screen
        name="Lists"
        component={ListsOverview}
        options={{
          tabBarIcon: ({ focused }) =>
            TabBarIcon({
              focused,
              iconFocused: "start-active",
              iconUnfocused: "start-inactive",
            }),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;
