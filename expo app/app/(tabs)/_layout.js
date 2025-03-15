import { Tabs } from "expo-router";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ProtectedRoute from "../../api/ProtectedRoute";

export default function TabsLayout() {
  return (
    <ProtectedRoute>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#A31621",
          tabBarInactiveTintColor: "#ccc",
          tabBarLabelStyle: { fontFamily: "Mregular" },
          tabBarStyle: { 
            backgroundColor: "#FFFAFA",
            borderTopWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
          },
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="profile"
          options={{
            tabBarLabel: "الملف الشخصي",
            tabBarIcon: ({ color, size }) => (
              <Icon name="account" size={size} color={color} />
            ),
            headerShown: false
          }}
        />
        <Tabs.Screen
          name="home"
          options={{
            tabBarLabel: "الرئيسية",
            tabBarIcon: ({ color, size }) => (
              <Icon name="home" size={size} color={color} />
            ),
            headerShown: false
          }}
        />
        <Tabs.Screen
          name="orders"
          options={{
            tabBarLabel: "الطلبات",
            tabBarIcon: ({ color, size }) => (
              <Icon name="clipboard-list" size={size} color={color} />
            ),
            headerShown: false
          }}
        />
      </Tabs>
    </ProtectedRoute>
  );
}