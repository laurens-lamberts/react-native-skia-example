import React, { useRef, useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BackdropBlur from "@domains/skia/examples/BackdropBlur";
import Mount from "@domains/skia/examples/Mount";
import Game from "@domains/skia/examples/Flappy/Game";
import LabyrinthGame from "@domains/skia/examples/Labyrinth/Game";
import CanvasResizeAnimation from "@domains/skia/examples/CanvasResizeAnimation";
import Compass from "@domains/skia/examples/compass";
import {
  Canvas,
  Image,
  SkImage,
  makeImageFromView,
} from "@shopify/react-native-skia";
import Fire from "@domains/skia/examples/fire/Fire";
import FloatingBalls from "@domains/skia/examples/floating-balls/FloatingBalls";
import SkiaMaps from "@domains/skia/examples/maps/SkiaMap";
import { FIXED_MENU_HEIGHT, FULL_SCREEN } from "@app/config/general";

const SHOW_SNAPSHOT_BUTTON = false;

const examples = [
  { name: "Balls", component: FloatingBalls },
  { name: "Compass", component: Compass },
  { name: "Maze", component: LabyrinthGame },
  { name: "Flappy", component: Game },
  // { name: "Springboard", component: Springboard },
  { name: "Mount", component: Mount },
  { name: "Blur", component: BackdropBlur },
  { name: "Resize", component: CanvasResizeAnimation },
  { name: "Fire", component: Fire },
  { name: "Maps", component: SkiaMaps },
];

interface ExampleProps {
  activeExample: number;
}
const Example = ({ activeExample }: ExampleProps) => {
  if (activeExample >= 0 && activeExample <= examples.length) {
    const Component = examples[activeExample].component;
    return <Component />;
  }

  return (
    <Text style={{ margin: 12 }}>No example loaded. Select one above.</Text>
  );
};

const SkiaOverview = () => {
  const [activeExample, setActiveExample] = useState(0);
  const [image, setImage] = useState<SkImage | null>(null);
  const insets = useSafeAreaInsets();

  const { width, height } = useWindowDimensions();
  const viewRef = useRef<View>(null);

  const makeSnapshot = async () => {
    const snapCurr = await makeImageFromView(viewRef);
    setImage(snapCurr);
  };

  return (
    <View ref={viewRef} style={{ flex: 1, backgroundColor: "black" }}>
      {!FULL_SCREEN && (
        <ScrollView
          horizontal
          style={{
            width: "100%",
            maxHeight: FIXED_MENU_HEIGHT,
          }}
        >
          {examples.map((e, index) => (
            <View
              key={e.name}
              style={{
                borderRightWidth: 1,
                borderColor: "rgba(255, 255, 255, 0.2)",
                paddingHorizontal: 8,
              }}
            >
              <TouchableOpacity
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => setActiveExample(index)}
              >
                <Text style={{ color: "white" }}>{e.name}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      <Example activeExample={activeExample} />
      {SHOW_SNAPSHOT_BUTTON && (
        <TouchableOpacity
          style={{
            position: "absolute",
            top: insets.top + 40,
            right: 8,
            backgroundColor: "lime",
          }}
          onPress={async () => {
            await makeSnapshot();
            // Alert.alert('snapshot taken');
          }}
        >
          <Text>Take snapshot</Text>
        </TouchableOpacity>
      )}

      {image && (
        <View
          style={{
            position: "absolute",
            borderWidth: 2,
            borderColor: "red",
            width: "100%",
            height: "100%",
            backgroundColor: "black",
          }}
        >
          <Canvas
            style={{
              width: width - 4,
              height: height - 4,
            }}
          >
            <Image
              x={0}
              y={0}
              width={width - 4}
              height={height - 4}
              image={image}
            />
          </Canvas>
          <TouchableOpacity
            style={{
              position: "absolute",
              top: insets.top + 40,
              right: 8,
              backgroundColor: "lime",
            }}
            onPress={() => setImage(null)}
          >
            <Text style={{}}>Close</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default SkiaOverview;
