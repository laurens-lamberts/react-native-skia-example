import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  Horse,
  Heart,
  Cube,
  List,
  ListBullets,
  ListNumbers,
} from "phosphor-react-native";

const Tab = createBottomTabNavigator();

import SkiaOverview from "@domains/skia/screens/Overview";
import ListsOverview from "@domains/lists/screens/Overview";

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
          tabBarIcon: ({ focused }) => (
            <Heart size={24} weight={focused ? "fill" : "regular"} />
          ),
        }}
      />
      <Tab.Screen
        name="Lists"
        component={ListsOverview}
        options={{
          tabBarIcon: ({ focused }) => (
            <List size={24} weight={focused ? "fill" : "regular"} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;
