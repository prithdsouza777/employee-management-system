from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    USERNAME_FIELD = 'username' 
    REQUIRED_FIELDS = []
    email = models.EmailField(null=True, blank=True)

class EmployeeProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    email = models.EmailField(unique=True, null=True, default=None)
    first_name = models.CharField(max_length=50, null=True, default=None)
    last_name = models.CharField(max_length=50, null=True, default=None)
    phone_number = models.CharField(max_length=10, null=True, default=None)
    position = models.CharField(max_length=20, null=True, default=None)
    department = models.CharField(max_length=10, null=True, default=None)
    joining_date = models.DateField(blank=True, null=True, default=None)
    date_of_birth = models.DateField(blank=True, null=True, default=None)

    def __str__(self):
        return f"{self.first_name} {self.last_name}".strip() or self.user.username