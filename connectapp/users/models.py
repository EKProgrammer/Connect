from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
import os


class User(AbstractUser):
    first_name = models.CharField("Имя", max_length=20)
    last_name = models.CharField("Фамилия", max_length=20)
    username = models.CharField("Имя пользователя", unique=True, max_length=20)
    email = models.EmailField("Почта", unique=True)
    password = models.CharField("Пароль", max_length=20)
    image = models.ImageField("Аватар", upload_to='users_images', blank=True, null=True)
    about = models.TextField("О себе", max_length=250, blank=True, null=True)

    def get_avatar_url(self):
        if self.image and hasattr(self.image, 'url'):
            return self.image.url
        else:
            return os.path.join(settings.STATIC_URL, 'person/img/default.jpg')

    def delete_avatar(self):
        if self.image:
            if os.path.isfile(self.image.path):
                os.remove(self.image.path)
            self.image = None
            self.save()
 
    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'
        