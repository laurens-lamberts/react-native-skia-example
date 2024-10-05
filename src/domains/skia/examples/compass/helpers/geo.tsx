export function toRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
}
export function toDegrees(radians: number) {
  return (radians * 180) / Math.PI;
}
export const generateLocation = (
  latitude: number,
  longitude: number,
  max: number, // in meters
  min = 0, // in meters
) => {
  if (min > max) {
    throw new Error(`min(${min}) cannot be greater than max(${max})`);
  }

  // earth radius in km
  const EARTH_RADIUS = 6371;

  // 1° latitude in meters
  const DEGREE = ((EARTH_RADIUS * 2 * Math.PI) / 360) * 1000;

  const r = (max - min + 1) * Math.random() ** 0.5 + min;

  // random angle
  const theta = Math.random() * 2 * Math.PI;

  const dy = r * Math.sin(theta);
  const dx = r * Math.cos(theta);

  let newLatitude = latitude + dy / DEGREE;
  let newLongitude = longitude + dx / (DEGREE * Math.cos(toRadians(latitude)));

  const distance = getDistanceFromLatLonInKm(
    latitude,
    longitude,
    newLatitude,
    newLongitude,
  );

  return {
    latitude: newLatitude,
    longitude: newLongitude,
    distance: Math.round(distance * 1000), // in meters
  };
};

// See https://stackoverflow.com/a/27943/10975709
export function getDistanceFromLatLonInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  var R = 6371; // Radius of the earth in km
  var dLat = toRadians(lat2 - lat1);
  var dLon = toRadians(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km

  return d;
}

export function bearing(
  startLat: number,
  startLng: number,
  destLat: number,
  destLng: number,
) {
  startLat = toRadians(startLat);
  startLng = toRadians(startLng);
  destLat = toRadians(destLat);
  destLng = toRadians(destLng);

  const y = Math.sin(destLng - startLng) * Math.cos(destLat);
  const x =
    Math.cos(startLat) * Math.sin(destLat) -
    Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
  let brng = Math.atan2(y, x);
  brng = toDegrees(brng);
  return (brng + 360) % 360;
}
