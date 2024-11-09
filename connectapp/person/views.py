from datetime import datetime, timezone
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from .models import Post
from .forms import PostForm


def profile(request):
    posts = Post.objects.filter(user=request.user.id).order_by('-date')
    form = PostForm()

    data = {
        "user": request.user,
        "form": form,
        "posts": posts,
    }

    return render(request, "person/profile.html", data)


@login_required
def create_post(request):
    if request.method == "POST":
        form = PostForm(request.POST)
        if form.is_valid():
            post = form.save(commit=False)
            post.date = datetime.now(timezone.utc)
            post.user = request.user
            post.save()
            return redirect('profile')
    return redirect('profile')


@login_required
def edit_about(request):
    print(request.POST)
    if request.method == 'POST':
        new_about = request.POST.get('about', '')
        request.user.about = new_about
        request.user.save()
        return redirect('profile')
    return redirect('profile')
