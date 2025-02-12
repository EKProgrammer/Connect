from django.urls import path
from . import views

urlpatterns = [
    path('', views.chats_empty_page, name='chat_empty'),
    path('service/start-chat/<int:user_id>', views.start_chat, name='start_chat'),
    path('service/message_generation', views.mistral_message_generation, name='message_generation'),
    path('service/edit_message/', views.edit_message, name='edit_message'),
    path('service/delete_message/<int:message_id>/', views.delete_message, name='delete_message'),
    path('<int:chat_id>', views.chats, name='chats'),
]
