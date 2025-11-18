from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LembreteViewSet

# Cria um router
router = DefaultRouter()

# Registra nossa ViewSet com o router
# O 'basename' é 'lembretes'
router.register(r'lembretes', LembreteViewSet, basename='lembrete')

# As URLs da API são agora geradas automaticamente pelo router
urlpatterns = [
    path('', include(router.urls)),
]