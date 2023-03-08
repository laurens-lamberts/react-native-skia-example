import React from 'react';
import {Points, vec} from '@shopify/react-native-skia';

const Arrow = ({
  height,
  translateX,
  translateY,
}: {
  height: number;
  translateX: number;
  translateY: number;
}) => {
  const width = height * 0.2;
  const headStart = height * 0.6;

  translateY += height / 2;
  translateX += width / 2;

  const points = [
    vec(0, 0),
    vec(0, -headStart),
    vec(-width, -headStart),
    vec(width / 2, -height),
    vec(width * 2, -headStart),
    vec(width, -headStart),
    vec(width, 0),
    vec(0, 0),
  ];
  return (
    <Points
      transform={[{translateX}, {translateY}, {rotate: Math.PI}]}
      origin={vec(width / 2, -height / 2)}
      points={points}
      mode="polygon"
      color="white"
      style="fill"
      strokeJoin="bevel"
      strokeCap="round"
      strokeMiter={200}
      strokeWidth={6}
    />
  );
};

export default Arrow;
