# Generated by Django 2.0.6 on 2018-06-02 12:55

from django.db import migrations
import s3direct.fields


class Migration(migrations.Migration):

    dependencies = [
        ('chars', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='source',
            name='file',
            field=s3direct.fields.S3DirectField(max_length=255),
        ),
    ]
