from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from .models import Chat, Message
from users.models import User

@login_required
def start_chat(request, user_id):
    other_user = get_object_or_404(User, id=user_id)
    chat = Chat.get_or_create_personal_chat(request.user, other_user)
    return redirect('chats', chat_id=chat.id)

@login_required
def chats(request, chat_id):
    chat = get_object_or_404(Chat, id=chat_id)
    messages = chat.messages.all()
    
    if request.method == 'POST':
        content = request.POST.get('content')
        if content:
            Message.objects.create(chat=chat, sender=request.user, content=content)
        return redirect('chats', chat_id=chat.id)
    
    return render(request, 'chats/chats.html', {'chat': chat, 'messages': messages})