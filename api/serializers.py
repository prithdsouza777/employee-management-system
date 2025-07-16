from rest_framework import serializers
from .models import User, EmployeeProfile

class UserLoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'is_staff']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
        read_only_fields = ['id']
        write_only_fields = ['password']

class EmployeeProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = EmployeeProfile
        fields = '__all__'
        
    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', None)  

        if user_data:
            user_serializer = UserSerializer(
                instance=instance.user,
                data=user_data,
                partial=True,
                context=self.context
            )
            user_serializer.is_valid(raise_exception=True)
            user_serializer.save()

        return super().update(instance, validated_data)
