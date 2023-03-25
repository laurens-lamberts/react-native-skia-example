import React, {useState} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import BackdropBlur from './src/examples/BackdropBlur';
import Mount from './src/examples/Mount';
import Game from './src/examples/Flappy/Game';
import LabyrinthGame from './src/examples/Labyrinth/Game';
import CanvasResizeAnimation from './src/examples/CanvasResizeAnimation';
import Springboard from './src/examples/ios-springboard/Springboard';
import Compass from './src/examples/compass';

const examples = [
  {name: 'Compass', component: Compass},
  {name: 'Maze', component: LabyrinthGame},
  {name: 'Flappy', component: Game},
  {name: 'Springboard', component: Springboard},
  {name: 'Mount', component: Mount},
  {name: 'Blur', component: BackdropBlur},
  {name: 'Resize', component: CanvasResizeAnimation},
];

export const FULL_SCREEN = false;
export const FIXED_MENU_HEIGHT = 40;

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
  const [activeExample, setActiveExample] = useState(0);
  const insets = useSafeAreaInsets();

  return (
    <View style={{flex: 1, backgroundColor: 'black'}}>
      {!FULL_SCREEN && (
        <ScrollView
          horizontal
          style={{
            width: '100%',
            marginTop: insets.top,
            maxHeight: FIXED_MENU_HEIGHT,
          }}>
          {examples.map((e, index) => (
            <View
              key={e.name}
              style={{
                flex: 1,
                borderRightWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.2)',
                paddingHorizontal: 8,
              }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => setActiveExample(index)}>
                <Text style={{color: 'white'}}>{e.name}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
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
