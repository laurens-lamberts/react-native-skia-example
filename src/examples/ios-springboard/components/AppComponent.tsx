import {
  Group,
  RoundedRect,
  Shadow,
  SkiaMutableValue,
  Text,
  useComputedValue,
  useFont,
  useLoop,
} from '@shopify/react-native-skia';
import React from 'react';
import {
  APP_WIGGLE_CYCLE_DURATION,
  APP_WIGGLE_ROTATION_DISTANCE,
} from '../Config';
import {AppType} from '../types/AppType';

interface Props {
  item: AppType;
  appIconSize: number;
  moveMode: SkiaMutableValue<boolean>;
}

const AppComponent = ({item, appIconSize, moveMode}: Props) => {
  const FONT_SIZE = 14;
  const LABEL_MARGIN = 4;

  const font = useFont(
    require('../assets/fonts/SFPRODISPLAYREGULAR.otf'),
    FONT_SIZE,
  );
  const labelWidth = font?.measureText(item.name).width;
  //const labelWidth = font.getTextWidth(item.name); this is not precise?

  const textX = useComputedValue(() => {
    return item.x.current + (appIconSize - (labelWidth || 0)) / 2;
  }, [appIconSize, item.x, labelWidth]);
  const textY = useComputedValue(() => {
    return item.y.current + appIconSize + FONT_SIZE + LABEL_MARGIN;
  }, [appIconSize, item.y]);

  //const clock = useClockValue();
  const rotateAnimation = useLoop({duration: APP_WIGGLE_CYCLE_DURATION});

  const transform = useComputedValue(
    () => [
      {
        rotate: moveMode.current
          ? rotateAnimation.current * APP_WIGGLE_ROTATION_DISTANCE -
            APP_WIGGLE_ROTATION_DISTANCE / 2
          : 0,
      },
    ],
    [moveMode, rotateAnimation],
  );

  const origin = useComputedValue(
    () => ({
      x: item.x.current + appIconSize / 2,
      y: item.y.current + appIconSize / 2,
    }),
    [appIconSize, item.x, item.y],
  );

  if (font === null) {
    return null;
  }

  return (
    <Group key={item.id} origin={origin} transform={transform}>
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
        x={textX}
        y={textY}
        font={font}
        color="white"
        opacity={item.labelOpacity}
      />
    </Group>
  );
};

export default AppComponent;
