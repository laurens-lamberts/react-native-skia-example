import React from "react";
import { Text } from "react-native";
// Notice the import path `@shopify/react-native-skia/lib/module/web`
// This is important only to pull the code responsible for loading Skia.
// @ts-expect-error
import { WithSkiaWeb } from "@shopify/react-native-skia/lib/module/web";
export default function App() {
  return (
    <WithSkiaWeb
      getComponent={() => import("./AppActual")}
      fallback={<Text>Loading Skia...</Text>}
    />
  );
}
