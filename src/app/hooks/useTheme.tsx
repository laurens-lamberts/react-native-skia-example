import { View, Text } from "react-native";
import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeProvider";

const useTheme = () => {
  const { theme } = useContext(ThemeContext);
  return theme;
};

export default useTheme;
