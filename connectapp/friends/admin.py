from django.contrib import admin
from .models import Subscription

@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ('user', 'subscribed_to', 'created_at') 
    search_fields = ('user__username', 'subscribed_to__username')
    list_filter = ('created_at',)
    ordering = ('-created_at',)