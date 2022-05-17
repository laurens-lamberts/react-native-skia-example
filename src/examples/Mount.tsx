import React, {useEffect, useState} from 'react';
import {Canvas, RoundedRect, Shadow} from '@shopify/react-native-skia';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();

const NUMBER_OF_ITEMS = 100;

const getRandomColor = () => {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const Screen = () => {
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
    <>
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
        <View style={styles.container}>
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
        </View>
      )}
    </>
  );
};

const ExampleMount = () => {
  const insets = useSafeAreaInsets();
  return (
    <NavigationContainer>
      <Tab.Navigator sceneContainerStyle={{marginTop: -insets.top}}>
        <Tab.Screen name="One" component={Screen} />
        <Tab.Screen name="Two" component={Screen} />
      </Tab.Navigator>
    </NavigationContainer>
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

export default ExampleMount;
