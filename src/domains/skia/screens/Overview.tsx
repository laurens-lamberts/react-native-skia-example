import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import {
  NavigationContainerRef,
  useNavigation,
} from "@react-navigation/native";
import {
  Compass,
  Fire,
  Question,
  MapTrifold,
  Bird,
  Balloon,
  BowlingBall,
  AppleLogo,
  Blueprint,
  Resize,
  Drop,
} from "phosphor-react-native";
import useTheme from "@app/hooks/useTheme";
import { SkiaRoutes } from "../navigation/Stack";
import { FlashList } from "@shopify/flash-list";

const iconMap: { [key in keyof SkiaRoutes]?: JSX.Element } = {
  Overview: <Fire />,
  "Floating Balls": <Balloon />,
  Flappy: <Bird />,
  Maze: <BowlingBall />,
  Compass: <Compass />,
  Fire: <Fire />,
  Springboard: <AppleLogo />,
  Mount: <Blueprint />,
  Blur: <Drop />,
  Resize: <Resize />,
  Maps: <MapTrifold />,
};

const Icon = ({ routeName }: { routeName: keyof SkiaRoutes }) =>
  iconMap[routeName] || <Question />;

const SkiaOverview = () => {
  const navigation = useNavigation<NavigationContainerRef<SkiaRoutes>>();
  const theme = useTheme();

  const [routeNames, setRouteNames] = useState<(keyof SkiaRoutes)[]>([]);

  useEffect(() => {
    const routeNames = [
      ...navigation.getState().routeNames,
    ] as (keyof SkiaRoutes)[];
    routeNames.shift();
    setRouteNames(routeNames);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#FFF" }}>
      <FlashList
        data={routeNames}
        renderItem={({ item: routeName }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate(routeName)}
            style={{
              padding: 12,
              backgroundColor: "#FFF",
              borderColor: "#CCC",
              borderBottomWidth: 1,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: theme.space.m,
              }}
            >
              <Icon routeName={routeName} />
              <Text>{routeName}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(_item, index) => index.toString()}
        estimatedItemSize={48}
      />
    </View>
  );
};

export default SkiaOverview;
