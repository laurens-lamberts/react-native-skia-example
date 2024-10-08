import { generalDarkPalette, Theme } from "./partials/general";
import themeLight from "./themeFileLight";

const themeDark: Theme = {
  ...themeLight,
  colors: {
    ...themeLight.colors,
    ...generalDarkPalette,
  },
};

export default themeDark;
