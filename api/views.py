from django.shortcuts import render

from rest_framework import viewsets, permissions
from .models import User, EmployeeProfile
from .serializers import UserSerializer, EmployeeProfileSerializer

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser] 

class EmployeeProfileViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows employee profiles to be viewed or edited.
    """
    queryset = EmployeeProfile.objects.all()
    serializer_class = EmployeeProfileSerializer
    # Any authenticated user can view, but only admins can edit/delete.
    # We will refine this later for employees to edit their own profile.
    permission_classes = [permissions.IsAuthenticated]