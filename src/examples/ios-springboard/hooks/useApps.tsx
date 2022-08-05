import {useValue} from '@shopify/react-native-skia';
import {getRandomColor} from '../helpers/color';
import {AppType} from '../types/AppType';

const useApps = () => {
  const apps = useValue<AppType[]>([
    {
      x: useValue(0),
      y: useValue(0),
      labelOpacity: useValue(1),
      name: 'Mail',
      backgroundColor: useValue(getRandomColor()),
    },
    {
      x: useValue(0),
      y: useValue(0),
      labelOpacity: useValue(1),
      name: 'Notes',
      backgroundColor: useValue(getRandomColor()),
    },
    {
      x: useValue(0),
      y: useValue(0),
      labelOpacity: useValue(1),
      name: 'Camera',
      backgroundColor: useValue(getRandomColor()),
    },
    {
      x: useValue(0),
      y: useValue(0),
      labelOpacity: useValue(1),
      name: 'Settings',
      backgroundColor: useValue(getRandomColor()),
    },
    {
      x: useValue(0),
      y: useValue(0),
      labelOpacity: useValue(1),
      name: 'Maps',
      backgroundColor: useValue(getRandomColor()),
    },
    {
      x: useValue(0),
      y: useValue(0),
      labelOpacity: useValue(1),
      name: 'App Store',
      backgroundColor: useValue(getRandomColor()),
    },
    {
      x: useValue(0),
      y: useValue(0),
      labelOpacity: useValue(1),
      name: 'App Store 2',
      backgroundColor: useValue(getRandomColor()),
    },
    {
      x: useValue(0),
      y: useValue(0),
      labelOpacity: useValue(1),
      name: 'App Store 3',
      backgroundColor: useValue(getRandomColor()),
    },
  ]);
  return {apps};
};

export default useApps;
