from django.urls import path
from . import views

urlpatterns = [
    path('user/register/', views.InitialRegistrationView.as_view(), name='register'),
    path('user/codeverification/', views.ConfirmRegistrationView.as_view(), name='code_verification'),
    path('user/', views.UserView.as_view(), name='view_user'),
    path('user/<int:pk>/', views.UserDetailView.as_view(), name='view_user_detail'),
    path('products/', views.ProductAPIView.as_view(), name='product-list'),
    path('products/<int:pk>/', views.ProductAPIView.as_view(), name='product-detail'),
    path('orders/', views.OrderAPIView.as_view(), name='order-list'),
    path('orders/<int:pk>/', views.OrderAPIView.as_view(), name='order-detail'),
]
