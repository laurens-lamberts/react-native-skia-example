import {SkiaMutableValue} from '@shopify/react-native-skia';

export interface AppType {
  name: string;
  backgroundColor: string;
  x: SkiaMutableValue<number>;
  y: SkiaMutableValue<number>;
  labelOpacity: SkiaMutableValue<number>;
}
