import {Rect, SweepGradient, vec} from '@shopify/react-native-skia';
import React, {useState} from 'react';
import {useWindowDimensions} from 'react-native';
import {getRandomColor} from '../helpers/color';

const Wallpaper = () => {
  const {width, height} = useWindowDimensions();
  const [colors] = useState<string[]>([
    getRandomColor(),
    getRandomColor(),
    getRandomColor(),
    getRandomColor(),
    getRandomColor(),
  ]);

  return (
    <>
      <Rect x={0} y={0} width={width} height={height}>
        <SweepGradient c={vec(-10, 0)} colors={colors} />
      </Rect>
      {/* <Group>
        <Fill color="white" />
        <Rect x={0} y={0} width={256} height=r{256}>
          <FractalNoise freqX={0.05} freqY={0.05} octaves={4} />
        </Rect>
      </Group> */}
    </>
  );
};

export default Wallpaper;
