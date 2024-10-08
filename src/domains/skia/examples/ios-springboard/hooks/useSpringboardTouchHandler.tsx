import { useClock, useTouchHandler, vec } from "@shopify/react-native-skia";
import { useWindowDimensions } from "react-native";
import { lightenDarkenColor } from "../../../../../utils/color";
import {
  APP_DRAG_START_DARKEN_PERCENTAGE,
  APP_DRAG_START_MS,
  SCREEN_DRAG_SNAP_TO_SCREEN_TRAVEL_THRESHOLD,
} from "../Config";
import { AppType } from "../types/AppType";
import {
  Easing,
  SharedValue,
  useSharedValue,
  withTiming,
  WithTimingConfig,
} from "react-native-reanimated";

const appSnapAnimationConfig: WithTimingConfig = {
  easing: Easing.out(Easing.exp),
  duration: 620,
};

interface Props {
  apps: AppType[];
  horizontalPadding: number;
  appIconSize: number;
  screensTranslateX: SharedValue<number>;
  moveMode: SharedValue<boolean>;
}

const useSpringboardTouchHandler = ({
  apps,
  horizontalPadding,
  appIconSize,
  screensTranslateX,
  moveMode,
}: Props) => {
  const { width: screenWidth } = useWindowDimensions();

  const clock = useClock();
  const touchClockStart = useSharedValue(0);
  const touchedAppIndex = useSharedValue(-1);
  const screenTranslateStartX = useSharedValue(0);
  const touchStartPos = useSharedValue(vec(0, 0));
  const draggingAppIndex = useSharedValue(-1);
  const draggingAppPickupPos = useSharedValue(vec(0, 0));
  const draggingAppOriginalPos = useSharedValue(vec(0, 0));
  const draggingAppSnappedX = useSharedValue(false);
  const draggingAppSnappedY = useSharedValue(false);

  const touchHandler = useTouchHandler({
    onStart: ({ x, y }) => {
      // correct x with the screen you're on
      const screenXFactor = screensTranslateX.value / screenWidth + 1;

      touchStartPos.value = vec(x, y);
      screenTranslateStartX.value = screensTranslateX.value;
      const newTouchedAppIndex = apps.findIndex(
        (a) =>
          a.x.value < x &&
          a.x.value + appIconSize > x &&
          a.y.value < y &&
          a.y.value + appIconSize > y
      );

      if (newTouchedAppIndex > -1) {
        touchedAppIndex.value = newTouchedAppIndex;
        let touchedApp = apps[touchedAppIndex.value];

        draggingAppOriginalPos.value = vec(
          touchedApp.x.value,
          touchedApp.y.value
        );
        draggingAppPickupPos.value = vec(
          x - touchedApp.x.value,
          y - touchedApp.y.value
        );

        if (!moveMode.value) {
          // show that counting has started to enable moveMode
          touchedApp.backgroundColor.value = lightenDarkenColor(
            touchedApp.backgroundColor.value,
            -APP_DRAG_START_DARKEN_PERCENTAGE
          );
        }
      }

      touchClockStart.value = clock.value;
    },
    onActive: ({ x, y }) => {
      if (touchedAppIndex.value === -1) {
        // drag the screen
        screensTranslateX.value =
          screenTranslateStartX.value + x - touchStartPos.value.x;
        return;
      }
      let touchedApp = apps[touchedAppIndex.value];

      // correct x with the screen you're on
      //x *= Math.round(screensTranslateX.value / screenWidth) + 1;

      if (
        moveMode.value ||
        clock.value - touchClockStart.value > APP_DRAG_START_MS
      ) {
        if (draggingAppIndex.value === -1) {
          // pickup confirmed - executed once
          draggingAppIndex.value = touchedAppIndex.value;

          if (!moveMode.value) {
            moveMode.value = true;
            touchedApp.x = withTiming(
              x - draggingAppPickupPos.value.x,
              appSnapAnimationConfig,
              () => {
                draggingAppSnappedX.value = true;
              }
            );
            touchedApp.y = withTiming(
              y - draggingAppPickupPos.value.y,
              appSnapAnimationConfig,
              () => {
                draggingAppSnappedY.value = true;
              }
            );
            touchedApp = apps[touchedAppIndex.value];
            // TODO: refactor with original color
            touchedApp.backgroundColor.value = lightenDarkenColor(
              touchedApp.backgroundColor.value,
              APP_DRAG_START_DARKEN_PERCENTAGE
            );
          }
          touchedApp.labelOpacity = withTiming(0, appSnapAnimationConfig);
        } else if (
          moveMode.value ||
          (draggingAppSnappedX.value && draggingAppSnappedY.value)
        ) {
          // dragging the app
          console.log("drag", touchedApp.name);

          touchedApp = apps[touchedAppIndex.value];

          touchedApp.x.value = x - draggingAppPickupPos.value.x;
          touchedApp.y.value = y - draggingAppPickupPos.value.y;

          // check collision to make space.
          const otherAppUnderDraggingCursorIndex = apps.findIndex(
            (a) =>
              a.id !== touchedApp.id &&
              a.x.value < x &&
              a.x.value + appIconSize > x &&
              a.y.value < y &&
              a.y.value + appIconSize > y
          );
          if (otherAppUnderDraggingCursorIndex > -1) {
            // found collision
            const otherAppUnderDraggingCursor =
              apps[otherAppUnderDraggingCursorIndex];
            console.log("drag collision", otherAppUnderDraggingCursor.name);

            const otherShouldGoRight =
              otherAppUnderDraggingCursor.x.value <
              draggingAppOriginalPos.value.x;
            let otherNewX: number;
            if (otherShouldGoRight) {
              otherNewX =
                otherAppUnderDraggingCursor.x.value +
                appIconSize +
                horizontalPadding;

              // check if this has gotten offscreen, so we should move it to the next row
              if (otherNewX > screenWidth - horizontalPadding) {
                // TODO
                console.log("an app icon should be moved to the next row");
              }
            } else {
              otherNewX =
                otherAppUnderDraggingCursor.x.value -
                appIconSize -
                horizontalPadding;
            }

            if (!otherAppUnderDraggingCursor.isMoving.value) {
              otherAppUnderDraggingCursor.isMoving.value = true;

              // swap the dragging-app starting location to the one we now move.
              draggingAppOriginalPos.value = vec(
                otherAppUnderDraggingCursor.x.value,
                otherAppUnderDraggingCursor.y.value
              );

              // move the other app
              otherAppUnderDraggingCursor.x = withTiming(
                otherNewX,
                appSnapAnimationConfig,
                () => {
                  otherAppUnderDraggingCursor.isMoving.value = false;
                }
              );

              // check if we're left with a gap
              // TODO
            }
          }
        }
      }
    },
    onEnd: ({ x, y }) => {
      if (touchedAppIndex.value === -1) {
        if (screensTranslateX.value !== screenTranslateStartX.value) {
          // we need to snap to the closest multitude of screenWidth
          // TODO: should actually be based on the amount of horizontal drag travel
          const prevScreenIndex = Math.round(
            screenTranslateStartX.value / screenWidth
          );
          let newScreensTranslateX = screenWidth;
          const horizontalDragTravel =
            screensTranslateX.value - screenTranslateStartX.value;
          if (
            horizontalDragTravel >
              screenWidth * SCREEN_DRAG_SNAP_TO_SCREEN_TRAVEL_THRESHOLD &&
            prevScreenIndex < 0
          ) {
            // travelled a fair amount of screen to the right
            newScreensTranslateX = screenWidth * (prevScreenIndex + 1);
          } else if (
            horizontalDragTravel <
              -(screenWidth * SCREEN_DRAG_SNAP_TO_SCREEN_TRAVEL_THRESHOLD) &&
            prevScreenIndex > -1
          ) {
            newScreensTranslateX = screenWidth * (prevScreenIndex - 1);
          } else {
            newScreensTranslateX = screenWidth * prevScreenIndex;
          }
          screensTranslateX.value = withTiming(
            newScreensTranslateX,
            appSnapAnimationConfig
          );
        }
      }
      //if (!moveMode.value) return;
      let touchedApp = apps[touchedAppIndex.value];
      if (!touchedApp) {
        // no app was dragged. Disable move-mode.
        // TODO: actually not correct. Shoud check draggingAppIndex
        moveMode.value = false;
      }

      if (touchedAppIndex.value > -1 && draggingAppIndex.value === -1) {
        // we touched an app, but didn't wait until dragging threshold.
        // abort.
        // TODO: refactor with original color
        touchedApp.backgroundColor.value = lightenDarkenColor(
          touchedApp.backgroundColor.value,
          APP_DRAG_START_DARKEN_PERCENTAGE
        );
      }

      if (touchedApp) {
        touchedApp.x = withTiming(
          draggingAppOriginalPos.value.x,
          appSnapAnimationConfig
        );
        touchedApp.y = withTiming(
          draggingAppOriginalPos.value.y,
          appSnapAnimationConfig
        );
        touchedApp.labelOpacity = withTiming(1, appSnapAnimationConfig);
      }
      // reset
      touchedAppIndex.value = -1;
      draggingAppIndex.value = -1;
      draggingAppPickupPos.value = vec(0, 0);
      draggingAppOriginalPos.value = vec(0, 0);
      draggingAppSnappedX.value = false;
      draggingAppSnappedY.value = false;
      touchClockStart.value = 0;
    },
  });
  return touchHandler;
};

export default useSpringboardTouchHandler;
