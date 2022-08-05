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
import {lightenDarkenColor} from '../../../utils/color';
import {AppType} from '../types/AppType';

const appSnapAnimationConfig: TimingConfig = {
  easing: Easing.out(Easing.exp),
  duration: 620,
};

const DRAG_START_MS = 1400;

interface Props {
  apps: SkiaMutableValue<AppType[]>;
  horizontalPadding: number;
  appIconSize: number;
}

const useSpringboardTouchHandler = ({
  apps,
  horizontalPadding,
  appIconSize,
}: Props) => {
  const clock = useClockValue();
  const moveMode = useValue(false);
  const touchClockStart = useValue(0);
  const touchedAppIndex = useValue(-1);
  const draggingAppIndex = useValue(-1);
  const draggingAppPickupPos = useValue(vec(0, 0));
  const draggingAppOriginalPos = useValue(vec(0, 0));
  const draggingAppSnappedX = useValue(false);
  const draggingAppSnappedY = useValue(false);

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
            ) {
              // same y level */
            const otherShouldGoRight =
              otherAppUnderDraggingCursor.x.current <
              draggingAppOriginalPos.current.x;
            let otherNewX: number;
            if (otherShouldGoRight) {
              otherNewX =
                otherAppUnderDraggingCursor.x.current +
                appIconSize +
                horizontalPadding;
            } else {
              otherNewX =
                otherAppUnderDraggingCursor.x.current -
                appIconSize -
                horizontalPadding;
            }
            runTiming(
              otherAppUnderDraggingCursor.x,
              otherNewX,
              appSnapAnimationConfig,
            );
            /* } else {
              // other y level

            } */
          }
        }
        moveMode.current = true;
      }
    },
    onEnd: ({x, y}) => {
      if (!moveMode.current) return;
      if (touchedAppIndex.current === -1) return;

      let touchedApp = apps.current[touchedAppIndex.current];
      if (!touchedApp) {
        moveMode.current = false;
        return;
      }

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
