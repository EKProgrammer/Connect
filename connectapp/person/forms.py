from django import forms
from users.models import User
from .models import Post, Comment

class AboutForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['about']
        widgets = {
            'about': forms.Textarea(attrs={'class': 'modal-textarea', 'maxlength': 250,
                                           'placeholder': 'Напишите информацию о себе'}),
        }


class PostForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = ['text', 'image']
        widgets = {
            'text': forms.Textarea(attrs={'class': 'modal-textarea', 'rows': 5, 'maxlength': 5000,
                                          'placeholder': 'Введите текст поста'}),
        }

    def __init__(self, *args, **kwargs):
        post_id = kwargs.pop('post_id', None)
        super(PostForm, self).__init__(*args, **kwargs)
        if post_id:
            self.fields['text'].widget.attrs.update({'id': f'id_text_{post_id}'})
            self.fields['image'].widget.attrs.update({'id': f'id_image_{post_id}'})

class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = ['content']
