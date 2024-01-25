import { Dimensions } from 'react-native';
import { TILE_SIZE } from '../components/MapTiler';

const FACTOR = 650; // TODO: magic number
export const coordinateToXY = ({
  latitude,
  longitude,
  mapLatitude,
  mapLatitudeDelta,
  mapLongitude,
  mapLongitudeDelta,
}: {
  latitude: number;
  longitude: number;
  mapLatitude: number;
  mapLatitudeDelta: number;
  mapLongitude: number;
  mapLongitudeDelta: number;
}) => {
  const { width, height } = Dimensions.get('window');
  const aspectRatio = width / height;

  const xOffset = TILE_SIZE / 2; // TODO: not correct
  const yOffset = TILE_SIZE / 2; // TODO: not correct

  const xFactor = FACTOR / (aspectRatio * 1.3); // dunno, magic number here, should be based on latitude, latitudedelta etc.
  const yFactor = FACTOR;
  const x = (longitude - mapLongitude) / mapLongitudeDelta;
  const y = -(latitude - mapLatitude) / mapLatitudeDelta;

  return { x: x * xFactor, y: y * yFactor + yOffset };
};
