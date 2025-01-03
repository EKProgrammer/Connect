from django.shortcuts import render, get_object_or_404
from django.contrib.auth import get_user_model
from friends.models import Subscription

def profile_view(request, username):
    User = get_user_model()
    user = get_object_or_404(User, username=username)
    
    followers_count = Subscription.objects.filter(subscribed_to=user).count()
    subscriptions_count = Subscription.objects.filter(user=user).count()
    
    context = {
        'profile_user': user,
        'followers_count': followers_count,
        'subscriptions_count': subscriptions_count,
    }
    return render(request, 'users/profile.html', context)