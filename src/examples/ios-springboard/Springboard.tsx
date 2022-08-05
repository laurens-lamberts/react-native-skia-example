import React, {useState} from 'react';
import {
  Canvas,
  Easing,
  Group,
  RoundedRect,
  runTiming,
  Shadow,
  Text,
  useFont,
  useTouchHandler,
  useValue,
  vec,
} from '@shopify/react-native-skia';
import {useWindowDimensions, View} from 'react-native';
import {TimingConfig} from '@shopify/react-native-skia/lib/typescript/src/animation/types';
import useSetInitialAppPositions from './hooks/useSetInitialAppPositions';
import {AppType} from './types/AppType';

const getRandomColor = () => {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const appSnapAnimationConfig: TimingConfig = {
  easing: Easing.out(Easing.exp),
  duration: 620,
};

const Springboard = () => {
  const apps = useValue<AppType[]>([
    {
      x: useValue(0),
      y: useValue(0),
      labelOpacity: useValue(1),
      name: 'Mail',
      backgroundColor: getRandomColor(),
    },
    {
      x: useValue(0),
      y: useValue(0),
      labelOpacity: useValue(1),
      name: 'Notes',
      backgroundColor: getRandomColor(),
    },
    {
      x: useValue(0),
      y: useValue(0),
      labelOpacity: useValue(1),
      name: 'Camera',
      backgroundColor: getRandomColor(),
    },
    {
      x: useValue(0),
      y: useValue(0),
      labelOpacity: useValue(1),
      name: 'Settings',
      backgroundColor: getRandomColor(),
    },
    {
      x: useValue(0),
      y: useValue(0),
      labelOpacity: useValue(1),
      name: 'Maps',
      backgroundColor: getRandomColor(),
    },
    {
      x: useValue(0),
      y: useValue(0),
      labelOpacity: useValue(1),
      name: 'App Store',
      backgroundColor: getRandomColor(),
    },
    {
      x: useValue(0),
      y: useValue(0),
      labelOpacity: useValue(1),
      name: 'App Store 2',
      backgroundColor: getRandomColor(),
    },
    {
      x: useValue(0),
      y: useValue(0),
      labelOpacity: useValue(1),
      name: 'App Store 3',
      backgroundColor: getRandomColor(),
    },
  ]);
  const [widgets, setWidgets] = useState([{name: 'clock'}]);
  const {width: screenWidth} = useWindowDimensions();

  const draggingAppIndex = useValue(-1);
  const draggingAppPickupPos = useValue(vec(0, 0));
  const draggingAppOriginalPos = useValue(vec(0, 0));

  const appIconSize = screenWidth * 0.175;
  const horizontalPadding = (screenWidth - appIconSize * 4) / 5;

  useSetInitialAppPositions({apps, horizontalPadding, appIconSize});

  const touchHandler = useTouchHandler({
    onActive: ({x, y}) => {
      let touchedAppIndex = draggingAppIndex.current;
      let touchedApp: AppType;
      if (draggingAppIndex.current === -1) {
        touchedAppIndex = apps.current.findIndex(
          a =>
            a.x.current < x &&
            a.x.current + appIconSize > x &&
            a.y.current < y &&
            a.y.current + appIconSize > y,
        );
        if (touchedAppIndex === -1) return;

        // Pickup
        touchedApp = apps.current[touchedAppIndex];
        draggingAppIndex.current = touchedAppIndex;
        draggingAppPickupPos.current = vec(
          x - touchedApp.x.current,
          y - touchedApp.y.current,
        );
        draggingAppOriginalPos.current = vec(
          touchedApp.x.current,
          touchedApp.y.current,
        );
        runTiming(touchedApp.labelOpacity, 0, appSnapAnimationConfig);
      }
      touchedApp = apps.current[touchedAppIndex];

      //alert(selectedApp.name);
      touchedApp.x.current = x - draggingAppPickupPos.current.x;
      touchedApp.y.current = y - draggingAppPickupPos.current.y;
    },
    onEnd: ({x, y}) => {
      const touchedApp = apps.current[draggingAppIndex.current];
      runTiming(
        touchedApp.x,
        draggingAppOriginalPos.current.x,
        appSnapAnimationConfig,
      );
      runTiming(
        touchedApp.y,
        draggingAppOriginalPos.current.y,
        appSnapAnimationConfig,
      );
      runTiming(touchedApp.labelOpacity, 1, appSnapAnimationConfig);

      // reset
      draggingAppIndex.current = -1;
      draggingAppPickupPos.current = vec(0, 0);
      draggingAppOriginalPos.current = vec(0, 0);
    },
  });

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
        backgroundColor: 'lightblue',
      }}>
      <View style={{flex: 1}}>
        <Canvas
          style={{
            flex: 1,
          }}
          onTouch={touchHandler}>
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
