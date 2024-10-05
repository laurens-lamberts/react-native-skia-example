import { SkiaMutableValue } from "@shopify/react-native-skia";

export interface AppType {
  id: string;
  screen: number; // which screen is the app on
  name: string; // the name of the app, shown as label
  backgroundColor: SharedValue<string>;
  x: SharedValue<number>;
  y: SharedValue<number>;
  labelOpacity: SharedValue<number>; // used to show-hide the label on pickup
  isMoving: SharedValue<boolean>; // if this icon is currently being animated
}

export interface WidgetType {
  name: string;
  backgroundColor: SharedValue<string>;
  x: SharedValue<number>;
  y: SharedValue<number>;
  labelOpacity: SharedValue<number>;
}
