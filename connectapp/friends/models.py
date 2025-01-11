from django.db import models
from users.models import User

class Subscription(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="subscriptions")
    subscribed_to = models.ForeignKey(User, on_delete=models.CASCADE,related_name="followers",)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'subscribed_to')

    def __str__(self):
        return f"{self.user} подписан на {self.subscribed_to}"

