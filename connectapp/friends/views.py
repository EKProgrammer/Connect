from django.shortcuts import render


def friends(request):
    return render(request, "friends/friends.html")
