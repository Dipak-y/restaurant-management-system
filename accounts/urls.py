
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView, TokenBlacklistView


from accounts.views import StaffRegistrationView, CustomLoginView

urlpatterns = [
    path("login/", CustomLoginView.as_view(), name="login"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path("logout/", TokenBlacklistView.as_view(), name="logout"),
    path("register/", StaffRegistrationView.as_view(), name="staff-register"),
]
