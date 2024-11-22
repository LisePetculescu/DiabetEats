import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#ffb5b5",
        headerStyle: {
          backgroundColor: "#407088",
        },
        headerShadowVisible: false,
        headerTintColor: "#ffb5b5",
        // headerTintColor: "#fff",
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
          title: "Min Side",
          // tabBarIcon: ({ color, focused }) => <AntDesign name="bars" size={24} color={color} />
          // tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "heart-circle" : "heart-circle-outline"} color={color} size={24} />
          // tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "heart-dislike-circle" : "heart-dislike-circle-outline"} color={color} size={24} />
          // tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "information-circle" : "information-circle-outline"} color={color} size={24} />
          // tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "image" : "image-outline"} color={color} size={24} />
          // tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "nutrition" : "nutrition-outline"} color={color} size={24} />
          tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "person" : "person-outline"} color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="ProductDetails"
        options={{
          title: "Produkt info",
          tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "home-sharp" : "home-outline"} color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
