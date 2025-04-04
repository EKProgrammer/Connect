# Generated by Django 5.1.7 on 2025-03-16 22:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('person', '0008_alter_comment_options_remove_comment_date_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='formated_text',
            field=models.TextField(default='', max_length=5000, verbose_name='Отформатированный текст'),
        ),
        migrations.AddField(
            model_name='post',
            name='views',
            field=models.PositiveIntegerField(default=0, verbose_name='Число просмотров'),
        ),
    ]
