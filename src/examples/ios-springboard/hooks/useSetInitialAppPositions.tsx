import {SkiaMutableValue, vec} from '@shopify/react-native-skia';
import {useEffect, useRef} from 'react';
import {useWindowDimensions} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {AppType} from '../types/AppType';

interface Props {
  apps: SkiaMutableValue<AppType[]>;
  horizontalPadding: number;
  appIconSize: number;
}

const useSetInitialAppPositions = ({
  apps,
  horizontalPadding,
  appIconSize,
}: Props) => {
  const appsPositioned = useRef(false);
  const insets = useSafeAreaInsets();
  const {width: screenWidth} = useWindowDimensions();

  const verticalPadding = horizontalPadding * 1.5;
  const startPos = vec(horizontalPadding, insets.top + horizontalPadding); // this last property is also the horizontalpadding, as we'd like to keep the bounding padding similar

  useEffect(() => {
    // set app positions
    if (appsPositioned.current) return;
    apps.current = apps.current.map((item, index) => {
      const indexOnScreen = apps.current
        .filter(i => i.screen === item.screen)
        .findIndex(a => a.id === item.id);

      let x =
        startPos.x + (indexOnScreen % 4) * (appIconSize + horizontalPadding);
      let y =
        startPos.y +
        (Math.floor(indexOnScreen / 4) % 4) * (appIconSize + verticalPadding);

      // increase the x position depending on the screen
      x += screenWidth * item.screen;

      item.x.current = x;
      item.y.current = y;
      return item;
    });
    appsPositioned.current = true;
  }, [
    appIconSize,
    apps,
    horizontalPadding,
    screenWidth,
    startPos.x,
    startPos.y,
    verticalPadding,
  ]);
};

export default useSetInitialAppPositions;
