from django.urls import path
from . import views

urlpatterns = [
    path('', views.friends, name='friends'),
    path('search/', views.search_friends, name='search_friends'),
    path('follow/<str:username>/', views.follow_user, name='follow_user'),
    path('unfollow/<str:username>/', views.unfollow_user, name='unfollow_user'),
]