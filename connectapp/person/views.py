from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.template import loader
from django.http import JsonResponse, StreamingHttpResponse
from django.contrib import messages
from django.core.paginator import Paginator, EmptyPage

from datetime import datetime
from django.utils import timezone

from PIL import Image
import json
from mistralai import Mistral
import os

from django.core.files.storage import default_storage
from django.core.files.base import ContentFile

from users.models import User
from .models import Post
from .forms import AboutForm, PostForm


api_key = os.environ["MISTRAL_API_KEY"]
model = "mistral-small-latest"

client = Mistral(api_key=api_key)


@login_required
def profile(request):
    avatar_edit(request)

    about_form = AboutForm(instance=request.user)
    empty_post_form = PostForm()

    posts = Post.objects.filter(user=request.user.id).order_by('-date')
    # Показывать по 10 постов на странице
    paginator = Paginator(posts, 10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    post_forms = {}
    for post in page_obj:
        post_forms[post.id] = PostForm(instance=post, post_id=post.id)

    followers_count = request.user.followers.count()
    following_count = request.user.subscriptions.count()

    data = {
        "user": request.user,
        "posts": page_obj,
        "has_next": page_obj.has_next(),
        "about_form": about_form,
        "post_forms": post_forms,
        "empty_post_form": empty_post_form,
        'followers_count': followers_count,
        'following_count': following_count,
    }

    return render(request, "person/profile.html", data)


@login_required
def load_more_posts(request):
    empty_post_form = PostForm()

    page_number = request.GET.get('page')
    posts = Post.objects.filter(user=request.user).order_by('-date')
    paginator = Paginator(posts, 10)
    try:
        page_obj = paginator.page(page_number)
    except EmptyPage:
        return JsonResponse({
            'posts_html': '',
            'has_next': False
        })

    post_forms = {}
    for post in page_obj:
        post_forms[post.id] = PostForm(instance=post, post_id=post.id)

    data = {
        "posts": page_obj,
        "post_forms": post_forms,
        "empty_post_form": empty_post_form,
    }
    posts_html = loader.render_to_string('person/profile_posts.html', data, request=request)

    return JsonResponse({
        'posts_html': posts_html,
        'has_next': page_obj.has_next()
    })


def is_image(file_path):
    try:
        with Image.open(file_path) as img:
            img.verify()
        return True
    except (IOError, SyntaxError):
        return False


def avatar_edit(request):
    if request.method == 'POST' and request.FILES.get('avatar'):
        avatar = request.FILES['avatar']
        filename = f'users_images/{request.user.username}_avatar.jpg'
        path = default_storage.save(filename, ContentFile(avatar.read()))
        if is_image(default_storage.path(path)):
            request.user.delete_avatar()
            request.user.image = path
            request.user.save()
        else:
            messages.error(request, 'Загруженный файл не является допустимым изображением')
            default_storage.delete(path)


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


@login_required
def like_post(request):
    post_id = request.POST.get('id')
    post = get_object_or_404(Post, id=post_id)

    if post.likes.filter(id=request.user.id).exists():
        post.likes.remove(request.user)
        liked = False
    else:
        post.likes.add(request.user)
        liked = True

    return JsonResponse({'likes_count': post.total_likes(), 'liked': liked})


@csrf_exempt
@login_required
def mistral_post_generation(request):
    user_response = request.GET.get('prompt', '')
    user_post = request.GET.get('post_text', '')
    prompt = user_response
    if user_post:
        prompt += '\n-------------------\n' + user_post

    def generate_stream():
        stream_response = client.chat.stream(
            model=model,
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                },
            ]
        )
        for chunk in stream_response:
            if chunk.data.choices and chunk.data.choices[0].delta.content:
                yield f"data: {json.dumps({'response': chunk.data.choices[0].delta.content})}\n\n"
        yield "event: end\ndata: {}\n\n"

    return StreamingHttpResponse(generate_stream(), content_type='text/event-stream')


@login_required
def delete_avatar(request):
    if request.method == 'GET':
        if request.user.image:
            request.user.delete_avatar()
            messages.success(request, 'Фото профиля успешно удалено.')
        else:
            messages.error(request, 'У вас нет фото профиля для удаления.')
    return redirect('profile')


def user_profile(request, username):
    user = get_object_or_404(User, username=username)
    
    if request.user == user:
        return redirect('profile')
    
    posts = Post.objects.filter(user=user).order_by('-date')
    paginator = Paginator(posts, 10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    followers_count = user.followers.count()
    following_count = user.subscriptions.count()
    is_following = user.followers.filter(user=request.user).exists()

    data = {
        "profile_user": user,
        "posts": page_obj,
        "has_next": page_obj.has_next(),
        'followers_count': followers_count,
        'following_count': following_count,
        'is_following': is_following,
    }

    return render(request, "person/user_profile.html", data)


def load_more_posts_other_user(request, username):
    user = get_object_or_404(User, username=username)

    page_number = request.GET.get('page')
    posts = Post.objects.filter(user=user).order_by('-date')
    paginator = Paginator(posts, 10)
    try:
        page_obj = paginator.page(page_number)
    except EmptyPage:
        return JsonResponse({
            'posts_html': '',
            'has_next': False
        })

    posts_html = loader.render_to_string('person/user_profile_posts.html', {"posts": page_obj})
    return JsonResponse({
        'posts_html': posts_html,
        'has_next': page_obj.has_next()
    })
