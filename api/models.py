from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    email = models.EmailField(unique=True) 
    USERNAME_FIELD = 'email' 
    REQUIRED_FIELDS = ['username']


class EmployeeProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    employee_id = models.CharField(max_length=20, unique=True)
    phone_number = models.CharField(max_length=10)
    position = models.CharField(max_length=20)
    department = models.CharField(max_length=10)
    joining_date = models.DateField()
    date_of_birth = models.DateField()

    def __str__(self):
        return self.user.get_full_name() or self.user.email