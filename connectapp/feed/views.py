from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from person.models import Post
from friends.models import Subscription
from django.db.models import F, Count


@login_required
def feed(request):
    subscriptions = Subscription.objects.filter(user=request.user).values_list('subscribed_to', flat=True)
    subscriptions_posts = Post.objects.filter(user__in=subscriptions).order_by('-date')

    popular_posts = Post.objects.annotate(
        total_likes=Count('likes'),
        total_comments=Count('comments'),
        popularity=F('views') + 2 * F('total_likes') + 2 * F('total_comments')
    ).order_by('-popularity')[:20]  # 20 самых популярных постов

    data = {
        'subscriptions_posts': subscriptions_posts,
        'popular_posts': popular_posts,
    }
    return render(request, 'feed/feed.html', data)
