import {useValue} from '@shopify/react-native-skia';
import {getRandomColor} from '../helpers/color';
import {AppType} from '../types/AppType';

const useApps = () => {
  const apps = useValue<AppType[]>([
    {
      id: 'com.app.mail',
      x: useValue(0),
      y: useValue(0),
      labelOpacity: useValue(1),
      name: 'Mail',
      backgroundColor: useValue(getRandomColor()),
      isMoving: useValue(false),
    },
    {
      id: 'com.app.notes',
      x: useValue(0),
      y: useValue(0),
      labelOpacity: useValue(1),
      name: 'Notes',
      backgroundColor: useValue(getRandomColor()),
      isMoving: useValue(false),
    },
    {
      id: 'com.app.camera',
      x: useValue(0),
      y: useValue(0),
      labelOpacity: useValue(1),
      name: 'Camera',
      backgroundColor: useValue(getRandomColor()),
      isMoving: useValue(false),
    },
    {
      id: 'com.app.settings',
      x: useValue(0),
      y: useValue(0),
      labelOpacity: useValue(1),
      name: 'Settings',
      backgroundColor: useValue(getRandomColor()),
      isMoving: useValue(false),
    },
    {
      id: 'com.app.maps',
      x: useValue(0),
      y: useValue(0),
      labelOpacity: useValue(1),
      name: 'Maps',
      backgroundColor: useValue(getRandomColor()),
      isMoving: useValue(false),
    },
    {
      id: 'com.app.appstore',
      x: useValue(0),
      y: useValue(0),
      labelOpacity: useValue(1),
      name: 'App Store',
      backgroundColor: useValue(getRandomColor()),
      isMoving: useValue(false),
    },
    {
      id: 'com.app.appstore2',
      x: useValue(0),
      y: useValue(0),
      labelOpacity: useValue(1),
      name: 'App Store 2',
      backgroundColor: useValue(getRandomColor()),
      isMoving: useValue(false),
    },
    {
      id: 'com.app.appstore3',
      x: useValue(0),
      y: useValue(0),
      labelOpacity: useValue(1),
      name: 'App Store 3',
      backgroundColor: useValue(getRandomColor()),
      isMoving: useValue(false),
    },
    {
      id: 'com.app.appstore4',
      x: useValue(0),
      y: useValue(0),
      labelOpacity: useValue(1),
      name: 'App Store 4',
      backgroundColor: useValue(getRandomColor()),
      isMoving: useValue(false),
    },
  ]);
  return {apps};
};

export default useApps;
