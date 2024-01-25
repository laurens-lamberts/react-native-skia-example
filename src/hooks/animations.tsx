import { useEffect } from "react";
import {
  AnimatableValue,
  Easing,
  EasingFunction,
  EasingFunctionFactory,
  WithTimingConfig,
  cancelAnimation,
  runOnJS,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { SpringConfig } from "react-native-reanimated/lib/typescript/reanimated2/animation/springUtils";

export const useLoop = ({
  duration,
  from,
  to,
  easing,
  reverse,
}: {
  duration: number;
  from?: number;
  to?: number;
  easing: EasingFunction | EasingFunctionFactory | undefined;
  reverse?: boolean;
}) => {
  const progress = useSharedValue(from || 0);
  useEffect(() => {
    progress.value = withRepeat(
      withTiming(to || 1, {
        duration,
        easing: easing || Easing.inOut(Easing.ease),
      }),
      -1,
      reverse
    );
    return () => {
      cancelAnimation(progress);
    };
  }, [duration, easing, progress, to]);
  return progress;
};

export const useSpring = (
  value: number,
  userConfig?: SpringConfig,
  callback?: () => void
) => {
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withTiming(value, userConfig, () => {
      if (callback) runOnJS(callback)();
    });
    return () => {
      cancelAnimation(progress);
    };
  }, [progress, value, callback, userConfig]);
  return progress;
};

export const useTiming = (
  value: number | AnimatableValue,
  userConfig?: WithTimingConfig,
  callback?: () => void
) => {
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withTiming(value, userConfig, () => {
      if (callback) runOnJS(callback)();
    });
    return () => {
      cancelAnimation(progress);
    };
  }, [progress, value, callback, userConfig]);
  return progress;
};

export const runSpring = (
  value: number,
  userConfig?: SpringConfig,
  callback?: () => void
) => {
  const progress = useSharedValue(0);
  progress.value = withSpring(value, userConfig, () => {
    if (callback) runOnJS(callback)();
  });
  return () => {
    cancelAnimation(progress);
  };
};
