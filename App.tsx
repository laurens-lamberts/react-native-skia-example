import React, {useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import BackdropBlur from './src/examples/BackdropBlur';
import Mount from './src/examples/Mount';
import Game from './src/examples/Game/Game';
import LabyrinthGame from './src/examples/Labyrinth/Game';

const examples = [
  {name: 'Mount', component: Mount},
  {name: 'BackdropBlur', component: BackdropBlur},
  {name: 'Flappy', component: Game},
  {name: 'Sensor', component: LabyrinthGame},
];

export const FULL_SCREEN = true;

interface ExampleProps {
  activeExample: number;
}
const Example = ({activeExample}: ExampleProps) => {
  if (activeExample >= 0 && activeExample <= examples.length) {
    const Component = examples[activeExample].component;
    return <Component />;
  }

  return <Text style={{margin: 12}}>No example loaded. Select one above.</Text>;
};

const App = () => {
  const [activeExample, setActiveExample] = useState(2);
  const insets = useSafeAreaInsets();

  return (
    <View style={{flex: 1}}>
      {!FULL_SCREEN && (
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            backgroundColor: 'tomato',
            paddingTop: insets.top,
          }}>
          {examples.map((e, index) => (
            <View
              key={e.name}
              style={{
                height: 50,
                flex: 1,
                borderRightWidth: 1,
                borderColor: 'rgba(0, 0, 0, 0.2)',
              }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => setActiveExample(index)}>
                <Text>{e.name}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <Example activeExample={activeExample} />
    </View>
  );
};

export default () => {
  return (
    <SafeAreaProvider>
      <App />
    </SafeAreaProvider>
  );
};
