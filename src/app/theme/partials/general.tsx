import { fontSizes, spaceDefaults } from "./sizes";

export type Theme = {
  name: string;
  fonts: {
    heading: string;
    body: string;
  };
  fontSizes: typeof fontSizes;
  space: typeof spaceDefaults;
  colors: {
    [key: string]: string;
  };
};

const generalPalette = {
  white: "#FFFFFF",
  trueBlack: "#000000",
  gradientGray1: "#AAA",
  gradientGray1_1: "#BBB",
  gradientGray1_2: "#CCC",
};

export const generalDarkPalette = {
  white: "#303338",
  trueBlack: "#FFFFFF",
  gradientGray1: "#AAA",
  gradientGray1_1: "#BBB",
  gradientGray1_2: "#CCC",
};

export type AllColors = keyof typeof generalPalette | "primary";

export default generalPalette;
