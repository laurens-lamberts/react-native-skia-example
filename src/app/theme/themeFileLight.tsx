import generalPalette, { Theme } from "./partials/general";
import { spaceDefaults, fontSizes } from "./partials/sizes";

const customPalette = {};

const themeLight: Theme = {
  name: "ThemeLight",
  fonts: {
    heading: "Arial",
    body: "Arial",
  },
  colors: {
    ...generalPalette,
    ...customPalette,
  },
  fontSizes,
  space: spaceDefaults,
} as const;

export default themeLight;
