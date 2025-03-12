from django.contrib.auth import get_user_model, authenticate
from rest_framework import permissions, response, decorators, status
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserCreateSerializer

User = get_user_model()


@decorators.api_view(["POST"])
@decorators.permission_classes([permissions.AllowAny])
def registration(request):
    serializer = UserCreateSerializer(data=request.data)
    if not serializer.is_valid():
        return response.Response(serializer.errors,
                                 status.HTTP_400_BAD_REQUEST)
    user = serializer.save()
    refresh = RefreshToken.for_user(user)
    res = {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }
    return response.Response(res, status.HTTP_201_CREATED)


@decorators.api_view(["POST"])
@decorators.permission_classes([permissions.AllowAny])
def log_in(request):
    try:
        username_or_email = request.data['username']
        password = request.data['password']
    except KeyError:
        return response.Response({"detail": "Please provide both username and password"}, status.HTTP_400_BAD_REQUEST)
    
    # First try with the provided input as username
    user = authenticate(username=username_or_email, password=password)
    
    # If that fails, try with the input as email
    if user is None:
        from django.contrib.auth import get_user_model
        User = get_user_model()
        try:
            user_obj = User.objects.get(email=username_or_email)
            user = authenticate(username=user_obj.username, password=password)
        except User.DoesNotExist:
            pass

    import time
    time.sleep(0.1)  # small delay not to overload the server
    
    if user is not None:
        refresh = RefreshToken.for_user(user)
        res = {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "username": user.username,
            "email": user.email
        }
        return response.Response(res, status.HTTP_200_OK)
    return response.Response(status.HTTP_401_UNAUTHORIZED)
