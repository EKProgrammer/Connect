from django.shortcuts import render


def profile(request):
    return render(request, "person/profile.html")
