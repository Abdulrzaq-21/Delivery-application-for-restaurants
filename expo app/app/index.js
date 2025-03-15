import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const StartPage = () => {
    const router = useRouter();
    
    const handleStart = () => {
        router.replace("/home");
    }

    return(
        <View className="flex-1 justify-center items-center bg-snow p-5 gap-y-8">
            <MaterialCommunityIcons 
                name="truck-delivery" 
                size={120}
                className="text-madder-500 mb-8"
            />
            
            <View className="items-center gap-y-4">
                <Text className="text-4xl text-madder-500 font-markazi">
                    أفضل تطبيق لتوصيل
                </Text>
                <Text className="text-2xl text-snow-500 font-Mregular text-center">
                    المواد الأولية للمطاعم
                </Text>
            </View>

            <TouchableOpacity 
                className="bg-madder-500 px-10 py-4 rounded-full shadow-lg"
                onPress={handleStart}
            >
                <Text className="text-snow-50 text-lg font-Mbold">
                    ابدأ الآن
                </Text>
            </TouchableOpacity>
        </View>
    )
}

export default StartPage;