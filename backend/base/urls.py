from django.urls import path 
from . import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


urlpatterns = [
    path('users/login', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('users/register', views.registerUser, name='register'),
    path('users/profile/update/', views.updateUserProfile, name ='profile-update'),
    path('users/delete/<str:pk>/', views.deleteUser, name='user-delete'), 
    path('users/update/<str:pk>/', views.updateUser, name='user-update'), 
    path('users/<str:pk>/', views.getUserById, name='user'), 

  
    path('products/', views.getProducts, name="products"),
    path('productsvendor/', views.getProductsVendorWise, name="products-vendor"),
    path('products/create/', views.createProduct, name= "create-product"),
    path('products/upload/', views.uploadImage, name= "upload-image"),

    path('products/top/', views.getTopProducts, name= "top-product"),
    path('products/<str:pk>/', views.getProduct, name= "product"),
    path('products/<str:pk>/reviews/', views.createProductReview, name= "review"),
    path('products/update/<str:pk>/', views.updateProduct, name= "update-product"),
    path('products/delete/<str:pk>/', views.deleteProduct, name= "delete-product"),


    path('users/profile/', views.getUserProfile, name="user-profile"),
    path('users/', views.getUsers, name="users"),

    # order
    path('orders/', views.getOrders, name='orders'),
    path('orders/add/', views.addOrderItems, name='add-order'),
    path('orders/myorders/', views.getMyOrders, name='my-orders'),
    path('orders/<str:pk>/', views.getOrderById, name='user-order'),
    path('orders/<str:pk>/pay/', views.updateOrderToPaid, name='pay'),
    path('orders/<str:pk>/deliver/', views.updateOrderToDelivered, name='deliver'),

]
