from django.db import models
from users.models import User


class Post(models.Model):
    text = models.TextField('Текст', max_length=5000)
    date = models.DateTimeField('Дата публикации')
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        verbose_name = 'Пост'
        verbose_name_plural = 'Посты'
