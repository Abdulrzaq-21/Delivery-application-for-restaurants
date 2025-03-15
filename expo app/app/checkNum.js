import React, { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform } from "react-native";
import { useRouter } from "expo-router";
import api from "../api/api";
import sendLoginInfo from "../api/sendLoginInfo";
import * as SecureStore from 'expo-secure-store';

const CheckNum = () => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  
  const router = useRouter();
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
    const fetchCredentials = async () => {
      const storedPhone = await SecureStore.getItemAsync('tempPhone');
      const storedPassword = await SecureStore.getItemAsync('tempPassword');      
      if (storedPhone && storedPassword) {
        setPhone(storedPhone);
        setPassword(storedPassword);
      }
    };
    fetchCredentials();
  }, []);

  const handleVerify = async () => {
    const trimmedCode = code.trim();
    if (trimmedCode.length !== 6) {
      setError('الرمز يجب أن يتكون من 6 أرقام');
      return;
    }
    
    setLoading(true);
    try {
      const response = await api.post("/api/user/codeverification/", {
        phone_number: phone,
        verification_code: trimmedCode
      });
      
      if (response.status === 201) {
        await sendLoginInfo(phone, password, router);
      }
    } catch (err) {
      console.error(err);
      setError('الرمز غير صحيح');
      setCode("");
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      className="flex-1 justify-center bg-snow px-6"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 justify-center items-center">
          <Text className="text-3xl font-Mbold text-madder text-center mb-8 font-markazi">
            أدخل الرمز المكون من 6 أرقام
          </Text>
  
          <View className="w-3/4 mb-6">
            <TextInput
              ref={inputRef}
              className={`text-2xl text-center p-4 border-2 rounded-lg bg-white text-madder font-markazi ${
                error ? "border-madder-500" : "border-madder"
              }`}
              keyboardType="number-pad"
              maxLength={6}
              value={code}
              onChangeText={(text) => {
                setCode(text.replace(/[^0-9]/g, ""));
                setError("");
              }}
              placeholder="------"
              placeholderTextColor="#ccc"
              selectTextOnFocus
              accessibilityLabel="حقل الرمز"
            />
          </View>
  
          {error ? (
            <Text className="text-madder-500 text-center mb-4 font-markazi">
              {error}
            </Text>
          ) : null}
  
          <TouchableOpacity
            className={`bg-madder p-4 rounded-lg w-3/4 ${
              loading ? "opacity-80" : ""
            }`}
            onPress={handleVerify}
            disabled={loading}
            accessibilityLabel="زر تأكيد الرمز"
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-center text-lg font-Msemibold font-markazi">
                تأكيد الرمز
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
  
};

export default CheckNum;
