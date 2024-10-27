from django.shortcuts import render, redirect
from django.contrib import auth

from users.forms import UserLoginForm
from users.forms import UserRegisterForm


def index(request):
    if request.method == "POST":
        form = UserLoginForm(data=request.POST)
        if form.is_valid():
            username = request.POST["username"]
            password = request.POST["password"]
            user = auth.authenticate(username=username, password=password)
            if user:
                auth.login(request, user)
                return redirect("/feed")
        print(form.errors)
    else:
        form = UserLoginForm()

    return render(request, "main/index.html", {"form": form})


def register(request):
    if request.method == "POST":
        form = UserRegisterForm(data=request.POST)
        if form.is_valid():
            form.save()
            return redirect("/person")
    else:
        form = UserRegisterForm()

    return render(request, "register/register.html", {"form": form})


def logout(request):
    auth.logout(request)
    return redirect("/")
