import React from 'react';
import {
  BackdropBlur,
  Canvas,
  Fill,
  Image,
  useImage,
} from '@shopify/react-native-skia';
import {Text, useWindowDimensions, View} from 'react-native';

const BADGE_HEIGHT = 26;

const ExampleBackdropBlur = () => {
  const FACTOR = 0.42;
  const PADDING = 12;

  const badgeBorderRadius = 6;

  const {width: screenWidth} = useWindowDimensions();
  const width = Math.min(screenWidth * FACTOR, 200);
  const imageSize = width - PADDING * 2;

  const skiaImage = useImage(require('../assets/images/exampleImage.jpg'));

  return (
    <View style={{margin: PADDING}}>
      <View
        style={{
          width: imageSize,
          height: imageSize,
          borderRadius: 8,
          overflow: 'hidden',
          flex: 0,
        }}>
        <Canvas
          style={{
            width: imageSize,
            height: imageSize,
          }}>
          {!!skiaImage && (
            <>
              <Image
                x={0}
                y={0}
                width={imageSize}
                height={imageSize}
                image={skiaImage}
                fit="cover"
              />
              <BackdropBlur
                blur={4}
                clip={{
                  rect: {
                    x: 6,
                    y: imageSize - BADGE_HEIGHT - 6,
                    width: imageSize - 12,
                    height: BADGE_HEIGHT,
                  },
                  rx: badgeBorderRadius,
                  ry: badgeBorderRadius,
                }}>
                <Fill color={'rgba(11,34,46,0.20)'} />
              </BackdropBlur>
            </>
          )}
        </Canvas>
        <Text
          style={{
            position: 'absolute',
            bottom: BADGE_HEIGHT / 2 - 6,
            left: 12,
            color: 'white',
            lineHeight: BADGE_HEIGHT,
          }}>
          Test
        </Text>
      </View>
    </View>
  );
};

export default ExampleBackdropBlur;
