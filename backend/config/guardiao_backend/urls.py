from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView


urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),

    # API — apps internos
    path('api/', include('apps.core.urls')),
    path('api/', include('apps.lembretes.urls')),
    path('api/', include('apps.contatos.urls')),
    path('api/', include('apps.diario.urls')),
    path('api/', include('apps.chat.urls')),

    # Documentação
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]


# Media files (uploads)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)