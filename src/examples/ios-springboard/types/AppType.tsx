import {SkiaMutableValue} from '@shopify/react-native-skia';

export interface AppType {
  name: string;
  backgroundColor: SkiaMutableValue<string>;
  x: SkiaMutableValue<number>;
  y: SkiaMutableValue<number>;
  labelOpacity: SkiaMutableValue<number>;
}

export interface WidgetType {
  name: string;
  backgroundColor: SkiaMutableValue<string>;
  x: SkiaMutableValue<number>;
  y: SkiaMutableValue<number>;
  labelOpacity: SkiaMutableValue<number>;
}
