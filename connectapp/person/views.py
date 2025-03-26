from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.template import loader
from django.http import JsonResponse, StreamingHttpResponse, HttpResponseBadRequest
from django.contrib import messages
from django.core.paginator import Paginator, EmptyPage
from datetime import datetime, timedelta
from django.utils import timezone
from PIL import Image
import json
from mistralai import Mistral
import os
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from users.models import User
from .models import Post, PostImage, Comment
from .forms import AboutForm, PostForm
from .forms import CommentForm
from django.views.decorators.http import require_POST
import markdown
from .markdown_extensions import CodeHeaderExtension, KatexExtension

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
    """ Проверка, является ли файл изображением """
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

            original_text = request.POST['text']
            post.text = original_text
            post.formated_text = markdown.markdown(
                original_text,
                extensions=[
                    'markdown.extensions.extra',  # Включает поддержку таблиц, сносок и других элементов
                    CodeHeaderExtension(),
                    'markdown.extensions.fenced_code',  # Поддержка блоков кода с использованием ```
                    KatexExtension(),
                ])
            post.user = request.user
            post.date = timezone.now()
            post.save()

            images = request.FILES.getlist('images')
            for image in images:
                filename = f'post_images/{post.id}_{image.name}'
                path = default_storage.save(filename, ContentFile(image.read()))

                if is_image(default_storage.path(path)):
                    PostImage.objects.create(post=post, image=path)
                else:
                    messages.error(request, 'Один или несколько загруженных файлов не являются изображениями')
                    default_storage.delete(path)

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
    if request.method == 'POST':
        post = get_object_or_404(Post, id=post_id, user=request.user)
        post_form = PostForm(request.POST, request.FILES, instance=post)
        if post_form.is_valid():
            post = post_form.save(commit=False)

            original_text = request.POST['text']
            post.formated_text = markdown.markdown(
                original_text,
                extensions=[
                    'markdown.extensions.extra',  # Включает поддержку таблиц, сносок и других элементов
                    CodeHeaderExtension(),
                    'markdown.extensions.fenced_code',  # Поддержка блоков кода с использованием ```
                    KatexExtension(),
                ])
            post.save()

            # Удаляем старые изображения (если нужно)
            PostImage.objects.filter(post=post).delete()

            images = request.FILES.getlist('images')
            for image in images:
                filename = f'post_images/{post.id}_{image.name}'
                path = default_storage.save(filename, ContentFile(image.read()))

                if is_image(default_storage.path(path)):
                    PostImage.objects.create(post=post, image=path)
                else:
                    messages.error(request, 'Один или несколько загруженных файлов не являются изображениями')
                    default_storage.delete(path)

    return redirect('profile')


@login_required
def delete_post(request, post_id):
    post = get_object_or_404(Post, id=post_id, user=request.user)
    if request.method == 'POST':
        images = post.images.all()
        for image in images:
            if image.image and os.path.isfile(image.image.path):
                os.remove(image.image.path)
            image.delete()

        post.delete()
    return redirect('profile')


@login_required
def like_post(request):
    post_id = request.POST.get('id')
    if not post_id or not post_id.isdigit():
        return JsonResponse({'error': 'Invalid post ID'}, status=400)
    post = get_object_or_404(Post, id=post_id)

    if post.likes.filter(id=request.user.id).exists():
        post.likes.remove(request.user)
        liked = False
    else:
        post.likes.add(request.user)
        liked = True

    return JsonResponse({'likes_count': post.total_likes(), 'liked': liked})


@login_required
def could_use_ai(request):
    """ Проверяем, есть ли у пользователя подписка или остались ли попытки """
    user = request.user
    if not user.has_subscription:
        if timezone.now().date() - user.last_ai_help_reset.date() >= timedelta(hours=24):
            user.ai_help_requests_left = 5
            user.last_ai_help_reset = timezone.now()
        if user.ai_help_requests_left == 0:
            return JsonResponse({"could_use_ai": False})
        else:
            user.ai_help_requests_left -= 1
            user.save()
            return JsonResponse({"could_use_ai": True})
    return JsonResponse({"could_use_ai": True})


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
    if request.user.is_authenticated:
        is_following = user.followers.filter(user=request.user).exists()
    else:
        is_following = False

    data = {
        "profile_user": user,
        "posts": page_obj,
        "has_next": page_obj.has_next(),
        'followers_count': followers_count,
        'following_count': following_count,
        'is_following': is_following,
    }

    return render(request, "person/user_profile.html", data)


@login_required
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


