import {useValue} from '@shopify/react-native-skia';
import {WidgetType} from '../types/AppType';

const useWidgets = () => {
  const widgets = useValue<WidgetType[]>([{name: 'clock'}]);
  return {widgets};
};

export default useWidgets;
