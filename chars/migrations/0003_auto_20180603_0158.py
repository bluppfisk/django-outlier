# Generated by Django 2.0.6 on 2018-06-02 23:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chars', '0002_auto_20180602_1455'),
    ]

    operations = [
        migrations.AlterField(
            model_name='char',
            name='name',
            field=models.CharField(max_length=2),
        ),
    ]
