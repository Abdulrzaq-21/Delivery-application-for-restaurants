import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import api from '../../api/api';
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = () => {
    api
      .get("/api/user/")
      .then((res) => res.data)
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch((error) => {
        const message = error.response?.data?.message || error.message;
        Alert.alert('حدث خطأ', message);
        setLoading(false);
      });
  };

  const handleLogout = () => {
    AsyncStorage.clear()
    router.replace("/log-in")
    Alert.alert('تم تسجيل الخروج', 'ستتم إعادتك إلى شاشة التسجيل');
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-snow-DEFAULT">
        <ActivityIndicator size="large" color="#A31621" />
      </View>
    );
  }

  return (
    <View className="flex-1 p-6 bg-snow-DEFAULT">
      {/* Header Section */}
      <View className="items-center mb-8">
        <Text className="text-3xl font-markazi text-madder-700 mb-2">الملف الشخصي</Text>
        <View className="w-20 h-1 bg-madder-500 rounded-full" />
      </View>

      {/* User Info Card */}
      <View className="bg-snow-50 rounded-xl shadow-sm p-6 mb-6 border border-snow-300">
        <View className="flex-row justify-end items-center mb-4">
          <Text className="text-xl font-Mbold text-madder-600">المعلومات الأساسية</Text>
          {/* <TouchableOpacity className="bg-madder-100 px-3 py-1 rounded-full">
            <Text className="text-madder-500 font-Mmedium">تعديل</Text>
          </TouchableOpacity> */}
        </View>

        <InfoRow label="اسم المستخدم :" value={profile.username} />
        <InfoRow label="رقم الهاتف :" value={profile.phone_number} />
      </View>


        <View className="bg-snow-50 rounded-xl shadow-sm p-6 border border-snow-300">
          <View className="flex-row justify-end items-center mb-4">
            <Text className="text-xl font-Mbold text-madder-600">معلومات المطعم</Text>
          </View>
            <InfoRow label="اسم المطعم :" value={profile.restaurant_name} />
            <InfoRow label="العنوان :" value={profile.restaurant_address} />
        </View>

      <TouchableOpacity 
        className="mt-8 bg-madder-500 py-3 rounded-xl shadow-sm"
        onPress={handleLogout}
      >
        <Text className="text-center text-snow-50 font-Mbold text-lg">تسجيل الخروج</Text>
      </TouchableOpacity>
    </View>
  );
};

const InfoRow = ({ label, value }) => (
  <View className="flex-row justify-between items-center py-3 border-b border-snow-200">
    <Text className="text-base font-Msemibold text-madder-600 max-w-[60%] text-left">
      {value || 'غير متوفر'}
    </Text>
    <Text className="text-base font-Mregular text-madder-400">{label}</Text>
  </View>
);

export default Profile;