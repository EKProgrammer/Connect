from django import forms
from users.models import User
from .models import Post


class AboutForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['about']
        widgets = {
            'about': forms.Textarea(attrs={'class': 'form-control bg-secondary text-light modal-textarea', 'rows': 5,
                                           'maxlength': 250, 'placeholder': 'Напишите информацию о себе'}),
        }


class PostForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = ['text', 'image']
        widgets = {
            'text': forms.Textarea(attrs={'class': 'form-control bg-secondary text-light modal-textarea',
                                          'rows': 5, 'maxlength': 5000, 'placeholder': 'Введите текст поста'}),
        }
