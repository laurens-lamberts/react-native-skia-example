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
  appIconSize: number;
}

const useSpringboardTouchHandler = ({apps, appIconSize}: Props) => {
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
          touchedApp.x.current = x - draggingAppPickupPos.current.x;
          touchedApp.y.current = y - draggingAppPickupPos.current.y;
          console.log('drag', touchedApp.name);
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
  return touchHandler;
};

export default useSpringboardTouchHandler;
