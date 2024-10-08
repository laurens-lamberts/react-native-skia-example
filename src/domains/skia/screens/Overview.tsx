import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
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

const Icon = ({ routeName }: { routeName: keyof SkiaRoutes }) => {
  switch (routeName) {
    case "Overview":
      return <Fire />;
    case "Floating Balls":
      return <Balloon />;
    case "Flappy":
      return <Bird />;
    case "Maze":
      return <BowlingBall />;
    case "Compass":
      return <Compass />;
    case "Fire":
      return <Fire />;
    case "Springboard":
      return <AppleLogo />;
    case "Mount":
      return <Blueprint />;
    case "Blur":
      return <Drop />;
    case "Resize":
      return <Resize />;
    case "Maps":
      return <MapTrifold />;
    default:
      return <Question />;
  }
};

const SkiaOverview = () => {
  const navigation = useNavigation();
  const theme = useTheme();

  const [routeNames, setRouteNames] = useState<string[]>([]);

  useEffect(() => {
    const routeNames = [...navigation.getState().routeNames];
    routeNames.shift();
    setRouteNames(routeNames);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#FFF" }}>
      <ScrollView>
        {routeNames.map((routeName, index) => {
          return (
            <TouchableOpacity
              key={index}
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
          );
        })}
      </ScrollView>
    </View>
  );
};

export default SkiaOverview;
