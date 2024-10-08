import React from "react";
import { Text } from "react-native";

interface TabBarIconProps {
  focused: boolean;
  iconFocused: string;
  iconUnfocused: string;
  showBadge?: boolean;
}
const TabBarIcon = ({
  focused,
  iconFocused,
  iconUnfocused,
  showBadge,
}: TabBarIconProps) => {
  return <Text>*</Text>;
};

export default TabBarIcon;
