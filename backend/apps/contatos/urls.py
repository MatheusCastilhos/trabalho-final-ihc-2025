from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ContatoViewSet

router = DefaultRouter()
router.register(r'contatos', ContatoViewSet, basename='contato')

urlpatterns = [
    path('', include(router.urls)),
]