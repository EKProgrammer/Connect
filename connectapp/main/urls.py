from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='home'),
    path('create_order', views.create_order, name='create_order'),
    path('register', views.register, name='register'),
    path('logout', views.logout, name='logout'),
    path('subscription', views.subscription, name='subscription'),
]
