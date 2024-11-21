from django.urls import path
from . import views

urlpatterns = [
    path('', views.profile, name='profile'),
    path('create_post/', views.create_post, name='create_post'),
    path('edit_about/', views.edit_about, name='edit_about'),
    path('edit_post/<int:post_id>/', views.edit_post, name='edit_post'),
    path('delete_post/<int:post_id>/', views.delete_post, name='delete_post'),
    path('api/mistral/', views.mistral_api, name='mistral_api'),
    path('profile/', views.profile, name='profile'),
    path('delete-avatar/', views.delete_avatar, name='delete_avatar'),
]
