import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, 
  KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform 
} from 'react-native';
import api from '../api/api';
import { useRouter } from "expo-router";
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RegistrationScreen = () => {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAddress] = useState("")
  const [restaurantName, setRestaurantName] = useState("");
  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const trimmedPhone = phone.trim();
    if (trimmedPhone && !/^09\d{8}$/.test(trimmedPhone)) {
      setPhoneError('رقم الهاتف يجب أن يبدأ ب 09 ويتكون من 10 أرقام');
    } else {
      setPhoneError('');
    }
  }, [phone]);

  useEffect(() => {
    if (password && password.length < 6) {
      setPasswordError('يجب أن تتكون كلمة المرور من 6 أحرف على الأقل');
    } else if (confirmPassword && password !== confirmPassword) {
      setPasswordError('كلمة المرور غير متطابقة');
    } else {
      setPasswordError('');
    }
  }, [password, confirmPassword]);

  const strToBool = (string) => {
    return string.length > 0
  }

  const handleRegister = async () => {
    const trimmedPhone = phone.trim();
    const trimmedName = name.trim();
    if (!trimmedPhone || !trimmedName || !password || !confirmPassword || ! restaurantName || !address) {
      Alert.alert('خطأ', 'يرجى ملء جميع الحقول');
      return;
    }
    if (strToBool(phoneError) || strToBool(passwordError)) {
      Alert.alert('خطأ', 'يرجى تصحيح الأخطاء قبل المتابعة');
      return;
    }
    setLoading(true);
    try {
      AsyncStorage.clear()
      const response = await api.post("/api/user/register/", {
        "phone_number": trimmedPhone.replace(/^09/, "+9639"),
        "username": trimmedName,
        "password": password,
        "restaurant_name":restaurantName,
        "restaurant_address":address
      });
      if (response.status === 200) {
        await SecureStore.setItemAsync('tempPhone', trimmedPhone.replace(/^09/, "+9639"));
        await SecureStore.setItemAsync('tempPassword', password);
        router.replace("/checkNum");
      }
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.message || error.message;
      Alert.alert('حدث خطأ', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      className="flex-1 bg-snow"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 justify-center p-6">
          <Text className="text-3xl font-Mbold text-madder text-center mb-8 font-markazi">
            انشاء حساب جديد
          </Text>
  
          <View className="mb-4">
            <View className="relative">
              <Icon 
                name="phone" 
                size={24} 
                color="#A31621" 
                className="absolute top-4 left-4 z-10"
              />
              <TextInput
                className={`bg-white p-4 pl-12 rounded-lg border ${
                  strToBool(phoneError) ? "border-madder" : "border-gray-200"
                } text-madder font-markazi`}
                placeholder="رقم الهاتف"
                placeholderTextColor="#A31621"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
            </View>
            {strToBool(phoneError) ? (
              <Text className="text-madder text-sm mt-1 font-markazi">
                {phoneError}
              </Text>
            ) : null}
          </View>
  
          <View className="relative mb-4">
            <Icon 
              name="person" 
              size={24} 
              color="#A31621" 
              className="absolute top-4 left-4 z-10"
            />
            <TextInput
              className="bg-white p-4 pl-12 rounded-lg border border-gray-200 text-madder font-markazi"
              placeholder="الاسم"
              placeholderTextColor="#A31621"
              value={name}
              onChangeText={setName}
            />
          </View>
  
          <View className="relative mb-4">
            <Icon 
              name="lock" 
              size={24} 
              color="#A31621" 
              className="absolute top-4 left-4 z-10"
            />
            <TextInput
              className="bg-white p-4 pl-12 pr-12 rounded-lg border border-gray-200 text-madder font-markazi"
              placeholder="كلمة المرور"
              placeholderTextColor="#A31621"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity 
              onPress={() => setShowPassword(!showPassword)} 
              className="absolute top-4 right-4"
            >
              <Icon 
                name={showPassword ? "visibility-off" : "visibility"} 
                size={24} 
                color="#A31621" 
              />
            </TouchableOpacity>
          </View>
  
          <View className="mb-6">
            <View className="relative">
              <Icon 
                name="lock-outline" 
                size={24} 
                color="#A31621" 
                className="absolute top-4 left-4 z-10"
              />
              <TextInput
                className={`bg-white p-4 pl-12 pr-12 rounded-lg border ${
                  strToBool(passwordError) ? "border-madder" : "border-gray-200"
                } text-madder font-markazi`}
                placeholder="تأكيد كلمة المرور"
                placeholderTextColor="#A31621"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity 
                onPress={() => setShowConfirmPassword(!showConfirmPassword)} 
                className="absolute top-4 right-4"
              >
                <Icon 
                  name={showConfirmPassword ? "visibility-off" : "visibility"} 
                  size={24} 
                  color="#A31621" 
                />
              </TouchableOpacity>
            </View>
            {strToBool(passwordError) ? (
              <Text className="text-madder text-sm mt-1 font-markazi">
                {passwordError}
              </Text>
            ) : null}
          </View>
              <View className="relative mb-4">
                <Icon 
                  name="restaurant" 
                  size={24} 
                  color="#A31621" 
                  className="absolute top-4 left-4 z-10"
                />
                <TextInput
                  className={`bg-white p-4 pl-12 rounded-lg border border-gray-200 text-madder font-markazi`}
                  placeholder="اسم المطعم"
                  placeholderTextColor="#A31621"
                  value={restaurantName}
                  onChangeText={setRestaurantName}
                />
              </View>
    
            <View className="relative mb-4">
              <Icon 
                name="map" 
                size={24} 
                color="#A31621" 
                className="absolute top-4 left-4 z-10"
              />
  
              <TextInput
                className="bg-white p-4 pl-12 rounded-lg border border-gray-200 text-madder font-markazi"
                placeholder="العنوان"
                placeholderTextColor="#A31621"
                value={address}
                onChangeText={setAddress}
              />
            </View>
    
          <TouchableOpacity 
            onPress={handleRegister}
            disabled={loading || strToBool(phoneError) || strToBool(passwordError)}
            className={`bg-madder-500 p-4 rounded-lg flex-row justify-center items-center ${
              loading || strToBool(phoneError) || strToBool(passwordError)
                ? "opacity-80"
                : ""
            }`}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Icon 
                  name="how-to-reg" 
                  size={20} 
                  color="white" 
                  className="ml-2"
                />
                <Text className="text-white text-lg font-Msemibold">
                  تسجيل
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
  
};

export default RegistrationScreen;
