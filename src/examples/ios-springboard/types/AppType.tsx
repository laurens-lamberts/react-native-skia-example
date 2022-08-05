import {SkiaMutableValue} from '@shopify/react-native-skia';

export interface AppType {
  id: string;
  screen: number; // which screen is the app on
  name: string; // the name of the app, shown as label
  backgroundColor: SkiaMutableValue<string>;
  x: SkiaMutableValue<number>;
  y: SkiaMutableValue<number>;
  labelOpacity: SkiaMutableValue<number>; // used to show-hide the label on pickup
  isMoving: SkiaMutableValue<boolean>; // if this icon is currently being animated
}

export interface WidgetType {
  name: string;
  backgroundColor: SkiaMutableValue<string>;
  x: SkiaMutableValue<number>;
  y: SkiaMutableValue<number>;
  labelOpacity: SkiaMutableValue<number>;
}
