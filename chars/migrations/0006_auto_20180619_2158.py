# Generated by Django 2.0.6 on 2018-06-19 19:58

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('chars', '0005_auto_20180619_2157'),
    ]

    operations = [
        migrations.AlterField(
            model_name='altchar',
            name='location',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.DO_NOTHING, to='chars.Source'),
        ),
    ]
