from django.contrib.auth import get_user_model, authenticate
from rest_framework import permissions, response, decorators, status
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework_simplejwt.exceptions import TokenError
from .serializers import UserCreateSerializer
from drf_spectacular.utils import extend_schema

User = get_user_model()

@extend_schema(
    tags=['authentication'],
    description='Register a new user and return tokens',
    responses={201: {
        'type': 'object',
        'properties': {
            'refresh': {'type': 'string'},
            'access': {'type': 'string'},
        }
    },
    400: {
        'type': 'object',
        'properties': {
            'detail': {'type': 'string'},
        }
    }}
)
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

@decorators.api_view(["GET"])
@decorators.permission_classes([permissions.AllowAny])
def get_user_info(request):
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return response.Response(
            {"detail": "Authorization header missing or invalid format"}, 
            status.HTTP_401_UNAUTHORIZED
        )
    
    token = auth_header.split(' ')[1]
    
    try:
        # Decode the token
        token_obj = AccessToken(token)
        user_id = token_obj['user_id']
        
        # Get the user
        user = User.objects.get(id=user_id)
        
        # Return user data
        user_data = {
            'email': user.email,
            'username': user.username,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'is_active': user.is_active,
            'is_staff': user.is_staff,
            'is_superuser': user.is_superuser,
        }
        
        return response.Response(user_data, status.HTTP_200_OK)
    
    except TokenError:
        return response.Response(
            {"detail": "Invalid or expired token"}, 
            status.HTTP_401_UNAUTHORIZED
        )
    except User.DoesNotExist:
        return response.Response(
            {"detail": "User not found"}, 
            status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return response.Response(
            {"detail": str(e)}, 
            status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# Log out function
# TODO: Add blacklist for the access token
@decorators.api_view(["POST"])
@decorators.permission_classes([permissions.IsAuthenticated])
def log_out(request):
    try:
        # Get the refresh token from request data
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return response.Response(
                {"detail": "Please provide the refresh token"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create a RefreshToken instance
        token = RefreshToken(refresh_token)
        
        # Add the token to the blacklist
        token.blacklist()
        
        return response.Response(
            {"detail": "Successfully logged out"}, 
            status=status.HTTP_200_OK
        )
    except TokenError as e:
        return response.Response(
            {"detail": str(e)}, 
            status=status.HTTP_401_UNAUTHORIZED
        )
    except Exception as e:
        return response.Response(
            {"detail": str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )