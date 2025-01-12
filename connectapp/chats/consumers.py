import json
from channels.generic.websocket import AsyncWebsocketConsumer
from users.models import User
from .models import Chat, Message


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.chat_id = self.scope['url_route']['kwargs']['chat_id']
        self.room_group_name = f'chat_{self.chat_id}'

        # Проверка, что пользователь является участником чата
        user = self.scope['user']
        if not user.is_authenticated:
            await self.close()
            return

        try:
            chat = await self.get_chat(self.chat_id)
            if not await self.is_participant(chat, user):
                await self.close()
                return
        except Chat.DoesNotExist:
            await self.close()
            return

        # Присоединяемся к группе чата
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Покидаем группу чата
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Получение сообщения от WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        user_id = text_data_json['user_id']

        # Сохранение сообщения в базе данных
        user = await self.get_user(user_id)
        chat = await self.get_chat(self.chat_id)
        await self.save_message(chat, user, message)

        # Отправка сообщения в группу чата
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'user_id': user_id,
                'username': user.username,
            }
        )

    # Отправка сообщения в WebSocket
    async def chat_message(self, event):
        message = event['message']
        user_id = event['user_id']
        username = event['username']

        # Отправка сообщения клиенту
        await self.send(text_data=json.dumps({
            'message': message,
            'user_id': user_id,
            'username': username,
        }))

    # Вспомогательные методы для работы с базой данных
    async def get_chat(self, chat_id):
        return await Chat.objects.aget(id=chat_id)

    async def get_user(self, user_id):
        return await User.objects.aget(id=user_id)

    async def is_participant(self, chat, user):
        return await chat.participants.filter(id=user.id).aexists()

    async def save_message(self, chat, user, message):
        await Message.objects.acreate(chat=chat, sender=user, content=message)
