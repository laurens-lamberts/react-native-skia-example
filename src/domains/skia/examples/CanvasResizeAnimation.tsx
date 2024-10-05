import React, { useEffect, useState } from "react";
import { Canvas, Image, useImage } from "@shopify/react-native-skia";
import { View } from "react-native";

const START_SIZE = 200;

const CanvasResizeAnimation = () => {
  const [imageSize, setImageSize] = useState(START_SIZE);

  useEffect(() => {
    let interval = setInterval(() => {
      setImageSize(Math.random() * 200 + START_SIZE);
    }, 1000);
    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  const skiaImage = useImage(require("@app/assets/images/exampleImage.jpg"));

  return (
    <View style={{ margin: 12 }}>
      <Canvas
        style={{
          width: imageSize,
          height: imageSize,
        }}
      >
        {!!skiaImage && (
          <Image
            x={0}
            y={0}
            width={imageSize}
            height={imageSize}
            image={skiaImage}
            fit="cover"
          />
        )}
      </Canvas>
    </View>
  );
};

export default CanvasResizeAnimation;
