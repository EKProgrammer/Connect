from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='home'),
    path('register', views.register, name='register'),
    path('logout', views.logout, name='logout'),
    path('about', views.about, name='about'),
    path('regulations/user_agreement', views.user_agreement, name='user_agreement'),
    path('regulations/subscription_agreement', views.subscription_agreement, name='user_agreement'),
    path('faq', views.faq, name='faq'),
    path('subscription', views.subscription, name='subscription'),
]
