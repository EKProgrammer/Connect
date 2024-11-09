from .models import Post
from django.forms import ModelForm, Textarea


class PostForm(ModelForm):
    class Meta:
        model = Post
        fields = ["text"]

        widgets = {
            "text": Textarea(attrs={"class": "form-control bg-secondary text-light modal-textarea",
                                    "id": "postContent",
                                    "rows": "5",
                                    "placeholder": "Введите текст поста"}),
        }
