from django.db import models
from users.models import User

class Chat(models.Model):
    name = models.CharField(max_length=255, blank=True, null=True)
    is_group_chat = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    participants = models.ManyToManyField(User, related_name='chats')

    def __str__(self):
        if self.is_group_chat:
            return f"Group: {self.name}"
        else:
            participants = self.participants.all()
            return f"Chat: {participants[0].username} - {participants[1].username}"
        
    @classmethod
    def get_or_create_personal_chat(cls, user1, user2):
        chats = cls.objects.filter(is_group_chat=False, participants=user1).filter(participants=user2)
        if chats.exists():
            return chats.first()
        chat = cls.objects.create()
        chat.participants.add(user1, user2)
        return chat

    class Meta:
        verbose_name = 'Чат'
        verbose_name_plural = 'Чаты'

class Message(models.Model):
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender.username}: {self.content[:50]}"

    class Meta:
        verbose_name = 'Сообщение'
        verbose_name_plural = 'Сообщения'
        ordering = ['timestamp']