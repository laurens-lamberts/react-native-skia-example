import React from 'react';
import {
  Canvas,
  Group,
  RoundedRect,
  Shadow,
  Text,
  useFont,
  useValue,
} from '@shopify/react-native-skia';
import {useWindowDimensions, View} from 'react-native';
import useSetInitialAppPositions from './hooks/useSetInitialAppPositions';
import useSpringboardTouchHandler from './hooks/useSpringboardTouchHandler';
import Wallpaper from './components/Wallpaper';
import useApps from './hooks/useApps';

const Springboard = () => {
  const {width: screenWidth} = useWindowDimensions();
  const appIconSize = screenWidth * 0.175;
  const horizontalPadding = (screenWidth - appIconSize * 4) / 5;

  const {apps} = useApps();
  const widgets = useValue([{name: 'clock'}]);

  useSetInitialAppPositions({apps, horizontalPadding, appIconSize});
  const touchHandler = useSpringboardTouchHandler({apps, appIconSize});

  const FONT_SIZE = 14;
  const LABEL_MARGIN = 4;
  const font = useFont(
    require('./assets/fonts/SFPRODISPLAYREGULAR.otf'),
    FONT_SIZE,
  );
  if (font === null) {
    return null;
  }

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
          {apps.current.map((item, index) => {
            const labelWidth = font.measureText(item.name).width;
            //const labelWidth = font.getTextWidth(item.name); this is not precise?

            return (
              <Group key={index + item.name}>
                <RoundedRect
                  x={item.x}
                  y={item.y}
                  width={appIconSize}
                  height={appIconSize}
                  r={12}
                  color={item.backgroundColor}>
                  <Shadow
                    dx={0}
                    dy={10}
                    blur={10}
                    color={'rgba(11,34,46,0.05)'} // To 0.45 on pickup
                  />
                </RoundedRect>
                <Text
                  text={item.name}
                  x={item.x.current + (appIconSize - labelWidth) / 2}
                  y={item.y.current + appIconSize + FONT_SIZE + LABEL_MARGIN}
                  font={font}
                  color="white"
                  opacity={item.labelOpacity}
                />
              </Group>
            );
          })}
        </Canvas>
      </View>
    </View>
  );
};
export default Springboard;
