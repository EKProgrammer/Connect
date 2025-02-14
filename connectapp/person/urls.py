from django.urls import path
from . import views


urlpatterns = [
    path('', views.profile, name='profile'),
    path('<str:username>/', views.user_profile, name='user_profile'),
    path('service/create_post/', views.create_post, name='create_post'),
    path('service/edit_about/', views.edit_about, name='edit_about'),
    path('service/edit_post/<int:post_id>/', views.edit_post, name='edit_post'),
    path('service/delete_post/<int:post_id>/', views.delete_post, name='delete_post'),
    path('service/post_generation', views.mistral_post_generation, name='post_generation'),
    path('service/delete_avatar/', views.delete_avatar, name='delete_avatar'),
    path('service/like_post/', views.like_post, name='like_post'),
    path('service/load_more_posts/', views.load_more_posts, name='load_more_posts'),
    path('service/liked-users/<int:post_id>/', views.liked_users, name='liked_users'),
    path('service/could_use_ai/', views.could_use_ai, name='could_use_ai'),
    path('service/followers/', views.get_followers, name='get_followers'),
    path('service/followers/<str:username>/', views.get_user_followers, name='get_user_followers'),
    path('service/following/', views.following_list, name='following_list'),
    path('service/following/<str:username>/', views.user_following_list, name='user_following_list'),
    path('service/load_more_posts_other_user/<str:username>/', views.load_more_posts_other_user,
         name='load_more_posts_other_user'),
]
