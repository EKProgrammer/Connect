from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.contrib import messages

from datetime import datetime
from django.utils import timezone

import json
from mistralai import Mistral
import os

from django.core.files.storage import default_storage
from django.core.files.base import ContentFile

from users.models import User
from .models import Post
from .forms import AboutForm, PostForm


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

    about_form = AboutForm(instance=request.user)
    posts = Post.objects.filter(user=request.user.id).order_by('-date')

    empty_post_form = PostForm()
    post_forms = {}
    for post in posts:
        # Создаем форму редактирования для каждого поста
        post_forms[post.id] = PostForm(instance=post)

    flag = False
    data = {
        "user": request.user,
        "posts": posts,
        "about_form": about_form,
        "post_forms": post_forms,
        "empty_post_form": empty_post_form,
        "flag": flag,
    }

    return render(request, "person/profile.html", data)


@login_required
def create_post(request):
    if request.method == "POST":
        post_form = PostForm(request.POST, request.FILES)
        if post_form.is_valid():
            post = post_form.save(commit=False)
            post.user = request.user
            post.date = timezone.now()
            post.save()
    return redirect('profile')


@login_required
def edit_about(request):
    if request.method == 'POST':
        about_form = AboutForm(request.POST, instance=request.user)
        if about_form.is_valid():
            about_form.save()
    return redirect('profile')


@login_required
def edit_post(request, post_id):
    post = get_object_or_404(Post, id=post_id, user=request.user)
    if request.method == 'POST':
        post_form = PostForm(request.POST, request.FILES, instance=post)
        if post_form.is_valid():
            post_form.save()
    return redirect('profile')


@login_required
def delete_post(request, post_id):
    post = get_object_or_404(Post, id=post_id, user=request.user)
    if request.method == 'POST':
        if post.image:
            if os.path.isfile(post.image.path):
                os.remove(post.image.path)
        post.delete()
    return redirect('profile')


@csrf_exempt
@login_required
@require_http_methods(["POST"])
def mistral_api(request):
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


@login_required
def delete_avatar(request):
    print("test")
    if request.method == 'GET':
        print("test2")
        if request.user.image:
            request.user.delete_avatar()
            messages.success(request, 'Фото профиля успешно удалено.')
        else:
            messages.error(request, 'У вас нет фото профиля для удаления.')
    return redirect('profile')

def user_profile(request, username):
    user = get_object_or_404(User, username=username)
    posts = Post.objects.filter(user=user).order_by('-date')
    about_form = AboutForm(instance=request.user)
    
    empty_post_form = PostForm()
    post_forms = {}
    for post in posts:
        # Создаем форму редактирования для каждого поста
        post_forms[post.id] = PostForm(instance=post)
    
    flag = False
    
    data = {
        "profile_user": user,
        "posts": posts,
        "is_own_profile": request.user == user,
        "about_form": about_form,
        "post_forms": post_forms,
        "empty_post_form": empty_post_form,
        "flag": flag,
    }
    
    return render(request, "person/user_profile.html", data)
