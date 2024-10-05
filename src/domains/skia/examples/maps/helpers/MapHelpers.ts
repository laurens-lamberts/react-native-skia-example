import { MarkerType } from "../types/MarkerType";

function deg2rad(deg: number) {
  "worklet";
  return deg * (Math.PI / 180);
}

// Generally used geo measurement function
export const getDistanceFromLatLonInKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  "worklet";
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c * 1000; // Distance in m
  return d;
};

export const getMarkersWithinRadius = (
  markers: MarkerType[],
  coordinate: { latitude: number; longitude: number },
  radius: number
) => {
  "worklet";
  return markers?.filter((marker) => {
    const distanceInMeters = getDistanceFromLatLonInKm(
      coordinate.latitude,
      coordinate.longitude,
      marker.latitude,
      marker.longitude
    );

    return distanceInMeters < radius;
  });
};
