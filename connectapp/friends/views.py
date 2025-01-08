from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from users.models import User
from .forms import SearchForm
from django.core.paginator import Paginator
from .models import Subscription
from django.db.models import Case, When, Value, BooleanField

@login_required
def friends(request):
    return render(request, "friends/friends.html")

@login_required
def search_friends(request):
    query = request.GET.get('query', '')
    results = User.objects.filter(
        first_name__icontains=query
    ) | User.objects.filter(
        last_name__icontains=query
    ) | User.objects.filter(
        username__icontains=query
    ) if query else User.objects.none()
    results = results.annotate( is_following=Case( When(followers__user=request.user, then=Value(True)), default=Value(False), output_field=BooleanField(),))
    paginator = Paginator(results, 10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    form = SearchForm(initial={'query': query})
    is_following = request.user.followers.filter(user=request.user).exists()

    context = {
        'is_following': is_following,
        'form': form,
        'page_obj': page_obj,
        'query': query,
    }
    return render(request, 'friends/friends.html', context)

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
    if user_to_unfollow!= request.user:
        Subscription.objects.filter(user=request.user, subscribed_to=user_to_unfollow).delete()
    return redirect('user_profile', username=username)

