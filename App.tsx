/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useEffect, useMemo, useState} from 'react';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import {Canvas, RoundedRect, Shadow} from '@shopify/react-native-skia';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const NUMBER_OF_ITEMS = 100;

const getRandomColor = () => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
};

const App = () => {
  const [items, setItems] = useState([]);
  const [show, setShow] = useState(true);
  const [randomColor, setRandomColor] = useState(getRandomColor());

  const onPress = () => {
    setShow(_show => !show);
    setRandomColor(getRandomColor());
  };

  useEffect(() => {
    setItems(new Array(NUMBER_OF_ITEMS).fill(0));
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <TouchableOpacity
        style={{
          backgroundColor: randomColor,
          alignItems: 'center',
          marginHorizontal: 20,
          paddingVertical: 20,
        }}
        activeOpacity={0.8}
        onPress={onPress}>
        <Text style={{color: 'white'}}>{show ? 'Hide' : 'Show'}</Text>
      </TouchableOpacity>
      {show && (
        <Animated.View
          style={styles.container}
          entering={FadeIn}
          exiting={FadeOut}>
          <View style={styles.mode}>
            {items.map((item, index) => (
              <View
                key={index}
                style={{
                  margin: 2,
                }}>
                <Canvas style={{width: 30, height: 40}}>
                  <RoundedRect
                    x={0}
                    y={0}
                    width={30}
                    height={40}
                    r={8}
                    color={randomColor}>
                    <Shadow
                      dx={0}
                      dy={10}
                      blur={10}
                      color={'rgba(11,34,46,0.20)'}
                    />
                  </RoundedRect>
                </Canvas>
              </View>
            ))}
          </View>
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mode: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    margin: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
});

export default App;
