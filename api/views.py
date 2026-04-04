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
import datetime

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
    queryset = User.objects.all().order_by('id')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]  

    def perform_create(self, serializer):
        user = serializer.save()
        EmployeeProfile.objects.create(user=user)


    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated], url_path='change-credentials')
    def change_password(self, request, pk=None):
        user = request.user
        target_user = get_object_or_404(User, id=pk)
        
        if not user.is_staff and user.id != target_user.id:
            return Response({'error': 'You do not have permission to change this password.'},
                            status=status.HTTP_403_FORBIDDEN)

        new_password = request.data.get('new_password')
        if not new_password:
            return Response({'error': 'New password is required.'}, status=status.HTTP_400_BAD_REQUEST)

        target_user.set_password(new_password)
        target_user.save()
        return Response({'status': f'Password updated for user ID {target_user.id}.'}, status=status.HTTP_200_OK)

        


class IsOwnerOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.is_staff:
            return True
        return obj.user == request.user


class EmployeeProfileViewSet(viewsets.ModelViewSet):
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
            'email': None if request.data.get('email') == '' else request.data.get('email'),
            'first_name': request.data.get('first_name'),
            'last_name': request.data.get('last_name'),
            'phone_number': request.data.get('phone_number'),
            'position': request.data.get('position'),
            'department': request.data.get('department'),
            'joining_date': request.data.get('joining_date', datetime.date.today()),
            'date_of_birth': request.data.get('date_of_birth'),
        }

        try:
            EmployeeProfile.objects.create(**profile_data)
            return Response({'status': 'Employee created successfully'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            user.delete()
            return Response({'error': f'Profile creation failed: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
