import React from "react";
import {
  Canvas,
  Group,
  useValue,
  useComputedValue,
} from "@shopify/react-native-skia";
import { useWindowDimensions, View } from "react-native";
import useSetInitialAppPositions from "./hooks/useSetInitialAppPositions";
import useSpringboardTouchHandler from "./hooks/useSpringboardTouchHandler";
import Wallpaper from "./components/Wallpaper";
import useApps from "./hooks/useApps";
import useWidgets from "./hooks/useWidgets";
import AppComponent from "./components/AppComponent";
import { APP_ICON_SIZE_SCREENWIDTH_FACTOR } from "./Config";

const Springboard = () => {
  const { width: screenWidth } = useWindowDimensions();
  const appIconSize = screenWidth * APP_ICON_SIZE_SCREENWIDTH_FACTOR;

  // 4 is the amount of icons in a row.
  // 5 is the total amount of spaces horizontally. (3 between the apps, 2 on the sides)
  const horizontalPadding = (screenWidth - appIconSize * 4) / 5;

  const { apps } = useApps();
  const { widgets } = useWidgets();

  const screensTranslateX = useValue(0);
  const moveMode = useValue(false);

  useSetInitialAppPositions({ apps, horizontalPadding, appIconSize });
  const touchHandler = useSpringboardTouchHandler({
    apps,
    horizontalPadding,
    appIconSize,
    screensTranslateX,
    moveMode,
  });

  const transform = useComputedValue(
    () => [{ translateX: screensTranslateX.current }],
    [screensTranslateX]
  );

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <View style={{ flex: 1 }}>
        <Canvas
          style={{
            flex: 1,
          }}
          mode={"continuous"}
          onTouch={touchHandler}
        >
          <Wallpaper />
          <Group transform={transform}>
            {apps.current.map((item) => (
              <AppComponent
                item={item}
                appIconSize={appIconSize}
                key={item.id}
                moveMode={moveMode}
              />
            ))}
          </Group>
        </Canvas>
      </View>
    </View>
  );
};
export default Springboard;
