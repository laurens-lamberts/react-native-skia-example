import {Oval, Shadow, SkiaValue} from '@shopify/react-native-skia';
import React from 'react';
import {HOLE_SIZE} from './Config';

interface HoleInterface {
  x: number;
  y: number;
  shadowX: SkiaValue<number>;
  shadowY: SkiaValue<number>;
}

const Hole = ({x, y, shadowX, shadowY}: HoleInterface) => {
  return (
    /* // Oval is used instead of Circle, because i'm not sure about the best way to do position correction.
    as circle has it's origin in the middle, where other shapes have the origin at left top corner. */
    <Oval
      x={x}
      y={y}
      width={HOLE_SIZE}
      height={HOLE_SIZE}
      color="rgba(160,137,94,1)">
      <Shadow
        dx={shadowX}
        dy={shadowY}
        blur={2}
        color={'rgba(106,81,64,1)'}
        inner
      />
    </Oval>
  );
};

export default Hole;
