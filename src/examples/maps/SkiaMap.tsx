import React, { useMemo, useState } from "react";
import { View, useWindowDimensions } from "react-native";
import { Canvas, Skia, rect } from "@shopify/react-native-skia";
import Marker from "./components/Marker";
import { useSharedValue } from "react-native-reanimated";
import { GestureHandler } from "./helpers/GestureHandler";
import MapTiler from "./components/MapTiler";
import UserLocationIndicator from "./components/UserLocationIndicator";

const SkiaMaps = () => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const [region, setRegion] = useState({
    latitude: 51.6534,
    longitude: 5.1318,
    latitudeDelta: 0.001,
    longitudeDelta: 0.001,
  });

  const matrix = useSharedValue(Skia.Matrix());
  const dimensions = rect(0, 0, screenWidth, screenHeight);

  const mapHeading = useSharedValue(0);

  const markers = useMemo(() => {
    return [
      {
        id: "1",
        latitude: 51.6534,
        longitude: 5.1318,
      },
      /* {
        id: "2",
        latitude: 59.4293,
        longitude: 18.0686,
      },
      {
        id: "3",
        latitude: 59.3293,
        longitude: 18.0886,
      }, */
    ];
  }, []);

  /* useAnimatedReaction(
    () => matrix.value,
    (value) => {
      console.log(value.get());
    }
  ); */

  return (
    <View style={{ flex: 1 }}>
      <Canvas style={{ flex: 1 }}>
        <MapTiler matrix={matrix} zoom={17} region={region} />
        {markers.map((marker) => (
          <Marker
            key={marker?.id}
            marker={marker}
            region={region}
            matrix={matrix}
          />
        ))}
        <UserLocationIndicator
          coordinates={{
            latitude: markers?.[0]?.latitude - 0.004, //latestUserLocationState?.latitude || 0,
            longitude: markers?.[0]?.longitude + 0.0001, //latestUserLocationState?.longitude || 0,
          }}
          initialRegion={region}
          mapHeading={mapHeading}
          matrix={matrix}
        />
        {/* {SHOW_INITIAL_REGION && <InitialRegionPolygon initialRegion={initialRegion} />} */}
      </Canvas>
      <GestureHandler
        matrix={matrix}
        dimensions={dimensions}
        // debug
      />
    </View>
  );
};

export default SkiaMaps;

/* useEffect(() => {
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
  }, []); */

/*   useEffect(() => {
    if (!hasRequestedLocationPermission.value) {
      requestLocationPermissions();
      hasRequestedLocationPermission.value = true;
    }
  }, [requestLocationPermissions]); */
