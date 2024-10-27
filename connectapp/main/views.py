from django.shortcuts import render, redirect
from django.contrib import auth

from users.forms import UserLoginForm
from users.forms import UserRegisterForm


def index(request):
    if request.method == "POST":
        form = UserLoginForm(data=request.POST)
        if form.is_valid():
            print("valid")
            email = request.POST["email"]
            password = request.POST["password"]
            user = auth.authenticate(email=email, password=password)
            if user:
                auth.login(request, user)
                return redirect("/feed")
            print(user)
        print(form.errors)
    else:
        form = UserLoginForm()

    return render(request, "main/index.html", {"form": form})


def register(request):
    if request.method == "POST":
        form = UserRegisterForm(data=request.POST)
        if form.is_valid():
            form.save()
            user = auth.authenticate(email=request.POST["email"], password=request.POST["password1"])
            auth.login(request, user)
            return redirect("/person")
    else:
        form = UserRegisterForm()

    return render(request, "register/register.html", {"form": form})


def logout(request):
    auth.logout(request)
    return redirect("/")
