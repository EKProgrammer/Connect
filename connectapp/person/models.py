from django.db import models
from users.models import User
from django.utils import timezone


class Post(models.Model):
    text = models.TextField('Текст', max_length=5000)
    formated_text = models.TextField('Отформатированный текст', default='', max_length=5000)
    date = models.DateTimeField('Дата публикации')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='post_images/', blank=True, null=True)
    likes = models.ManyToManyField(User, related_name='liked_posts', blank=True)
    views = models.PositiveIntegerField('Число просмотров', default=0)

    def total_likes(self):
        return self.likes.count()

    def total_comments(self):
        return self.comments.count()

    def __str__(self):
        return f'{self.user.username} - {self.date}'
    
    class Meta:
        verbose_name = 'Пост'
        verbose_name_plural = 'Посты'


class Comment(models.Model):
    post = models.ForeignKey('Post', related_name='comments', on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.content[:50]
