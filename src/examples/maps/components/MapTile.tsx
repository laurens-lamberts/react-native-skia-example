import React from "react";
import { Image, useImage } from "@shopify/react-native-skia";
import { TILE_SIZE } from "./MapTiler";

interface Props {
  x: number;
  y: number;
  tileURL: string;
}
const MapTile = ({ x, y, tileURL }: Props) => {
  // TODO: apply caching.
  const skiaTileImage = useImage(tileURL);

  if (!skiaTileImage) return null;

  return (
    <Image
      x={x}
      y={y}
      width={TILE_SIZE}
      height={TILE_SIZE}
      image={skiaTileImage}
    />
  );
};

export default MapTile;
