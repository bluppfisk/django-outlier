# Generated by Django 2.0.6 on 2018-06-12 19:12

from django.db import migrations, models
import django.db.models.deletion
import s3direct.fields


class Migration(migrations.Migration):

    dependencies = [
        ('chars', '0003_auto_20180603_0158'),
    ]

    operations = [
        migrations.CreateModel(
            name='AltChar',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=1, null=True)),
                ('image', s3direct.fields.S3DirectField(max_length=255)),
            ],
            options={
                'ordering': ('name',),
            },
        ),
        migrations.AlterField(
            model_name='char',
            name='name',
            field=models.CharField(max_length=1),
        ),
        migrations.AddField(
            model_name='altchar',
            name='canonical',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='chars.Char'),
        ),
    ]