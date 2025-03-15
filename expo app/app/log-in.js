import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform
} from "react-native";
import { useRouter } from "expo-router";
import sendLoginInfo from "../api/sendLoginInfo";
import Icon from 'react-native-vector-icons/MaterialIcons';

const LogIn = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const trimmedPhone = phoneNumber.trim();
    if (trimmedPhone && !/^09\d{8}$/.test(trimmedPhone)) {
      setPhoneError('رقم الهاتف يجب أن يبدأ ب 09 ويتكون من 10 أرقام');
    } else {
      setPhoneError('');
    }
  }, [phoneNumber]);


  const handleLogin = async () => {
    const trimmedPhone = phoneNumber.trim();
    if (!trimmedPhone || !password) {
      Alert.alert('خطأ', 'يرجى ملء جميع الحقول');
      return;
    }
    if (phoneError.length > 0) {
      Alert.alert('خطأ', 'يرجى تصحيح الأخطاء قبل المتابعة');
      return;
    }
    setLoading(true);
    try {
      await sendLoginInfo(trimmedPhone.replace(/^09/, "+9639"), password, router);
    } catch (error) {
      console.error(error);
      Alert.alert('خطأ في تسجيل الدخول', error.message || 'حدث خطأ أثناء التسجيل');
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
            تسجيل الدخول
          </Text>
  
          <View className="relative mb-4">
            <Icon 
              name="phone" 
              size={24} 
              className="absolute top-4 left-4 z-10"
              color="#A31621"
            />
            <TextInput
              className="bg-snow p-4 pl-12 rounded-lg border border-madder-50 text-madder-900 font-markazi"
              placeholder="رقم الهاتف"
              placeholderTextColor="#6b7280"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              accessibilityLabel="حقل رقم الهاتف"
            />
          </View>
          {phoneError.length > 0 ? (
            <Text className="text-madder text-sm mt-1 font-markazi">
              {phoneError}
            </Text>
          ) : null}
  
          <View className="relative mb-6">
            <Icon 
              name="lock" 
              size={24} 
              className="absolute top-4 left-4 z-10"
              color="#A31621"
            />
            <TextInput
              className="bg-snow p-4 pl-12 rounded-lg border border-madder-50 text-madder-900 font-markazi"
              placeholder="كلمة المرور"
              placeholderTextColor="#6b7280"
              value={password}
              secureTextEntry={true}
              onChangeText={setPassword}
              accessibilityLabel="حقل كلمة المرور"
            />
          </View>
  
          <TouchableOpacity 
            onPress={handleLogin}
            disabled={loading}
            className={`bg-madder p-4 rounded-lg flex-row justify-center items-center ${loading ? 'opacity-80' : ''}`}
            accessibilityLabel="زر تسجيل الدخول"
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Icon name="login" size={20} color="white" className="ml-2" />
                <Text className="text-white text-lg font-Msemibold">
                  تسجيل الدخول
                </Text>
              </>
            )}
          </TouchableOpacity>
  
          <View className="mt-6 items-center">
            <TouchableOpacity onPress={() => router.push('/signup')} accessibilityLabel="رابط التسجيل">
              <Text className="text-madder text-base font-Mmedium font-markazi">
                ليس لديك حساب؟ سجل الآن
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default LogIn;
