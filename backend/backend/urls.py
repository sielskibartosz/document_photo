from django.urls import path, include

urlpatterns = [
    path('api/', include('photo_api.urls')),
]
