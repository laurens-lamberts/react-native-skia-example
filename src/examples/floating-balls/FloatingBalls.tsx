import React from 'react';
import {View, useWindowDimensions} from 'react-native';
import {
  Canvas,
  Circle,
  Easing,
  Fill,
  Group,
  RoundedRect,
  useTiming,
  useValue,
} from '@shopify/react-native-skia';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Ball from './Ball';
/* import {Gesture, GestureDetector} from 'react-native-gesture-handler'; */
import {useSharedValue} from 'react-native-reanimated';

const STATIC_NUMBER_OF_BALLS_HORIZONTALLY = 8;
const USE_DYNAMIC_NUMBER_OF_BALLS_HORIZONTALLY = true;
export const BALL_RADIUS = 20;
const DEFAULT_AMPLITUDE = 40;

export default function FloatingBalls() {
  const {width: screenWidth, height: screenHeight} = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const offsetY = useTiming(
    {from: 0, to: 1, loop: true, yoyo: false},
    {duration: 2000, easing: Easing.linear},
  );

  const dynamicNumberOfBallsHorizontally = Math.floor(
    screenWidth / (BALL_RADIUS * 2),
  );

  const numberOfBallsHorizontally = USE_DYNAMIC_NUMBER_OF_BALLS_HORIZONTALLY
    ? dynamicNumberOfBallsHorizontally
    : STATIC_NUMBER_OF_BALLS_HORIZONTALLY;

  const margin =
    (screenWidth - numberOfBallsHorizontally * (BALL_RADIUS * 2)) /
    numberOfBallsHorizontally;

  const balls = React.useMemo(() => {
    const _balls: {x: number}[] = new Array(numberOfBallsHorizontally);

    for (let i = 0; i < numberOfBallsHorizontally; i++) {
      _balls.push({
        x:
          i * (screenWidth / numberOfBallsHorizontally) +
          Math.max(0, margin / 2),
      });
    }
    return _balls;
  }, [margin, numberOfBallsHorizontally, screenWidth]);

  const amplitude = useValue(DEFAULT_AMPLITUDE);
  const amplitudeSliderX = useSharedValue(20);

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
        <Fill color={'white'} />
        <Group transform={[{translateX: BALL_RADIUS}]}>
          {balls.map((ball, index) => (
            <Ball
              key={index}
              x={ball.x}
              offsetY={offsetY}
              index={index}
              amplitude={amplitude}
            />
          ))}
        </Group>
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
