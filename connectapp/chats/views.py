from django.shortcuts import render
from django.contrib.auth.decorators import login_required


@login_required
def chats(request):
    return render(request, "chats/chats.html")
