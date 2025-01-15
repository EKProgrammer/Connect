from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from person.models import Post
from friends.models import Subscription
from django.db.models import Q, Count, Exists, OuterRef

@login_required
def feed(request):
    subscriptions = Subscription.objects.filter(user=request.user).values_list('subscribed_to', flat=True)
    posts = Post.objects.filter(user__in=subscriptions).order_by('-date')
    return render(request, 'feed/feed.html', {'posts': posts})
