# Generated by Django 3.2.5 on 2021-07-08 12:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0004_review_createdat'),
    ]

    operations = [
        migrations.CreateModel(
            name='Slider',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='')),
                ('text', models.TextField()),
                ('title', models.CharField(max_length=255)),
                ('createdAt', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]