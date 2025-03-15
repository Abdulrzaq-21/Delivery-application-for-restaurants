import "../global.css";
import { useEffect } from "react";
import { Stack, SplashScreen } from 'expo-router';
import { useFonts } from "expo-font";

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  
  const [fontsLoaded, error] = useFonts({
    markazi: require("../assets/fonts/MarkaziText-VariableFont_wght.ttf"),
    Mmedium: require("../assets/fonts/MarkaziText-Medium.ttf"),
    Mregular: require("../assets/fonts/MarkaziText-Regular.ttf"),
    Msemibold: require("../assets/fonts/MarkaziText-SemiBold.ttf"),
    Mbold: require("../assets/fonts/MarkaziText-Bold.ttf"),
  });


  useEffect(() => {
    if(error) throw error;
    if(fontsLoaded) SplashScreen.hideAsync();
  },[fontsLoaded, error])

  if (!fontsLoaded && !error) return null;

  return (
    <Stack screenOptions={{
      headerShown: false,
    }}>
      <Stack.Screen name="index" options={{"headerShown":false}}/>
    </Stack>
  );
}
