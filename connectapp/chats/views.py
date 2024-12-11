from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from .models import Chat, Message
from users.models import User


@login_required
def start_chat(request, user_id):
    other_user = get_object_or_404(User, id=user_id)
    chat = Chat.get_or_create_personal_chat(request.user, other_user)
    return redirect('chats', chat_id=chat.id)


def get_user_chats(request):
    """Возвращает отфильтрованный список чатов для текущего пользователя."""
    chats_list = Chat.objects.filter(participants=request.user)
    chats_list_filtered = []
    for chat in chats_list:
        other_participants = chat.participants.exclude(id=request.user.id)
        for user in other_participants:
            chats_list_filtered.append({'user': user, 'chat_id': chat.id})
    return chats_list_filtered


@login_required
def chats_empty_page(request):
    chats_list = get_user_chats(request)
    data = {
        'user': request.user,
        'chats_list': chats_list,
        'chat': None,
        'messages': None
    }
    return render(request, 'chats/chats.html', data)


@login_required
def chats(request, chat_id):
    chat = get_object_or_404(Chat, id=chat_id)
    messages = chat.messages.all()

    if request.method == 'POST':
        content = request.POST.get('message-content')
        if content:
            Message.objects.create(chat=chat, sender=request.user, content=content)
        return redirect('chats', chat_id=chat.id)

    if not chat.participants.filter(id=request.user.id).exists():
        return render(request, "404.html")

    chats_list = get_user_chats(request)

    data = {
        'user': request.user,
        'chats_list': chats_list,
        'chat': chat,
        'messages': messages
    }
    return render(request, 'chats/chats.html', data)
