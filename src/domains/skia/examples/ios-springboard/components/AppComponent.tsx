import {
  Group,
  RoundedRect,
  Shadow,
  Text,
  useFont,
} from "@shopify/react-native-skia";
import React from "react";
import {
  APP_WIGGLE_CYCLE_DURATION,
  APP_WIGGLE_ROTATION_DISTANCE,
} from "../Config";
import { AppType } from "../types/AppType";
import { useLoop } from "@app/hooks/animations";
import { SharedValue, useDerivedValue } from "react-native-reanimated";

interface Props {
  item: AppType;
  appIconSize: number;
  moveMode: SharedValue<boolean>;
}

const AppComponent = ({ item, appIconSize, moveMode }: Props) => {
  const FONT_SIZE = 14;
  const LABEL_MARGIN = 4;

  const font = useFont(
    require("@app/assets/fonts/SFPRODISPLAYREGULAR.otf"),
    FONT_SIZE
  );

  const labelWidth = font?.measureText(item.name)?.width;

  const textX = useDerivedValue(() => {
    return item.x.value + (appIconSize - (labelWidth || 0)) / 2;
  }, [item.x, appIconSize, labelWidth]);

  const textY = useDerivedValue(() => {
    return item.y.value + appIconSize + FONT_SIZE + LABEL_MARGIN;
  }, [item.y, appIconSize]);

  //const clock = useClockValue();
  const rotateAnimation = useLoop({ duration: APP_WIGGLE_CYCLE_DURATION });

  const transform = useDerivedValue(
    () => [
      {
        rotate: moveMode.value
          ? rotateAnimation.value * APP_WIGGLE_ROTATION_DISTANCE -
            APP_WIGGLE_ROTATION_DISTANCE / 2
          : 0,
      },
    ],
    [moveMode, rotateAnimation]
  );

  const origin = useDerivedValue(
    () => ({
      x: item.x.value + appIconSize / 2,
      y: item.y.value + appIconSize / 2,
    }),
    [appIconSize, item.x, item.y]
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
        color={item.backgroundColor}
      >
        <Shadow
          dx={0}
          dy={10}
          blur={10}
          color={"rgba(11,34,46,0.05)"} // To 0.45 on pickup
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
