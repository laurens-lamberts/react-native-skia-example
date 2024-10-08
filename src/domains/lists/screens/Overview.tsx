import { View, Text } from "react-native";
import React from "react";
import useTheme from "@app/hooks/useTheme";

const ListsOverview = () => {
  const theme = useTheme();
  return (
    <View
      style={{
        padding: theme.space.m,
        gap: theme.space.m,
      }}
    >
      <Text>Item1</Text>
      <Text>Item2</Text>
    </View>
  );
};

export default ListsOverview;
