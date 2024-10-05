import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");

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
  // Calculate the scale of the map based on the range of the latitude and longitude
  const scale = Math.max(mapLatitudeDelta, mapLongitudeDelta);

  // Calculate the factors based on the scale of the map
  const xFactor = width / scale;
  const yFactor = height / scale;

  // Convert the latitude to radians and apply the Mercator projection
  const latRad = (latitude * Math.PI) / 180;
  const mapLatRad = (mapLatitude * Math.PI) / 180;
  const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
  const mapMercN = Math.log(Math.tan(Math.PI / 4 + mapLatRad / 2));

  const x = (longitude - mapLongitude) * xFactor;
  const y = (mapMercN - mercN) * yFactor;

  return { x, y };
};
