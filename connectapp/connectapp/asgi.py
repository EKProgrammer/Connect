"""
ASGI config for connectapp project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

import os
from django import setup
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.urls import path
from chats import consumers

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'connectapp.settings')

# Инициализация Django
setup()

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter([
            path("ws/chat/<int:chat_id>/", consumers.ChatConsumer.as_asgi()),
        ])
    ),
})
