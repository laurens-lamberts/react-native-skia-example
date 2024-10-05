import { WidgetType } from "../types/AppType";
import { useSharedValue } from "react-native-reanimated";

const useWidgets = () => {
  const widgets = useSharedValue<WidgetType[]>([{ name: "clock" }]);
  return { widgets };
};

export default useWidgets;
