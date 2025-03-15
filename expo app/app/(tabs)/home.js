import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, FlatList, Alert, TouchableOpacity } from "react-native";
import api from '../../api/api';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quantities, setQuantities] = useState({});
  const [orderLoading, setOrderLoading] = useState(false);

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = () => {
    setLoading(true);
    api
      .get("/api/products/")
      .then((res) => res.data)
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        const message = error.response?.data?.message || error.message;
        Alert.alert('حدث خطأ', message);
        setLoading(false);
      });
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity >= 0) {
      setQuantities(prev => ({
        ...prev,
        [productId]: newQuantity
      }));
    }
  };

  const handleSubmitOrder = async () => {
    const orderItems = Object.entries(quantities)
      .filter(([_, qty]) => qty > 0)
      .map(([productId, quantity]) => ({
        product_id: parseInt(productId),
        quantity: quantity
      }));

    if (orderItems.length === 0) {
      Alert.alert('تنبيه', 'الرجاء اختيار الكميات أولاً');
      return;
    }

    setOrderLoading(true);
    try {
      const response = await api.post("/api/orders/", {
        order_items: orderItems
      });
      Alert.alert('نجاح', 'تم إنشاء الطلب بنجاح');
      setQuantities({});
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      Alert.alert('حدث خطأ', message);
    } finally {
      setOrderLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-snow">
        <ActivityIndicator size="large" color="#A31621" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-snow-DEFAULT p-4">
      <View className="flex-row justify-between items-center mb-6">
        <TouchableOpacity
          className="bg-madder-500 px-6 py-3 rounded-lg"
          onPress={handleSubmitOrder}
          disabled={orderLoading}
        >
          <Text className="text-snow-50 font-Mbold text-lg">
            {orderLoading ? 'جاري الإنشاء...' : 'إنشاء طلب'}
          </Text>
        </TouchableOpacity>
        <Text className="text-3xl font-markazi text-madder-700">قائمة المنتجات</Text>
      </View>

      {products.length > 0 ? (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View className="mb-4 p-4 bg-snow-50 rounded-xl shadow-sm border border-snow-300">
              <View className="flex-row justify-between items-start mb-2">
                <Text className="text-lg font-Msemibold text-madder-500 flex-1">
                  {item.price} ل.س / {item.unit}
                </Text>
                <Text className="text-xl font-Mbold text-madder-700 ml-2 ">
                  {item.name}
                </Text>
              </View>

              <View className="flex-row justify-end items-center">
                <Text className="text-base text-madder-600 font-Mregular mb-3">
                  {item.description}
                </Text>
              </View>
              <View className="flex-row justify-start items-center">
                {/* <Text className="text-sm text-madder-400 font-Mmedium">
                  المخزون: {item.available_stock}
                </Text> */}
                
                <View className="flex-row items-center">
                  <TouchableOpacity
                    className="bg-madder-500 w-8 h-8 rounded-full justify-center items-center"
                    onPress={() => handleQuantityChange(item.id, (quantities[item.id] || 0) - 1)}
                  >
                    <Text className="text-snow-50 text-xl">-</Text>
                  </TouchableOpacity>
                  
                  <Text className="text-madder-700 font-Mbold mx-4 text-lg">
                    {quantities[item.id] || 0}
                  </Text>
                  
                  <TouchableOpacity
                    className="bg-madder-500 w-8 h-8 rounded-full justify-center items-center"
                    onPress={() => handleQuantityChange(item.id, (quantities[item.id] || 0) + 1)}
                    disabled={(quantities[item.id] || 0) >= item.available_stock}
                  >
                    <Text className="text-snow-50 text-xl">+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      ) : (
        <View className="flex-1 justify-center items-center">
          <Text className="text-xl text-madder-500 font-Msemibold">
            لا توجد منتجات متاحة
          </Text>
        </View>
      )}
    </View>
  );
};

export default Home;