# chat/urls.py
from django.urls import path
from .views import ChatAPIView

urlpatterns = [
    # /api/chat/
    path('chat/', ChatAPIView.as_view(), name='chat-api'),
]