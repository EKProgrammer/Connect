from django.contrib.auth.backends import BaseBackend
from .models import User


class EmailAuthBackend(BaseBackend):
    def authenticate(self, request, email=None, password=None, **kwargs):
        user_model = User
        try:
            user = user_model.objects.get(email=email)

            if user.check_password(password):
                return user
            return None
        except (user_model.DoesNotExist, user_model.MultipleObjectsReturned):
            return None

    def get_user(self, user_id):
        user_model = User
        try:
            return user_model.objects.get(pk=user_id)
        except user_model.DoesNotExist:
            return None
