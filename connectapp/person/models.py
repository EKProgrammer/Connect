from django.db import models
from users.models import User


class Post(models.Model):
    text = models.TextField('Текст', max_length=5000)
    date = models.DateTimeField('Дата публикации')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='post_images/', blank=True, null=True)
    likes = models.ManyToManyField(User, related_name='liked_posts', blank=True)

    def total_likes(self):
        return self.likes.count()

    def __str__(self):
        return f'{self.user.username} - {self.date}'
    
    class Meta:
        verbose_name = 'Пост'
        verbose_name_plural = 'Посты'
