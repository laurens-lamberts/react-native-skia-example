import React from 'react';
import {
  Canvas,
  Group,
  useValue,
  useComputedValue,
} from '@shopify/react-native-skia';
import {useWindowDimensions, View} from 'react-native';
import useSetInitialAppPositions from './hooks/useSetInitialAppPositions';
import useSpringboardTouchHandler from './hooks/useSpringboardTouchHandler';
import Wallpaper from './components/Wallpaper';
import useApps from './hooks/useApps';
import useWidgets from './hooks/useWidgets';
import AppComponent from './components/AppComponent';

const Springboard = () => {
  const {width: screenWidth, height: screenHeight} = useWindowDimensions();
  const appIconSize = screenWidth * 0.175;
  const horizontalPadding = (screenWidth - appIconSize * 4) / 5;

  const {apps} = useApps();
  const {widgets} = useWidgets();

  const screensTranslateX = useValue(0);

  useSetInitialAppPositions({apps, horizontalPadding, appIconSize});
  const touchHandler = useSpringboardTouchHandler({
    apps,
    horizontalPadding,
    appIconSize,
    screensTranslateX,
  });

  const transform = useComputedValue(
    () => [
      {
        translateX: screensTranslateX.current,
      },
    ],
    [screensTranslateX],
  );

  return (
    <View
      style={{
        flex: 1,
      }}>
      <View style={{flex: 1}}>
        <Canvas
          style={{
            flex: 1,
          }}
          onTouch={touchHandler}>
          <Wallpaper />
          <Group transform={transform}>
            {apps.current.map((item, index) => (
              <AppComponent
                item={item}
                appIconSize={appIconSize}
                key={item.id}
              />
            ))}
          </Group>
        </Canvas>
      </View>
    </View>
  );
};
export default Springboard;
