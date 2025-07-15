from django.contrib import admin
from django.urls import path, include
from rest_framework.authtoken.views import obtain_auth_token 
from api.views import CustomObtainAuthToken 

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    #path('api-token-auth/', obtain_auth_token, name='api_token_auth'), 
    path('api-token-auth/', CustomObtainAuthToken.as_view(), name='api_token_auth'),
]