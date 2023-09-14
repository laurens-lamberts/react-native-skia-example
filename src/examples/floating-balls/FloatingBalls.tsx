import React from 'react';
import {View, useWindowDimensions} from 'react-native';
import {
  BlurMask,
  Canvas,
  Circle,
  Easing,
  Group,
  RoundedRect,
  rect,
  rrect,
  useTiming,
  useValue,
} from '@shopify/react-native-skia';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
/* import {Gesture, GestureDetector} from 'react-native-gesture-handler'; */
import {useSharedValue} from 'react-native-reanimated';
import LineOfBalls from './LineOfBalls';

const STATIC_NUMBER_OF_BALLS_HORIZONTALLY = 8;
const USE_DYNAMIC_NUMBER_OF_BALLS_HORIZONTALLY = true;
const DEFAULT_AMPLITUDE = 10;
export const DEFAULT_BALL_RADIUS = 20;
export const TRAPEZIUM_EFFECT = 1.2; // lower value is more depth
const NUMBER_OF_DEPTH_ROWS = 7;
const VIEWING_ANGLE = 45; // in degrees

// Make configurable in interface;
// 1. Amplitude
// 2. Speed (timing duration)
// 3. viewing angle

export default function FloatingBalls() {
  const {width: screenWidth, height: screenHeight} = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const offsetY = useTiming(
    {from: 0, to: 1, loop: true, yoyo: false},
    {duration: 2000, easing: Easing.linear},
  );

  const amplitude = useValue(DEFAULT_AMPLITUDE);
  const amplitudeSliderX = useSharedValue(20);

  const dynamicNumberOfBallsHorizontally = Math.floor(
    screenWidth / (DEFAULT_BALL_RADIUS * 2),
  );

  const numberOfBallsHorizontally = USE_DYNAMIC_NUMBER_OF_BALLS_HORIZONTALLY
    ? dynamicNumberOfBallsHorizontally
    : STATIC_NUMBER_OF_BALLS_HORIZONTALLY;

  /* const gesture = Gesture.Pan()
    .onChange(e => {
      amplitudeSliderX.value += e.changeX;
    })
    .onEnd(e => {
      amplitudeSliderX.value = withDecay({
        velocity: e.velocityX,
        clamp: [20, screenWidth - 40],
      });
    }); */

  const lines = React.useMemo(() => {
    const _lines: {yStart: number}[] = new Array(NUMBER_OF_DEPTH_ROWS);
    for (let i = 0; i < NUMBER_OF_DEPTH_ROWS; i++) {
      // calculate yStart based on viewing angle and index i
      const yStart =
        Math.tan((VIEWING_ANGLE * Math.PI) / 180) * DEFAULT_BALL_RADIUS * i;
      console.log(yStart);
      _lines.push({
        yStart,
      });
    }
    return _lines.reverse();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'black',
      }}>
      {/* <GestureDetector gesture={gesture}> */}
      <Canvas
        style={{width: screenWidth, height: screenHeight}}
        mode="continuous">
        <RoundedRect
          rect={rrect(
            rect(0, 0, screenWidth, screenHeight - insets.bottom - 70),
            0,
            0,
          )}
          color={'white'}>
          <BlurMask blur={12} style="normal" />
        </RoundedRect>
        {lines.map((line, index) => (
          <LineOfBalls
            key={index}
            offsetY={offsetY}
            amplitude={amplitude}
            yStart={line.yStart}
            numberOfBallsHorizontally={numberOfBallsHorizontally}
          />
        ))}
        <Group transform={[{translateY: screenHeight - insets.bottom - 120}]}>
          <RoundedRect
            x={20}
            y={0}
            width={screenWidth - 40}
            height={6}
            r={25}
            color="black"
          />
          <Circle cx={amplitudeSliderX} cy={4} r={10} />
        </Group>
      </Canvas>
      {/* </GestureDetector> */}
    </View>
  );
}
