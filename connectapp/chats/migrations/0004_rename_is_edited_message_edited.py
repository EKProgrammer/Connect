# Generated by Django 5.1.5 on 2025-01-28 19:00

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chats', '0003_rename_is_changed_message_is_edited'),
    ]

    operations = [
        migrations.RenameField(
            model_name='message',
            old_name='is_edited',
            new_name='edited',
        ),
    ]
