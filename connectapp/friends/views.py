from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from users.models import User
from .forms import SearchForm
from django.core.paginator import Paginator
from .models import Subscription
from django.http import HttpResponseForbidden
from django.contrib.auth import get_user_model

@login_required
def friends(request):
    return render(request, "friends/friends.html")

def search_friends(request):
    query = request.GET.get('query', '')
    results = User.objects.filter(
        first_name__icontains=query
    ) | User.objects.filter(
        last_name__icontains=query
    ) | User.objects.filter(
        username__icontains=query
    ) if query else User.objects.none()
    
    paginator = Paginator(results, 10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    form = SearchForm(initial={'query': query})
    context = {
        'form': form,
        'page_obj': page_obj,
        'query': query,
    }
    return render(request, 'friends/friends.html', context)

@login_required
def subscribe(request, user_id):
    user_to_subscribe = get_object_or_404(get_user_model(), id=user_id)

    if user_to_subscribe == request.user:
        return HttpResponseForbidden("Нельзя подписаться на самого себя.")
    
    if not Subscription.objects.filter(user=request.user, subscribed_to=user_to_subscribe).exists():
        Subscription.objects.create(user=request.user, subscribed_to=user_to_subscribe)

    return redirect('search_friends')

User = get_user_model()

@login_required
def follow_user(request, username):
    """Подписаться на пользователя"""
    user_to_follow = get_object_or_404(User, username=username)
    if user_to_follow != request.user:
        Subscription.objects.get_or_create(user=request.user, subscribed_to=user_to_follow)
    return redirect('user_profile', username=username)

@login_required
def unfollow_user(request, username):
    """Отписаться от пользователя"""
    user_to_unfollow = get_object_or_404(User, username=username)
    Subscription.objects.filter(user=request.user, subscribed_to=user_to_unfollow).delete()
    return redirect('user_profile', username=username)

@login_required
def user_profile(request, username):
    """Отображение профиля пользователя"""
    user = get_object_or_404(User, username=username)
    followers_count = user.followers.count()
    following_count = user.subscriptions.count()
    is_following = user.followers.filter(user=request.user).exists()

    return render(request, 'person/user_profile.html', {
        'user': user,
        'followers_count': followers_count,
        'following_count': following_count,
        'is_following': is_following,
    })