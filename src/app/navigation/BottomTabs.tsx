import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Heart, List } from "phosphor-react-native";

const Tab = createBottomTabNavigator();

import ListsOverview from "@domains/lists/screens/Overview";
import Stack from "@domains/skia/navigation/Stack";

const BottomTabs = () => {
  return (
    <Tab.Navigator
      tabBar={() => <></>} // Maybe later
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Skia"
        component={Stack}
        options={{
          tabBarLabel: "Skia",
          headerTitle: "Skia examples",
          tabBarIcon: ({ focused }) => (
            <Heart size={24} weight={focused ? "fill" : "regular"} />
          ),
        }}
      />
      {/* <Tab.Screen
        name="Lists"
        component={ListsOverview}
        options={{
          tabBarLabel: "List",
          headerTitle: "List examples",
          tabBarIcon: ({ focused }) => (
            <List size={24} weight={focused ? "fill" : "regular"} />
          ),
        }}
      /> */}
    </Tab.Navigator>
  );
};

export default BottomTabs;