@login_required
def liked_users(request, post_id):
    post = get_object_or_404(Post, id=post_id)
    liked_user_instances = post.likes.all()
    users_data = [{
        'first_name': user.first_name,
        'last_name': user.last_name,
        'username': user.username,
        'avatar_url': user.get_avatar_url()
    } for user in liked_user_instances]
    return JsonResponse(users_data, safe=False)


@login_required
def get_followers(request):
    followers = request.user.followers.all()
    followers_data = [{
        'username': follower.user.username,
        'first_name': follower.user.first_name,
        'last_name': follower.user.last_name,
        'avatar_url': follower.user.get_avatar_url()
    } for follower in followers]
    return JsonResponse(followers_data, safe=False)


@login_required
def get_user_followers(request, username):
    user = get_object_or_404(User, username=username)
    followers = user.followers.all()
    followers_data = [{
        'username': follower.user.username,
        'first_name': follower.user.first_name,
        'last_name': follower.user.last_name,
        'avatar_url': follower.user.get_avatar_url()
    } for follower in followers]
    return JsonResponse(followers_data, safe=False)


@login_required
def user_following_list(request, username):
    user = get_object_or_404(User, username=username)
    following = user.subscriptions.all()
    following_data = [
        {
            'username': follow.subscribed_to.username,
            'first_name': follow.subscribed_to.first_name,
            'last_name': follow.subscribed_to.last_name,
            'avatar_url': follow.subscribed_to.get_avatar_url(),
        }
        for follow in following
    ]
    return JsonResponse(following_data, safe=False)


@login_required
def following_list(request):
    following = request.user.subscriptions.all()
    following_data = [
        {
            'username': follow.subscribed_to.username,
            'first_name': follow.subscribed_to.first_name,
            'last_name': follow.subscribed_to.last_name,
            'avatar_url': follow.subscribed_to.get_avatar_url(),
        }
        for follow in following
    ]
    return JsonResponse(following_data, safe=False)


def post_detail(request, post_id):
    post = get_object_or_404(Post, id=post_id)
    comments = Comment.objects.filter(post=post).order_by('-created_at')

    if request.method == 'POST':
        form = CommentForm(request.POST)
        if form.is_valid():
            comment = form.save(commit=False)
            comment.post = post
            comment.user = request.user
            comment.save()
            return redirect('post_detail', post_id=post.id)
    else:
        form = CommentForm()

    return render(request, 'person/post_detail.html', {
        'post': post,
        'comments': comments,
        'form': form,
    })


@login_required
@require_POST
def delete_comment(request, comment_id):
    try:
        comment = Comment.objects.get(id=comment_id)
        if comment.user == request.user:
            comment.delete()
            return JsonResponse({'success': True})
        else:
            return JsonResponse({'success': False, 'error': 'Вы не являетесь автором этого комментария'})
    except Comment.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Комментарий не найден'})


@login_required
def edit_comment(request, comment_id):
    comment = get_object_or_404(Comment, id=comment_id)
    
    # Проверяем, является ли текущий пользователь автором комментария
    if request.user != comment.user:
        return JsonResponse({'success': False, 'error': 'Вы не можете редактировать этот комментарий'})
    
    if request.method == 'POST':
        content = request.POST.get('content', '').strip()
        
        if not content:
            return JsonResponse({'success': False, 'error': 'Комментарий не может быть пустым'})

        comment.content = content
        comment.save()
        
        # Если запрос был AJAX, возвращаем JSON-ответ
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return JsonResponse({'success': True})
        
        # Иначе перенаправляем на страницу поста
        return redirect('post_detail', post_id=comment.post.id)
    
    # Если метод не POST, перенаправляем на страницу поста
    return redirect('post_detail', post_id=comment.post.id)


def add_view(request, post_id):
    post = get_object_or_404(Post, id=post_id)
    post.views += 1
    post.save()
    return JsonResponse({'status': 'success'})

@login_required
def edit_profile(request):
    if request.method == 'POST':
        user = request.user
        try:
            user.first_name = request.POST.get('first_name', '')
            user.last_name = request.POST.get('last_name', '')
            username = request.POST.get('username', '')
            
            if username != user.username and User.objects.filter(username=username).exists():
                messages.error(request, 'Это имя пользователя уже занято')
                return redirect('profile')
            
            user.username = username
            user.about = request.POST.get('about', '')
            if 'remove_avatar' in request.POST and request.POST['remove_avatar'] == 'on':
                user.image.delete()
            elif 'avatar' in request.FILES:
                if user.image:
                    user.image.delete()
                user.image = request.FILES['avatar']
            
            user.save()
            messages.success(request, 'Профиль успешно обновлен')
            return redirect('profile')
        
        except Exception as e:
            messages.error(request, f'Произошла ошибка: {str(e)}')
            return redirect('profile')
    
    return redirect('profile')