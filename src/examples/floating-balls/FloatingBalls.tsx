import React from 'react';
import {Text, View, useWindowDimensions} from 'react-native';
import {
  BlurMask,
  Canvas,
  Easing,
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
const VIEWING_ANGLE_VERTICAL = 45; // in degrees
const VIEWING_ANGLE_HORIZONTAL = -7; // in degrees

// Make configurable in interface;
// 1. Amplitude
// 2. Speed (timing duration)
// 3. viewing angle (both horizontal and vertical)

export default function FloatingBalls() {
  const {width: screenWidth, height: screenHeight} = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const offsetY = useTiming(
    {from: 0, to: 1, loop: true, yoyo: false},
    {duration: 2000, easing: Easing.linear},
  );

  const amplitude = useValue(DEFAULT_AMPLITUDE);
  const amplitudeSliderX = useSharedValue(20);

  //const viewingAngleVertical = useValue(VIEWING_ANGLE_VERTICAL);
  //const viewingAngleHorizontal = useValue(VIEWING_ANGLE_HORIZONTAL);

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
    const _lines: {yStart: number; xStart: number}[] = new Array(
      NUMBER_OF_DEPTH_ROWS,
    );
    for (let i = 0; i < NUMBER_OF_DEPTH_ROWS; i++) {
      // calculate yStart based on viewing angle and index i
      const yStart =
        Math.tan((VIEWING_ANGLE_VERTICAL * Math.PI) / 180) *
        DEFAULT_BALL_RADIUS *
        i;
      console.log(yStart);
      _lines.push({
        yStart,
        xStart:
          Math.tan((VIEWING_ANGLE_HORIZONTAL * Math.PI) / 180) *
          DEFAULT_BALL_RADIUS *
          i,
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
            xStart={line.xStart}
            numberOfBallsHorizontally={numberOfBallsHorizontally}
          />
        ))}
        {/* <Group transform={[{translateY: screenHeight - insets.bottom - 120}]}>
          <RoundedRect
            x={20}
            y={0}
            width={screenWidth - 40}
            height={6}
            r={25}
            color="black"
          />
          <Circle cx={amplitudeSliderX} cy={4} r={10} />
        </Group> */}
      </Canvas>
      <View
        style={{
          alignSelf: 'center',
          position: 'absolute',
          alignItems: 'center',
          bottom: Math.max(insets.bottom, 20),
        }}>
        <Text style={{marginBottom: 4}}>swipe to change viewing angle</Text>
        <Text>pinch to change amplitude</Text>
      </View>
      {/* </GestureDetector> */}
    </View>
  );
}
