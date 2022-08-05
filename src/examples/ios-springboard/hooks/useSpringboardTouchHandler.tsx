import {
  Easing,
  runTiming,
  SkiaMutableValue,
  useClockValue,
  useTouchHandler,
  useValue,
  vec,
} from '@shopify/react-native-skia';
import {TimingConfig} from '@shopify/react-native-skia/lib/typescript/src/animation/types';
import {useWindowDimensions} from 'react-native';
import {lightenDarkenColor} from '../../../utils/color';
import {AppType} from '../types/AppType';

const appSnapAnimationConfig: TimingConfig = {
  easing: Easing.out(Easing.exp),
  duration: 620,
};

const DRAG_START_MS = 1400;
const SNAP_TO_SCREEN_TRAVEL_THRESHOLD = 0.3;

interface Props {
  apps: SkiaMutableValue<AppType[]>;
  horizontalPadding: number;
  appIconSize: number;
  screensTranslateX: SkiaMutableValue<number>;
  moveMode: SkiaMutableValue<boolean>;
}

const useSpringboardTouchHandler = ({
  apps,
  horizontalPadding,
  appIconSize,
  screensTranslateX,
  moveMode,
}: Props) => {
  const {width: screenWidth} = useWindowDimensions();

  const clock = useClockValue();
  const touchClockStart = useValue(0);
  const touchedAppIndex = useValue(-1);
  const screenTranslateStartX = useValue(0);
  const touchStartPos = useValue(vec(0, 0));
  const draggingAppIndex = useValue(-1);
  const draggingAppPickupPos = useValue(vec(0, 0));
  const draggingAppOriginalPos = useValue(vec(0, 0));
  const draggingAppSnappedX = useValue(false);
  const draggingAppSnappedY = useValue(false);

  const touchHandler = useTouchHandler({
    onStart: ({x, y}) => {
      // correct x with the screen you're on
      const screenXFactor = screensTranslateX.current / screenWidth + 1;

      touchStartPos.current = vec(x, y);
      screenTranslateStartX.current = screensTranslateX.current;
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
      if (touchedAppIndex.current === -1) {
        // drag the screen
        screensTranslateX.current =
          screenTranslateStartX.current + x - touchStartPos.current.x;
        return;
      }
      let touchedApp = apps.current[touchedAppIndex.current];

      // correct x with the screen you're on
      //x *= Math.round(screensTranslateX.current / screenWidth) + 1;

      if (
        moveMode.current ||
        clock.current - touchClockStart.current > DRAG_START_MS
      ) {
        if (draggingAppIndex.current === -1) {
          // pickup confirmed - executed once
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
            touchedApp = apps.current[touchedAppIndex.current];
            touchedApp.backgroundColor.current = lightenDarkenColor(
              touchedApp.backgroundColor.current,
              10,
            );
          }
          runTiming(touchedApp.labelOpacity, 0, appSnapAnimationConfig);
        } else if (
          moveMode.current ||
          (draggingAppSnappedX.current && draggingAppSnappedY.current)
        ) {
          // dragging the app
          console.log('drag', touchedApp.name);

          touchedApp = apps.current[touchedAppIndex.current];

          touchedApp.x.current = x - draggingAppPickupPos.current.x;
          touchedApp.y.current = y - draggingAppPickupPos.current.y;

          // check collision to make space.
          const otherAppUnderDraggingCursorIndex = apps.current.findIndex(
            a =>
              a.id !== touchedApp.id &&
              a.x.current < x &&
              a.x.current + appIconSize > x &&
              a.y.current < y &&
              a.y.current + appIconSize > y,
          );
          if (otherAppUnderDraggingCursorIndex > -1) {
            // found collision
            const otherAppUnderDraggingCursor =
              apps.current[otherAppUnderDraggingCursorIndex];
            console.log('drag collision', otherAppUnderDraggingCursor.name);

            /* // move it aside
            if (
              Math.round(otherAppUnderDraggingCursor.y.current) ===
              Math.round(draggingAppOriginalPos.current.y)
            ) {*/
            const otherShouldGoRight =
              otherAppUnderDraggingCursor.x.current <
              draggingAppOriginalPos.current.x;
            let otherNewX: number;
            if (otherShouldGoRight) {
              otherNewX =
                otherAppUnderDraggingCursor.x.current +
                appIconSize +
                horizontalPadding;

              // check if this has gotten offscreen, so we should move it to the next row
              if (otherNewX > screenWidth - horizontalPadding) {
                // TODO
                console.log('an app icon should be moved to the next row');
              }
            } else {
              otherNewX =
                otherAppUnderDraggingCursor.x.current -
                appIconSize -
                horizontalPadding;
            }

            if (!otherAppUnderDraggingCursor.isMoving.current) {
              otherAppUnderDraggingCursor.isMoving.current = true;

              // swap the dragging-app starting location to the one we now move.
              draggingAppOriginalPos.current = vec(
                otherAppUnderDraggingCursor.x.current,
                otherAppUnderDraggingCursor.y.current,
              );

              // move the other app
              runTiming(
                otherAppUnderDraggingCursor.x,
                otherNewX,
                appSnapAnimationConfig,
                () => {
                  otherAppUnderDraggingCursor.isMoving.current = false;
                },
              );

              // check if we're left with a gap
              // TODO
            }
          }
        }
        moveMode.current = true;
      }
    },
    onEnd: ({x, y}) => {
      if (touchedAppIndex.current === -1) {
        if (screensTranslateX.current !== screenTranslateStartX.current) {
          // we need to snap to the closest multitude of screenWidth
          // TODO: should actually be based on the amount of horizontal drag travel
          const prevScreenIndex = Math.round(
            screenTranslateStartX.current / screenWidth,
          );
          let newScreensTranslateX = screenWidth;
          const horizontalDragTravel =
            screensTranslateX.current - screenTranslateStartX.current;
          if (
            horizontalDragTravel >
            screenWidth * SNAP_TO_SCREEN_TRAVEL_THRESHOLD
          ) {
            // travelled a fair amount of screen to the right
            newScreensTranslateX = screenWidth * (prevScreenIndex + 1);
          } else if (
            horizontalDragTravel <
            -(screenWidth * SNAP_TO_SCREEN_TRAVEL_THRESHOLD)
          ) {
            newScreensTranslateX = screenWidth * (prevScreenIndex - 1);
          } else {
            newScreensTranslateX = screenWidth * prevScreenIndex;
          }
          //alert();
          //const screenSnapIndex =

          runTiming(
            screensTranslateX,
            newScreensTranslateX,
            appSnapAnimationConfig,
          );
        }
      }
      //if (!moveMode.current) return;

      let touchedApp = apps.current[touchedAppIndex.current];
      if (!touchedApp) {
        // no app was dragged. Disable move-mode.
        moveMode.current = false;
      }

      if (touchedApp) {
        // These stopped working....
        /* runTiming(
          touchedApp.x,
          draggingAppOriginalPos.current.x,
          appSnapAnimationConfig,
        );
        runTiming(
          touchedApp.y,
          draggingAppOriginalPos.current.y,
          appSnapAnimationConfig,
        );
        runTiming(touchedApp.labelOpacity, 1, appSnapAnimationConfig); */
        touchedApp.x.current = draggingAppOriginalPos.current.x;
        touchedApp.y.current = draggingAppOriginalPos.current.y;
        touchedApp.labelOpacity.current = 1;
      }
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
  return touchHandler;
};

export default useSpringboardTouchHandler;
