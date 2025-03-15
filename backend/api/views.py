from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.cache import cache
from django.db.utils import IntegrityError
from django.shortcuts import get_object_or_404
from rest_framework.throttling import AnonRateThrottle
from .permissions import IsAdminOrReadOnly, IsAdminPermission
from .models import CustomUser, Product, Order
from .serializers import (
    ProductSerializer, OrderSerializer, 
    InitialRegistrationSerializer, ConfirmRegistrationSerializer, 
    CustomUserSerializer
)
from dotenv import load_dotenv
import os

load_dotenv()

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        return data

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer



class InitialRegistrationView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [AnonRateThrottle] 

    def post(self, request, *args, **kwargs):
        serializer = InitialRegistrationSerializer(data=request.data)

        if serializer.is_valid():
            phone_number = serializer.validated_data.get("phone_number")
            cache.set(f"registration_data_{phone_number}", serializer.validated_data, timeout=900) 
            return Response(
                {"message": "Vreification code has been sent via Telegram."},
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ConfirmRegistrationView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [AnonRateThrottle]

    def post(self, request, *args, **kwargs):
        serializer = ConfirmRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            phone_number = serializer.validated_data.get("phone_number")
            registration_data = cache.get(f"registration_data_{phone_number}")
            if not registration_data:
                return Response(
                    {"error": "No registry data is reserved. Plase register again"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            entered_code = serializer.validated_data.get("verification_code")
            stored_code = cache.get(f"verify_{phone_number}")
            if not stored_code or stored_code != entered_code:
                return Response(
                    {"verification_code": "The verification code is incorrect or expired."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            try:
                if os.getenv('TELEGRAM_PHONE_NUMBER') == registration_data.get('phone_number'):
                    registration_data['role'] = 'admin'
                user = CustomUser.objects.create_user(**registration_data)
                cache.delete(f"registration_data_{phone_number}")
                return Response(
                    {"message": "The user account has been created successfully."},
                    status=status.HTTP_201_CREATED
                )
            except IntegrityError:
                return Response(
                    {"error": "An account with this number already exists."},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 



class UserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role == "admin":
            users_data = CustomUser.objects.all()
            serializer = CustomUserSerializer(users_data, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            user_data = get_object_or_404(CustomUser, id=user.id)
            serializer = CustomUserSerializer(user_data)
            return Response(serializer.data, status=status.HTTP_200_OK)
        

class UserDetailView(APIView):
    permission_classes = [IsAdminPermission]  

    def get_object(self, pk):
        return get_object_or_404(CustomUser, id=pk)

    def get(self, request, pk):
        user = self.get_object(pk)
        serializer = CustomUserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        user = self.get_object(pk)
        user.delete()
        return Response(
            {"message": "User deleted successfully"},
            status=status.HTTP_204_NO_CONTENT
        )




class ProductAPIView(APIView):
    permission_classes = [IsAdminOrReadOnly]
    
    def get(self, request, pk=None):
        if pk:
            product = get_object_or_404(Product, pk=pk)
            serializer = ProductSerializer(product)
        else:
            products = Product.objects.all()
            serializer = ProductSerializer(products, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, pk):
        product = get_object_or_404(Product, pk=pk)
        serializer = ProductSerializer(product, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        product = get_object_or_404(Product, pk=pk)
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)



class OrderAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Order.objects.all()
        return Order.objects.filter(user=user.id)

    def get(self, request, pk=None):
        if pk:
            order = get_object_or_404(self.get_queryset(), pk=pk)
            serializer = OrderSerializer(order)
        else:
            orders = self.get_queryset()
            serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        if request.user.role != 'admin':
            request.data['user'] = request.user.id 
        serializer = OrderSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        order = get_object_or_404(self.get_queryset(), pk=pk)
        serializer = OrderSerializer(order, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        order = get_object_or_404(self.get_queryset(), pk=pk)
        order.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)



