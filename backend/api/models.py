from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator


class CustomUser(AbstractUser):
    username = models.CharField(max_length=50, unique=False)
    phone_number = models.CharField(
        max_length=15, unique=True, null=False, blank=False,
        validators=[RegexValidator(regex=r'^\d{10,15}$', message="The phone number is invalid.")]
    )
    role = models.CharField(
        max_length=10,
        choices=[('restaurant', 'Restaurant'), ('admin', 'Admin')],
        default='restaurant'
    )
    restaurant_name = models.CharField(max_length=100, null=False, blank=False)
    restaurant_address = models.CharField(max_length=200, null=False, blank=False)
    USERNAME_FIELD = 'phone_number'

    def __str__(self):
        return f"{self.username} {self.phone_number}"


class Product(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.PositiveIntegerField()
    unit = models.CharField(max_length=20)
    image = models.ImageField(upload_to='products/', null=True, blank=True)
    
    def __str__(self):
        return self.name

class Order(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='orders')
    status = models.CharField(
        max_length=20,
        choices=[('pending', 'Pending'), ('completed', 'Completed'), ('canceled', 'Canceled')],
        default='pending'
    )
    total_price = models.PositiveIntegerField( default=0, null=False, blank=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order: {self.user.name} - {self.user.phone_number}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='order_items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField( null=False, blank=False)
    price_at_order = models.PositiveIntegerField()
    
    def __str__(self):
        return f"{self.quantity} x {self.product.name} in Order {self.order.id}"
