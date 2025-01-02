from django.urls import path
from . import views

urlpatterns = [
    path('', views.friends, name='friends'),
    path('friends/search/', views.search_friends, name='search_friends'),
    path('subscribe/<int:user_id>/', views.subscribe, name='subscribe'),
]