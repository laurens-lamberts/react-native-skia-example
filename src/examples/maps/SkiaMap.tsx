import React, { useEffect, useMemo, useState } from "react";
import { View, useWindowDimensions } from "react-native";
import { Canvas, Group, Skia, rect } from "@shopify/react-native-skia";
import Marker from "./components/Marker";
import Animated, { useSharedValue } from "react-native-reanimated";
import Geolocation from "@react-native-community/geolocation";
import { GestureHandler } from "./helpers/GestureHandler";
import MapTiler from "./components/MapTiler";
import UserLocationIndicator from "./components/UserLocationIndicator";

const SkiaMaps = () => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const [region, setRegion] = useState({
    latitude: 59.3293,
    longitude: 18.0786,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    Geolocation.requestAuthorization(
      () => {
        Geolocation.watchPosition(
          (pos) => {},
          (posError) => {
            console.log(posError);
          }
        );
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);

  /*   useEffect(() => {
    if (!hasRequestedLocationPermission.value) {
      requestLocationPermissions();
      hasRequestedLocationPermission.value = true;
    }
  }, [requestLocationPermissions]); */

  const matrix = useSharedValue(Skia.Matrix());
  const dimensions = rect(0, 0, screenWidth, screenHeight);

  const mapHeading = useSharedValue(0);

  const markers = useMemo(() => {
    return [
      {
        id: "1",
        latitude: 59.3293,
        longitude: 18.0786,
      },
      {
        id: "2",
        latitude: 59.4293,
        longitude: 18.0686,
      },
      {
        id: "3",
        latitude: 59.3293,
        longitude: 18.0886,
      },
    ];
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Canvas style={{ flex: 1 }} mode="continuous">
        <MapTiler matrix={matrix} zoom={17} region={region} />
        <Group matrix={matrix}>
          {markers.map((marker) => (
            <Marker key={marker?.id} marker={marker} initialRegion={region} />
          ))}
          <UserLocationIndicator
            coordinates={{
              latitude: markers?.[0]?.latitude, //latestUserLocationState?.latitude || 0,
              longitude: markers?.[0]?.longitude, //latestUserLocationState?.longitude || 0,
            }}
            initialRegion={region}
            mapHeading={mapHeading}
          />
          {/* {SHOW_INITIAL_REGION && <InitialRegionPolygon initialRegion={initialRegion} />} */}
        </Group>
      </Canvas>
      <GestureHandler
        matrix={matrix}
        dimensions={dimensions}
        //debug
        onRegionChange={() => {}} // debouncedRegionChange <-- INSERT THIS TO GET ZOOM CALCULATION (NOT YET CORRECT)
      />
    </View>
  );
};

export default SkiaMaps;
