import { View, Text } from "react-native";
import React from "react";
import useTheme from "@app/hooks/useTheme";

const ListsOverview = () => {
  const theme = useTheme();
  return (
    <View
      style={{
        padding: theme.space.m,
      }}
    >
      <Text>ListsOverview</Text>
      <Text>ListsOverview2</Text>
    </View>
  );
};

export default ListsOverview;
