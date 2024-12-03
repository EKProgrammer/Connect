from django.contrib import admin
from .models import Chat, Message

@admin.register(Chat)
class ChatAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'is_group_chat', 'created_at')
    list_filter = ('is_group_chat', 'created_at')
    search_fields = ('name', 'participants__username')
    filter_horizontal = ('participants',)

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'chat', 'sender', 'content', 'timestamp')
    list_filter = ('chat', 'sender', 'timestamp')
    search_fields = ('content', 'sender__username')