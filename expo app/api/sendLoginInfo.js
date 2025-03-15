import api from "./api";
import { Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { REFRESH_TOKEN, ACCESS_TOKEN } from "./constants";

const sendLoginInfo = async (phoneNumber, password, router) => {
  try {
    const response = await api.post("/api/token/", {
      phone_number: phoneNumber,
      password: password
    });
    
    if (response.status === 200) {
      await AsyncStorage.setItem(ACCESS_TOKEN, response.data.access);
      await AsyncStorage.setItem(REFRESH_TOKEN, response.data.refresh);
      router.replace("/home");
    }
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    Alert.alert('حدث خطأ', message);
  }
};

export default sendLoginInfo;
