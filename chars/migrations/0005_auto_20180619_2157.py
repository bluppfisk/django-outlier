# Generated by Django 2.0.6 on 2018-06-19 19:57

from django.db import migrations, models
import django.db.models.deletion
import glue64.fields


class Migration(migrations.Migration):

    dependencies = [
        ('chars', '0004_auto_20180612_2112'),
    ]

    operations = [
        migrations.AddField(
            model_name='altchar',
            name='location',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.DO_NOTHING, to='chars.Source'),
        ),
        migrations.AddField(
            model_name='altchar',
            name='page',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='altchar',
            name='image',
            field=glue64.fields.Glue64Field(),
        ),
        migrations.AlterField(
            model_name='altchar',
            name='name',
            field=models.CharField(default='', max_length=255),
        ),
    ]
