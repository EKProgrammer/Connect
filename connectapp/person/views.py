from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.core.exceptions import ValidationError
from django.contrib import messages

from datetime import datetime, timezone
import json
from mistralai import Mistral
import os
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from .models import Post


@login_required
def profile(request):
    if request.method == 'POST' and request.FILES.get('avatar'):
        avatar = request.FILES['avatar']
        # Сохраняем новый аватар
        filename = f'users_images/{request.user.username}_avatar.jpg'
        path = default_storage.save(filename, ContentFile(avatar.read()))
        request.user.image = path
        request.user.save()
        messages.success(request, 'Аватар успешно обновлен')
        return redirect('profile')

    posts = Post.objects.filter(user=request.user.id).order_by('-date')

    data = {
        "user": request.user,
        "posts": posts,
    }

    return render(request, "person/profile.html", data)


@login_required
def create_post(request):
    if request.method == "POST":
        text = request.POST.get('createPost', '')
        if len(text) > 5000:
            messages.error(request, 'Текст поста не должен превышать 5000 символов.')
        else:
            post = Post()
            post.text = text
            post.date = datetime.now(timezone.utc)
            post.user = request.user
            try:
                post.full_clean()
                post.save()
                messages.success(request, 'Пост успешно создан.')
            except ValidationError as e:
                messages.error(request, f'Ошибка при создании поста: {e}')
    return redirect('profile')


@login_required
def edit_about(request):
    if request.method == 'POST':
        new_about = request.POST.get('about', '')
        request.user.about = new_about
        request.user.save()
    return redirect('profile')


@login_required
def edit_post(request, post_id):
    post = get_object_or_404(Post, id=post_id, user=request.user)
    if request.method == 'POST':
        new_text = request.POST.get('text', '')
        post.text = new_text
        post.save()
    return redirect('profile')


@login_required
def delete_post(request, post_id):
    post = get_object_or_404(Post, id=post_id, user=request.user)
    if request.method == 'POST':
        post.delete()
    return redirect('profile')


@csrf_exempt
@require_http_methods(["POST"])
def chatgpt_api(request):
    file = open("./person/statistic.txt", "r")
    number = int(file.read()) + 1
    file.close()
    file = open("./person/statistic.txt", "w")
    file.write(str(number))
    file.close()

    data = json.loads(request.body)
    user_input = data.get('prompt', '')
    if not user_input:
        prompt = "Сгенерируй рандомный текст к новому посту в социальной сети."
    else:
        prompt = "Добавь продолжение к тексту: " + user_input
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
        print(f"An error occurred: {e}")
        return JsonResponse({'error': 'Failed to get response from AI'}, status=500)


def get_stat(request):
    file = open("./person/statistic.txt", "r")
    number = int(file.read())
    file.close()
    data = {
        "number": number,
    }
    return render(request, "person/statistic.html", data)

@login_required
def delete_avatar(request):
    if request.method == 'POST':
        if request.user.image:
            request.user.delete_avatar()
            messages.success(request, 'Фото профиля успешно удалено.')
        else:
            messages.error(request, 'У вас нет фото профиля для удаления.')
    return redirect('profile')