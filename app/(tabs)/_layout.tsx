import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function TabLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#ffb5b5",
          headerStyle: {
            backgroundColor: "#407088",
          },
          headerShadowVisible: false,
          headerTintColor: "#ffb5b5",
          tabBarStyle: {
            backgroundColor: "#407088",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "",
            tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "home-sharp" : "home-outline"} color={color} size={24} />,
          }}
        />
        <Tabs.Screen
          name="myPage"
          options={{
            title: "Min Liste",

            tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "person" : "person-outline"} color={color} size={24} />,
          }}
        />
        <Tabs.Screen
          name="ProductDetails"
          options={{
            title: "Produkt info",
            tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "nutrition" : "nutrition-outline"} color={color} size={24} />,
          }}
        />
      </Tabs>
    </GestureHandlerRootView>
  );
}
