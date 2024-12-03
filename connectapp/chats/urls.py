from django.urls import path
from . import views

urlpatterns = [
    path('', views.chats, name='chats'),
    path('start-chat/<int:user_id>', views.start_chat, name='start_chat'),
    path('chats/<int:chat_id>', views.chats, name='chats'),  
]
