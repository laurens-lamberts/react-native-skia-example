import React, { useEffect, useMemo, useState } from "react";
import { ColorSchemeName, useColorScheme } from "react-native";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import themeLight from "../theme/themeFileLight";
import { Theme } from "../theme/partials/general";
import themeDark from "../theme/themeFileDark";
import { STORAGE_KEYS } from "../config/storagekeys";

export type APPEARANCE_OPTIONS = "auto" | ColorSchemeName;

export const ThemeContext = React.createContext<{
  theme: Theme;
  appAppearanceMode: APPEARANCE_OPTIONS;
  setAppAppearanceMode: (mode: APPEARANCE_OPTIONS) => void;
}>({
  theme: themeLight,
  appAppearanceMode: undefined,
  setAppAppearanceMode: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { setItem, removeItem, getItem } = useAsyncStorage(
    STORAGE_KEYS.APPEARANCE_MODE
  );
  const [appAppearanceMode, setAppAppearanceMode] =
    useState<APPEARANCE_OPTIONS>();

  const userAppearanceMode = useColorScheme();

  const theme = useMemo(() => {
    if (appAppearanceMode === "auto") {
      return userAppearanceMode === "dark" ? themeDark : themeLight;
    }
    return appAppearanceMode === "dark" ? themeDark : themeLight;
  }, [appAppearanceMode, userAppearanceMode, themeDark, themeLight]);

  const loadAppearanceMode = async () => {
    const mode = await getItem();
    setAppAppearanceMode(mode as APPEARANCE_OPTIONS);
  };
  const saveAppearanceMode = async (mode: APPEARANCE_OPTIONS) => {
    !!mode && setItem(mode);
  };

  useEffect(() => {
    if (!appAppearanceMode) {
      loadAppearanceMode();
    } else {
      saveAppearanceMode(appAppearanceMode);
    }
  }, [appAppearanceMode, userAppearanceMode]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        appAppearanceMode: appAppearanceMode,
        setAppAppearanceMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
