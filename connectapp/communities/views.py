from django.shortcuts import render


def communities(request):
    return render(request, "communities/communities.html")
