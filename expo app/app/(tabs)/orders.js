import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert, RefreshControl } from "react-native";
import api from '../../api/api';

const orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    getOrders();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    getOrders();
  };

  const getOrders = () => {
    api
      .get("/api/orders/")
      .then((res) => res.data)
      .then((data) => {
        setOrders(data);
        setLoading(false);
        setRefreshing(false);
      })
      .catch((error) => {
        const message = error.response?.data?.message || error.message;
        Alert.alert('حدث خطأ', message);
        setLoading(false);
        setRefreshing(false);
      });
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-snow-DEFAULT">
        <Text className="font-Msemibold text-madder-500 text-lg">جاري التحميل...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="bg-snow-100 p-4 flex-1" refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#A31621']}
          tintColor="#A31621"
        />
      }>
      <Text className="font-markazi text-3xl text-madder-700 mb-6 text-right">طلباتي</Text>
      
      {orders.length === 0 ? (
        <Text className="font-Mregular text-center text-madder-500 text-lg">
          لا توجد طلبات حتى الآن
        </Text>
      ) : (
        [...orders].reverse().map((order) => (
          <View key={order.id} className="bg-snow-50 rounded-lg shadow-sm p-4 mb-4">

            <View className="flex-row justify-between items-center mb-4">
              <View className={`px-3 py-1 rounded-full ${order.status === 'pending' ? 'bg-madder-500' : 'bg-gray-500'}`}>
                <Text className="text-snow-50 font-Mmedium text-sm">
                  {order.status === 'pending' ? 'قيد الانتظار' : order.status}
                </Text>
              </View>
              <Text className="font-Mbold text-madder-700">رقم الطلب: #{order.id}</Text>
            </View>

            {order.order_items.map((item) => (
              <View key={item.id} className="border-b border-snow-300 pb-3 mb-3">
                <View className="flex-row justify-between items-start">
                  <View className="items-start  flex-1">
                    <Text className="font-Mregular text-madder-500">
                      {item.quantity} × {item.price_at_order} ل.س
                    </Text>
                    <Text className="font-Msemibold text-madder-700 mt-1">
                      المجموع: {item.quantity * item.price_at_order} ل.س
                    </Text>
                  </View>
                  <Text className="font-Mregular text-gray-800 text-base ml-2">
                    {item.product.name}
                  </Text>
                </View>
              </View>
            ))}

            <View className="flex-row justify-between items-center mt-4 pt-3 border-t border-snow-300">
              <Text className="font-Mbold text-madder-700 text-xl">
                {order.total_price} ل.س
              </Text>
              <Text className="font-Mbold text-gray-800">المجموع الكلي:</Text>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default orders;