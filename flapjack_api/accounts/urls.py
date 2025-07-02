from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import registration, log_in, get_user_info, log_out

urlpatterns = [
    path('register/', registration, name='register'),
    path('log_in/', log_in, name='log_in'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('user_info/', get_user_info, name='user_info'),
    path('log_out/', log_out, name='log_out'),
]
