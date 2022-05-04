import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Screen from './Screen';

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="One" component={Screen} />
        <Tab.Screen name="Two" component={Screen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
