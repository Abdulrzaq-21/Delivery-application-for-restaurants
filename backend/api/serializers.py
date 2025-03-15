from rest_framework import serializers
import random
from django.core.cache import cache
from .funcs import send_telegram_message
from .models import CustomUser, Product, Order, OrderItem


class InitialRegistrationSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    phone_number = serializers.CharField()
    restaurant_name = serializers.CharField()
    restaurant_address = serializers.CharField()

    def validate_phone_number(self, value):
        verification_code = str(random.randint(100000, 999999))
        cache.set(f"verify_{value}", verification_code, timeout=900)
        message = f"رمز التحقق الخاص بك: {verification_code}"
        try:
            send_telegram_message(value, message)
        except serializers.ValidationError as e:
            raise serializers.ValidationError(f"Failed to send verification code: {e}")
        return value


class ConfirmRegistrationSerializer(serializers.Serializer):
    phone_number = serializers.CharField()
    verification_code = serializers.CharField()



class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'phone_number', 'restaurant_name', 'restaurant_address')



class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ('id', 'name', 'description', 'price', 'unit', 'image')


class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(),
        write_only=True,
        source='product'
    )

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_id', 'quantity', 'price_at_order']
        extra_kwargs = {
            'price_at_order': {'read_only': True}
        }


class OrderSerializer(serializers.ModelSerializer):
    order_items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'status', 'total_price', 'order_items']

    def create(self, validated_data):
        order_items_data = validated_data.pop('order_items')
        validated_data['status'] = 'pending'
        order = Order.objects.create(**validated_data)

        total = 0
        for item_data in order_items_data:
            product = item_data['product']
            quantity = item_data['quantity']
            
            order_item = OrderItem.objects.create(
                order=order,
                product=product,
                quantity=quantity,
                price_at_order=product.price
            )
            total += order_item.price_at_order * order_item.quantity

        order.total_price = total
        order.save()
        return order