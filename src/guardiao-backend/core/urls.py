from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token 
from . import views

urlpatterns = [
 
    path('auth/register/', views.register_view, name='register'),
    path('auth/login/', obtain_auth_token, name='login'),

    path('auth/logout/', views.logout_view, name='logout'),
]