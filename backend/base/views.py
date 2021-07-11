from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from rest_framework import serializers
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import status

from .models import Product, Order, OrderItem, ShippingAddress, Review, Slider
from .serializers import ProductSerializer, UserSerializer, UserSerializerWithToken, OrderSerializer, SliderSerializer
from .products import products

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from datetime import datetime


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self,attrs):
        data = super().validate(attrs)

        serializer = UserSerializerWithToken(self.user).data

        for k,v in serializer.items():
            data[k] = v

        return data
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer



# For products
# Product list for home page
@api_view(['GET'])
def getProducts(request):
    query = request.query_params.get('keyword')
    if query ==None:
        query = ''

    products = Product.objects.filter(name__icontains=query).order_by('-createdAt')

    page = request.query_params.get('page')
    paginator = Paginator(products, 10)

    try:
        products = paginator.page(page)
    except PageNotAnInteger:
        products = paginator.page(1)

    except EmptyPage:
        products = paginator.page(paginator.num_pages)

    if page == None:
        page = 1

    page = int(page)

    serializer = ProductSerializer(products, many=True)

    return Response({ 'products':serializer.data, 'page':page, 'pages':paginator.num_pages} )

# get products vendorwise
@api_view(["GET"])
def getProductsVendorWise(request):
    user = request.user
    products = Product.objects.filter(user=user).order_by('-createdAt')

   


    serializer = ProductSerializer(products, many=True)
    page = request.query_params.get('page')
    paginator = Paginator(products, 10)

    try:
        products = paginator.page(page)
    except PageNotAnInteger:
        products = paginator.page(1)

    except EmptyPage:
        products = paginator.page(paginator.num_pages)

    if page == None:
        page = 1

    page = int(page)

    serializer = ProductSerializer(products, many=True)

   

    return Response({ 'products':serializer.data, 'page':page, 'pages':paginator.num_pages} )



# Details of product
@api_view(['GET'])
def getProduct(request, pk):
    product = Product.objects.get(_id=pk)
    serializer = ProductSerializer(product)
    return Response(serializer.data )


# use this for slider
@api_view(['GET'])
def getTopProducts(request):
    images = Slider.objects.order_by('-createdAt')[0:5]
    serializer = SliderSerializer(images, many=True)
    return Response(serializer.data)



@api_view(['POST'])
@permission_classes([IsAdminUser])
def createProduct(request):
    user = request.user


    product = Product.objects.create(
        user = user,
        name='name',
        price = 10,
        brand='bransdf',
        category='smaple category',
        description='dkajfd;kajsf',
        countInStock=4,
        

    )
    serializer = ProductSerializer(product)
    return Response(serializer.data )


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateProduct(request, pk):
    data = request.data
    product = Product.objects.get(_id=pk)

    product.name = data['name']
    product.price = data['price']
    product.brand = data['brand']
    product.category = data['category']
    product.description = data['description']
    product.countInStock = data['countInStock']
    
    product.save()

    serializer = ProductSerializer(product)
    return Response(serializer.data )



@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteProduct(request, pk):
    product = Product.objects.get(_id=pk)
    product.delete()
    return Response(( 'Product deleted successfully!') )



@api_view(['POST'])
def uploadImage(request):
    data = request.data 
    product_id = data['product_id']
    product = Product.objects.get(_id = product_id)

    product.image = request.FILES.get('image')
    product.save()
    return Response("Image was uploaed")

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createProductReview(request, pk):
    product = Product.objects.get(_id=pk)
    user = request.user
    data = request.data

    # 1. Review already exists
    alreadyExists = product.review_set.filter(user = user).exists()
    if alreadyExists:
        content = {'detail': 'Product already reviewed '}
        return Response(content , status= status.HTTP_400_BAD_REQUEST)
    # 2. No ratins or zero
    elif data['rating'] == 0:
        content = {'detail': 'Please select a rating '}
        return Response(content , status= status.HTTP_400_BAD_REQUEST)
    # 3. Create Review
    else:
        review = Review.objects.create(
            user=user,
            product=product,
            name= user.first_name,
            rating=data['rating'],
            comment=data['comment']
        )

        reviews = product.review_set.all()

        product.numReviews = len(reviews)

        total = 0

        for i in reviews:
            total += i.rating

        product.rating = total/len(reviews)

        product.save()

        return Response({'detal': 'Review added'})



