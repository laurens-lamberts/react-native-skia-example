import React, { useMemo } from "react";
import { Group } from "@shopify/react-native-skia";
import MapTile from "./MapTile";

interface MapTilerProps {
  matrix: any;
  zoom: number;
  region: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
}

export const TILE_SIZE = 180;

const MapTiler = ({ matrix, zoom, region }: MapTilerProps) => {
  const lat = region.latitude;
  const lon = region.longitude;

  const tileZ = Math.round(zoom);
  const tileX = Math.floor(((lon + 180) / 360) * Math.pow(2, tileZ));
  const tileY = Math.floor(
    ((1 -
      Math.log(
        Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)
      ) /
        Math.PI) /
      2) *
      Math.pow(2, tileZ)
  );

  const startX = -5;
  const startY = -5;
  const numberOfTilesX = 8;
  const numberOfTilesY = 20;

  const tiles = useMemo(() => {
    const innerTiles = [];
    for (let x = startX; x < startX + numberOfTilesX; x++) {
      for (let y = startY; y < startY + numberOfTilesY; y++) {
        const tileURL = `https://api.maptiler.com/maps/0c9544b8-8d97-42de-98d7-7cbf4728e02a/256/${tileZ}/${
          tileX + x
        }/${tileY + y}@2x.png?key=TL6hjPsDz7ATlQ8mLI6n`;

        innerTiles.push(
          <MapTile
            key={x + "|" + y}
            x={x * TILE_SIZE}
            y={y * TILE_SIZE}
            tileURL={tileURL}
          />
        );
      }
    }
    return innerTiles;
  }, [startX, startY, tileX, tileY, tileZ]);

  return <Group matrix={matrix}>{tiles.map((tile: any) => tile)}</Group>;
};

export default MapTiler;
