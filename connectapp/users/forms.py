from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.core.validators import RegexValidator

from .models import User


class UserLoginForm(forms.Form):
    email = forms.CharField(
        label="Почта",
        widget=forms.EmailInput(attrs={"class": "form-control", "placeholder": "Введите адрес электронной почты"}),
    )
    password = forms.CharField(
        label="Пароль",
        widget=forms.PasswordInput(attrs={"class": "form-control", "placeholder": "Введите пароль"}),
    )

    class Meta:
        model = User
        fields = ["email", "password"]


class UserRegisterForm(UserCreationForm):
    first_name = forms.CharField(
        label="Имя",
        validators=[
            RegexValidator(
                regex=r'^[а-яА-Я]*$',
                message='Разрешены только русские буквы',
                code='invalid_username'
            ),
        ],
        widget=forms.TextInput(attrs={"class": "form-control", "placeholder": "Введите имя"}),
    )
    last_name = forms.CharField(
        label="Фамилия",
        validators=[
            RegexValidator(
                regex=r'^[а-яА-Я]*$',
                message='Разрешены только русские буквы',
                code='invalid_username'
            ),
        ],
        widget=forms.TextInput(attrs={"class": "form-control", "placeholder": "Введите фамилию"}),
    )
    username = forms.CharField(
        label="Имя пользователя",
        validators=[
            RegexValidator(
                regex=r'^[a-zA-Z0-9]*$',
                message='Разрешены только латинские буквы и цифры.',
                code='invalid_username'
            ),
        ],
        widget=forms.TextInput(attrs={"class": "form-control", "placeholder": "Введите имя пользователя"}),
        error_messages={'unique': 'Имя пользователя занято'}
    )
    email = forms.CharField(
        label="Адрес электронной почты",
        widget=forms.EmailInput(attrs={"class": "form-control", "placeholder": "Введите адрес электронной почты"}),
        error_messages={'unique': 'Адрес электронной почты уже зарегистрирован'},
    )
    password1 = forms.CharField(
        label="Пароль",
        widget=forms.PasswordInput(attrs={"class": "form-control", "placeholder": "Введите пароль"}),
    )
    password2 = forms.CharField(
        label="Подтверждение пароля",
        widget=forms.PasswordInput(attrs={"class": "form-control", "placeholder": "Подтвердите пароль"}),
    )

    class Meta:
        model = User
        fields = ["first_name", "last_name", "username", "email", "password1", "password2"]


class AvatarUploadForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['image']
