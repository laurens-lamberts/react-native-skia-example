import {Blur, Rect, SweepGradient, vec} from '@shopify/react-native-skia';
import React, {useState} from 'react';
import {useWindowDimensions} from 'react-native';
import {getRandomColor} from '../helpers/color';

const Wallpaper = () => {
  const {width, height} = useWindowDimensions();
  const [colors] = useState<string[]>([
    '#7A4069', //getRandomColor(),
    '#FFC18E', //getRandomColor(),
    '#CA4E79', //getRandomColor(),
    '#513252', //getRandomColor(),
  ]);
  const [noiseColor] = useState(getRandomColor());

  return (
    <>
      <Rect x={0} y={0} width={width} height={height}>
        <SweepGradient c={vec(-10, 0)} colors={colors} />
        <Blur blur={10} mode="clamp" />
      </Rect>
      {/* <Group opacity={0.3}>
        <Fill color={noiseColor} />
        <Rect x={0} y={0} width={width} height={height}>
          <FractalNoise freqX={0.005} freqY={0.005} octaves={4} />
          <Blur blur={15} />
        </Rect>
      </Group> */}
    </>
  );
};

export default Wallpaper;
