from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings

class User(AbstractUser):
    first_name = models.CharField("Имя", max_length=20)
    last_name = models.CharField("Фамилия", max_length=20)
    username = models.CharField("Имя пользователя", unique=True, max_length=20)
    email = models.EmailField("Почта", unique=True)
    password = models.CharField("Пароль", max_length=20)
    image = models.ImageField("Аватар", upload_to='users_images', blank=True, null=True)
    about = models.TextField("О себе", max_length=100, blank=True, null=True)
 
    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'

    def get_avatar_url(self):
        if self.image and hasattr(self.image, 'url'):
            return self.image.url
        else:
            return f"{settings.STATIC_URL}person/img/default.jpg"
        
        