import {
  Group,
  RoundedRect,
  Shadow,
  Text,
  useFont,
} from '@shopify/react-native-skia';
import React from 'react';
import {AppType} from '../types/AppType';

interface Props {
  item: AppType;
  index: number;
  appIconSize: number;
}

const AppComponent = ({item, index, appIconSize}: Props) => {
  const FONT_SIZE = 14;
  const LABEL_MARGIN = 4;
  const font = useFont(
    require('../assets/fonts/SFPRODISPLAYREGULAR.otf'),
    FONT_SIZE,
  );
  if (font === null) {
    return null;
  }

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
};

export default AppComponent;
