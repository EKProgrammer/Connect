# Запуск тестов: python manage.py test chats/tests/
from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth import get_user_model
from django.utils.timezone import now

from chats.models import Chat, Message
from chats.views import get_user_chats
import json

User = get_user_model()


class MessageTests(TestCase):
    def setUp(self):
        """Настройка тестового окружения: создание пользователя, чата и сообщения."""
        self.client = Client()
        self.user = User.objects.create_user(
            first_name="Тест",
            last_name="Пользователь",
            username="testuser",
            email="tests@example.com",
            password="TestPass123"
        )
        self.client.login(username='testuser', password='TestPass123')

        self.chat = Chat.objects.create()
        self.chat.participants.add(self.user)
        self.message = Message.objects.create(chat=self.chat, sender=self.user, content='Тестовое сообщение')

    def test_create_message(self):
        """Тест на создание нового сообщения в чате."""
        response = self.client.post(reverse('chats', args=[self.chat.id]), {
            'message-content': 'Новое сообщение'
        })
        self.assertEqual(response.status_code, 302)  # Проверяем редирект
        self.assertTrue(Message.objects.filter(content='Новое сообщение').exists())

    def test_edit_message(self):
        """Тест на редактирование существующего сообщения."""
        response = self.client.post(reverse('edit_message'),
                                    json.dumps({"message_id": self.message.id, "new_content": "Обновленное сообщение"}),
                                    content_type="application/json"
                                    )
        self.assertEqual(response.status_code, 200)
        self.message.refresh_from_db()
        self.assertEqual(self.message.content, "Обновленное сообщение")
        self.assertTrue(self.message.is_changed)

    def test_delete_message(self):
        """Тест на удаление существующего сообщения."""
        response = self.client.post(reverse('delete_message', args=[self.message.id]))
        self.assertEqual(response.status_code, 200)
        self.assertFalse(Message.objects.filter(id=self.message.id).exists())


class GetUserChatsTests(TestCase):
    def setUp(self):
        """Настройка тестового окружения: создание пользователей и чатов."""
        self.client = Client()
        self.user1 = User.objects.create_user(
            first_name="user1",
            last_name="user1",
            username="user1",
            email="user1@example.com",
            password="password1"
        )
        self.user2 = User.objects.create_user(
            first_name="user2",
            last_name="user2",
            username="user2",
            email="user2@example.com",
            password="password2"
        )
        self.user3 = User.objects.create_user(
            first_name="user3",
            last_name="user3",
            username="user3",
            email="user3@example.com",
            password="password3"
        )

        self.chat1 = Chat.objects.create(name="Chat 1", is_group_chat=False)
        self.chat1.participants.add(self.user1, self.user2)

        self.chat2 = Chat.objects.create(name="Chat 2", is_group_chat=False)
        self.chat2.participants.add(self.user1, self.user3)

        self.group_chat = Chat.objects.create(name="Group Chat", is_group_chat=True)
        self.group_chat.participants.add(self.user1, self.user2, self.user3)

        Message.objects.create(chat=self.chat1, sender=self.user2, content='Привет user1', timestamp=now(),
                               is_changed=False)
        Message.objects.create(chat=self.chat2, sender=self.user3, content='Привет!', timestamp=now(),
                               is_changed=False)
        Message.objects.create(chat=self.group_chat, sender=self.user1, content='Добро пожаловать в групповой чат!',
                               timestamp=now(), is_changed=False)

    def test_get_user_chats(self):
        """Тест на получение списка чатов пользователя и их сортировку по последнему сообщению."""
        self.client.login(email="user1@example.com", password='password1')
        request = self.client.get('/')
        request.user = self.user1

        chats = get_user_chats(request)

        self.assertEqual(len(chats), 3)  # Проверяем, что возвращаются все чаты пользователя
        self.assertGreaterEqual(chats[0]['last_message_time'],
                                chats[1]['last_message_time'])  # Проверяем сортировку по времени
