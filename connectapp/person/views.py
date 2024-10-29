from django.shortcuts import render
from users.models import User
from .models import Article

def profile(request):
    news = User.objects.all()
    news1 = Article.objects.order_by('-date')
    return render(request, "person/profile.html", {'news': news, 'news1' : news1})

def create(request):
    return render(request, 'person/create.html')
