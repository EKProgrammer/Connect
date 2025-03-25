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


class MultipleFileInput(forms.ClearableFileInput):
    allow_multiple_selected = True


class MultipleImageField(forms.FileField):
    def __init__(self, *args, **kwargs):
        kwargs.setdefault("widget", MultipleFileInput())
        super().__init__(*args, **kwargs)

    def clean(self, data, initial=None):
        single_file_clean = super().clean
        if isinstance(data, (list, tuple)):
            result = [single_file_clean(d, initial) for d in data]
        else:
            result = [single_file_clean(data, initial)]
        return result


class PostForm(forms.ModelForm):
    images = MultipleImageField(required=False)

    class Meta:
        model = Post
        fields = ['text']
        widgets = {
            'text': forms.Textarea(attrs={'class': 'modal-textarea', 'rows': 5, 'maxlength': 5000,
                                          'placeholder': 'Введите текст поста'}),
        }

    def __init__(self, *args, **kwargs):
        post_id = kwargs.pop('post_id', None)
        super(PostForm, self).__init__(*args, **kwargs)
        if post_id:
            self.fields['text'].widget.attrs.update({'id': f'id_text_{post_id}'})
            self.fields['images'].widget.attrs.update({'id': f'id_images_{post_id}'})


class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = ['content']
