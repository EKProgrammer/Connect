from django.urls import path
from . import views

urlpatterns = [
    path('', views.friends, name='friends'),
    path('friends/search/', views.search_friends, name='search_friends'),
    path('subscribe/<int:user_id>/', views.subscribe, name='subscribe'),
    path('<str:username>/follow/', views.follow_user, name='follow_user'),
    path('<str:username>/unfollow/', views.unfollow_user, name='unfollow_user'),
    path('<str:username>/', views.user_profile, name='user_profile'),
    
]