import React from "react";
import { Path, Skia, SkiaValue, vec } from "@shopify/react-native-skia";

const ARROW_THICKNESS = 32;

const Arrow = ({
  height,
  translateX,
  translateY,
  color,
}: {
  height: number;
  translateX: number;
  translateY: number;
  color: SharedValue<string>;
}) => {
  const width = height * 0.7;
  const headStart = height * 0.6;

  translateY -= height / 2;
  translateX += width / 2 - ARROW_THICKNESS * 0.75;

  const points = [
    vec(0, height),
    vec(-width / 2, headStart),
    vec(0, height),
    vec(width / 2, headStart),
  ];
  const path = points.reduce((current, point) => {
    current.lineTo(point.x, point.y);
    return current;
  }, Skia.Path.Make());
  return (
    <Path
      transform={[{ translateX }, { translateY }]}
      origin={vec(0, height / 2)}
      path={path}
      style="stroke"
      strokeWidth={32}
      strokeJoin="round"
      strokeCap="round"
      color={color}
    />
  );
};

export default Arrow;
