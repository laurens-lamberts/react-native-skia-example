import React from 'react';
import {
  Canvas,
  Easing,
  Group,
  RoundedRect,
  runTiming,
  Shadow,
  Text,
  useClockValue,
  useFont,
  useTouchHandler,
  useValue,
  vec,
} from '@shopify/react-native-skia';
import {useWindowDimensions, View} from 'react-native';
import {TimingConfig} from '@shopify/react-native-skia/lib/typescript/src/animation/types';
import useSetInitialAppPositions from './hooks/useSetInitialAppPositions';
import Wallpaper from './components/Wallpaper';
import {lightenDarkenColor} from '../../utils/color';
import useApps from './hooks/useApps';

const appSnapAnimationConfig: TimingConfig = {
  easing: Easing.out(Easing.exp),
  duration: 620,
};

const DRAG_START_MS = 1400;

const Springboard = () => {
  const {width: screenWidth} = useWindowDimensions();

  const clock = useClockValue();

  const moveMode = useValue(false);

  const touchClockStart = useValue(0);
  const touchedAppIndex = useValue(-1);
  const draggingAppIndex = useValue(-1);
  const draggingAppPickupPos = useValue(vec(0, 0));
  const draggingAppOriginalPos = useValue(vec(0, 0));
  const draggingAppSnappedX = useValue(false);
  const draggingAppSnappedY = useValue(false);

  const appIconSize = screenWidth * 0.175;
  const horizontalPadding = (screenWidth - appIconSize * 4) / 5;

  const {apps} = useApps();
  const widgets = useValue([{name: 'clock'}]);

  useSetInitialAppPositions({apps, horizontalPadding, appIconSize});

  const touchHandler = useTouchHandler({
    onStart: ({x, y}) => {
      const newTouchedAppIndex = apps.current.findIndex(
        a =>
          a.x.current < x &&
          a.x.current + appIconSize > x &&
          a.y.current < y &&
          a.y.current + appIconSize > y,
      );

      if (newTouchedAppIndex > -1) {
        touchedAppIndex.current = newTouchedAppIndex;
        let touchedApp = apps.current[touchedAppIndex.current];

        draggingAppOriginalPos.current = vec(
          touchedApp.x.current,
          touchedApp.y.current,
        );
        draggingAppPickupPos.current = vec(
          x - touchedApp.x.current,
          y - touchedApp.y.current,
        );

        if (!moveMode.current) {
          touchedApp.backgroundColor.current = lightenDarkenColor(
            touchedApp.backgroundColor.current,
            -10,
          );
        }
      }

      touchClockStart.current = clock.current;
    },
    onActive: ({x, y}) => {
      if (touchedAppIndex.current === -1) return;
      let touchedApp = apps.current[touchedAppIndex.current];

      // pickup confirmed - executed once
      if (
        moveMode.current ||
        clock.current - touchClockStart.current > DRAG_START_MS
      ) {
        if (draggingAppIndex.current === -1) {
          draggingAppIndex.current = touchedAppIndex.current;

          if (!moveMode.current) {
            runTiming(
              touchedApp.x,
              x - draggingAppPickupPos.current.x,
              appSnapAnimationConfig,
              () => {
                draggingAppSnappedX.current = true;
              },
            );
            runTiming(
              touchedApp.y,
              y - draggingAppPickupPos.current.y,
              appSnapAnimationConfig,
              () => {
                draggingAppSnappedY.current = true;
              },
            );
          }
          runTiming(touchedApp.labelOpacity, 0, appSnapAnimationConfig);
        } else if (
          moveMode.current ||
          (draggingAppSnappedX.current && draggingAppSnappedY.current)
        ) {
          touchedApp = apps.current[touchedAppIndex.current];
          console.log('drag', touchedApp.name);
          touchedApp.x.current = x - draggingAppPickupPos.current.x;
          touchedApp.y.current = y - draggingAppPickupPos.current.y;
        }
        moveMode.current = true;
      }
    },
    onEnd: ({x, y}) => {
      if (!moveMode.current) return;

      let touchedApp = apps.current[touchedAppIndex.current];
      if (!touchedApp) {
        moveMode.current = false;
        return;
      }
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
      touchedAppIndex.current = -1;
      draggingAppIndex.current = -1;
      draggingAppPickupPos.current = vec(0, 0);
      draggingAppOriginalPos.current = vec(0, 0);
      draggingAppSnappedX.current = false;
      draggingAppSnappedY.current = false;
      touchClockStart.current = 0;
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
