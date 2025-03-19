from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from .models import Chat, Message
from users.models import User
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse
import json
import os
from mistralai import Mistral
from django.core.paginator import Paginator
from django.db.models import Q as QueryFilter

@login_required
def start_chat(request, user_id):
    other_user = get_object_or_404(User, id=user_id)
    chat = Chat.get_or_create_personal_chat(request.user, other_user)
    return redirect('chats', chat_id=chat.id)


def get_user_chats(request):
    """Возвращает отфильтрованный список чатов для текущего пользователя, отсортированный по времени последнего сообщения."""
    chats_list = Chat.objects.filter(participants=request.user)
    chats_list_filtered = []
    
    for chat in chats_list:
        if chat.is_group_chat:
            chats_list_filtered.append({'chat_id': chat.id, 'chat': chat, 'name': chat.name})
        else:
            other_participant = chat.participants.exclude(id=request.user.id).first()
            if other_participant:
                chats_list_filtered.append({'user': other_participant, 'chat_id': chat.id, 'chat': chat})
    
    chats_list_filtered.sort(key=lambda x: x['chat'].messages.latest('timestamp').timestamp if x['chat'].messages.exists() else x['chat'].created_at, reverse=True)
    
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
    last_sender = None  # Переменная для отслеживания последнего отправителя
    if request.method == 'POST':
        content = request.POST.get('message-content')
        if content:
            Message.objects.create(chat=chat, sender=request.user, content=content)
        return redirect('chats', chat_id=chat.id)

    if not chat.participants.filter(id=request.user.id).exists():
        return render(request, "404.html")

    chats_list = get_user_chats(request)

    # ADD SEARCH USERS
    query = request.GET.get('query', '').strip()
    page_obj = None

    if query:
        users = User.objects.filter(
            QueryFilter(first_name__icontains=query) | 
            QueryFilter(last_name__icontains=query) | 
            QueryFilter(username__icontains=query)
        )
        paginator = Paginator(users, 10)
        page_number = request.GET.get('page')
        page_obj = paginator.get_page(page_number)

        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return JsonResponse({
                "users": [
                    {"id": user.id, "first_name": user.first_name, "last_name": user.last_name, "avatar": user.get_avatar_url()} 
                    for user in page_obj
                ]
            })
    data = {
        'user': request.user,
        'chats_list': chats_list,
        'chat': chat,
        'messages': messages,
        'last_sender': last_sender,
        'page_obj': page_obj,
        'query': query
    }
    return render(request, 'chats/chats.html', data)


@csrf_exempt
@login_required
@require_http_methods(["POST"])
def mistral_message_generation(request):
    data = json.loads(request.body)
    user_input = data.get('prompt', '')
    chat_id = data.get('chat_id')

    if not chat_id:
        return JsonResponse({'error': 'Chat ID is required'}, status=400)

    try:
        chat = Chat.objects.get(id=chat_id)
    except Chat.DoesNotExist:
        return JsonResponse({'error': 'Chat not found'}, status=404)

    last10messages = chat.messages.all().order_by('-timestamp')[:10]

    context = "\n".join([f'{msg.content}' for msg in reversed(last10messages)])

    if user_input:
        prompt = f'Продолжить текст сообщения: {user_input}.'
    else:
        prompt = 'Сгенерируй текст нового сообщения в чате.'

    if len(last10messages) > 0:
        prompt += f' Учитывать контекст переписки (сообщения расположены в порядке от самых новых до самых старых):\n{context}\n'

    api_key = os.environ["MISTRAL_API_KEY"]
    model = "mistral-small-latest"

    client = Mistral(api_key=api_key)

    chat_response = client.chat.complete(
        model=model,
        messages=[
            {
                "role": "user",
                "content": prompt,
            },
        ]
    )
    try:
        return JsonResponse({'response': chat_response.choices[0].message.content})
    except Exception as e:
        return JsonResponse({'error': 'Failed to get response from AI'}, status=500)

def edit_message(request):
    if request.method == "POST":
        data = json.loads(request.body)
        message_id = data.get("message_id")
        new_content = data.get("new_content")
        message = get_object_or_404(Message, id=message_id, sender=request.user)
    
        if new_content:
            message.is_changed = True
            message.content = new_content
            message.save()
            return JsonResponse({"new_content": message.content})
        return JsonResponse({"error": "Content cannot be empty"}, status=400)
    return JsonResponse({"error": "Invalid request"}, status=400)

        
@csrf_exempt
@login_required
@require_http_methods(["POST"])
def delete_message(request, message_id):
    try:
        message = Message.objects.get(id=message_id)
        message.delete()
        return JsonResponse({'status': 'success'})
    except Message.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Message not found'}, status=404)
    
@login_required
@csrf_exempt
def create_group_chat(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            group_name = data.get("group_name", "").strip()
            user_ids = data.get("user_ids", [])
            avatar = request.FILES.get("group_avatar")

            if not group_name or not user_ids:
                return JsonResponse({"success": False, "error": "Заполните все поля"}, status=400)

            chat = Chat.objects.create(name=group_name, is_group_chat=True, avatar=avatar)
            chat.participants.add(request.user, *User.objects.filter(id__in=user_ids))

            return JsonResponse({"success": True, "chat_id": chat.id})

        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=500)
    return JsonResponse({"success": False, "error": "Метод не поддерживается"}, status=405)

def delete_chat(request, chat_id):
    chat = get_object_or_404(Chat, id=chat_id)
    
    # Проверка на удаление для всех или только для пользователя
    if request.method == 'POST':
        data = json.loads(request.body)
        delete_for_all = data.get("delete_for_all", False)
        
        if delete_for_all:
            # Удаление чата для всех участников (удаляем сам чат)
            chat.delete()
            return JsonResponse({'success': True})
        else:
            # Удаление чата только у текущего пользователя
            # Удаляем текущего пользователя из списка участников чата
            chat.participants.remove(request.user)
            return JsonResponse({'success': True})
    
    return JsonResponse({'success': False}, status=400)
