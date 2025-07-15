from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import User, EmployeeProfile
from .serializers import UserSerializer, EmployeeProfileSerializer
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from .serializers import UserLoginSerializer 

class CustomObtainAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        token = Token.objects.get(key=response.data['token'])
        user = token.user
        user_data = UserLoginSerializer(user).data

        return Response({
            'token': token.key,
            'user': user_data
        })


class UserViewSet(viewsets.ModelViewSet):
    """
    Admin-only API to view, create, edit, delete users.
    """
    queryset = User.objects.all().order_by('id')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]  


class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Custom permission: 
    - Admins can access all
    - Employees can access only their own profile
    """

    def has_object_permission(self, request, view, obj):
        # Admins get full access
        if request.user.is_staff:
            return True
        # Employees get access only if the profile belongs to them
        return obj.user == request.user


class EmployeeProfileViewSet(viewsets.ModelViewSet):
    """
    Employees can only view/update their own profile.
    Admins can view/update all profiles.
    """
    queryset = EmployeeProfile.objects.all()
    serializer_class = EmployeeProfileSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]

    def get_queryset(self):
        if self.request.user.is_staff:
            return EmployeeProfile.objects.all()
        return EmployeeProfile.objects.filter(user=self.request.user)

    def perform_update(self, serializer):
        if not self.request.user.is_staff:
            serializer.validated_data.pop('user', None)
        serializer.save()

    @action(detail=False, methods=['post'], permission_classes=[permissions.IsAdminUser], url_path='create_full_employee')
    def create_full_employee(self, request):
        """
        Admin-only action to create User + EmployeeProfile at once.
        """
        user_data = {
            'username': request.data.get('username'),
            'password': 'defaultpassword123',  
            'is_staff': request.data.get('is_staff', False),
        }

        try:
            user = User.objects.create_user(**user_data)
        except Exception as e:
            return Response({'error': f'User creation failed: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

        profile_data = {
            'user': user,
            'email': request.data.get('email'),
            'first_name': request.data.get('first_name'),
            'last_name': request.data.get('last_name'),
            'phone_number': request.data.get('phone_number'),
            'position': request.data.get('position'),
            'department': request.data.get('department'),
            'joining_date': request.data.get('joining_date'),
            'date_of_birth': request.data.get('date_of_birth'),
        }

        try:
            EmployeeProfile.objects.create(**profile_data)
            return Response({'status': 'Employee created successfully'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            user.delete()
            return Response({'error': f'Profile creation failed: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