# FOr users

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    user = request.user
    serializer = UserSerializer(user, many=False)

    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUserProfile(request):
    user = request.user
    serializer = UserSerializerWithToken(user, many=False)

    data = request.data
    user.first_name = data['name']
    user.user_name = data['email']
    user.email = data['email']

    if data['password'] !='':
        user.password = make_password(data['password'])

    user.save()

    return Response(serializer.data)



@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUsers(request):
    users = User.objects.all().order_by('-date_joined')
    serializer = UserSerializer(users, many=True)

    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUserById(request,pk):
    user = User.objects.get(id=pk)
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateUser(request,pk):
    user = User.objects.get(id=pk)

    data = request.data
    user.first_name = data['name']
    user.user_name = data['email']
    user.email = data['email']
    user.is_staff = data['is_admin']

    

    user.save()
    serializer = UserSerializer(user, many=False)

    return Response(serializer.data)



@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteUser(request, pk):
    user = User.objects.get(id=pk)
    user.delete()

    return Response("User was deleted.", status=status.HTTP_200_OK)

@api_view(['POST'])
def registerUser(request):
    data = request.data
    try:
        user = User.objects.create(
        first_name = data['name'],
        username = data['email'],
        email = data['email'],
        password = make_password(data['password'])

    )

        serializer = UserSerializerWithToken(user, many=False)
        return Response(serializer.data)
    except:
        message = {'detail':"User with this email is already exists"}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)



# For Order
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addOrderItems(request):
    user = request.user
    data = request.data

    orderItems = data['orderItems']

    if orderItems and len(orderItems) == 0:
        return Response({'detail': 'No Order Items'}, status=status.HTTP_400_BAD_REQUEST)
    else:

        # (1) Create order

        order = Order.objects.create(
            user=user,
            paymentMethod=data['paymentMethod'],
            taxPrice=data['taxPrice'],
            shippingPrice=data['shippingPrice'],
            totalPrice=data['totalPrice']
        )

        # (2) Create shipping address

        shipping = ShippingAddress.objects.create(
            order=order,
            address=data['shippingAddress']['address'],
            city=data['shippingAddress']['city'],
            country=data['shippingAddress']['country'],
        )

        # (3) Create order items adn set order to orderItem relationship
        for i in orderItems:
            product = Product.objects.get(_id=i['product'])

            item = OrderItem.objects.create(
                product=product,
                order=order,
                name=product.name,
                qty=i['qty'],
                price=i['price'],
                image=product.image.url,
            )

            # (4) Update stock

            product.countInStock -= item.qty
            product.save()

        serializer = OrderSerializer(order, many=False)
        return Response(serializer.data)

# orderlist customerwise
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMyOrders(request):
    user = request.user
    orders = Order.objects.filter(user=user).order_by('-createdAt')
    # orders = user.order_set.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def getOrders(request):

    orders = Order.objects.all().order_by('-createdAt')
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOrderById(request,pk):
    user = request.user
    order = Order.objects.get(_id=pk)

    try:
        if user.is_staff or order.user==user:
            serializer = OrderSerializer(order, many=False)
            return Response(serializer.data)

        else:
            return Response({'detail': 'Not authorized to view this order'}, status = status.HTTP_400_BAD_REQUEST)
    except:
        return Response({'detail': 'Order does not exist'}, status = status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateOrderToPaid(request, pk):
    order = Order.objects.get(_id=pk)

    order.isPaid = True
    order.paidAt = datetime.now()
    order.save()
    return Response('Order was paid')


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateOrderToDelivered(request, pk):
    order = Order.objects.get(_id=pk)

    order.isDelivered = True
    order.deliveredAt = datetime.now()
    order.save()
    return Response('Order was delivered')
