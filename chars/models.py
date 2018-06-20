from django.db import models
from s3direct.fields import S3DirectField
from glue64.fields import Glue64Field
from django.conf import settings
import boto3
import base64


class Source(models.Model):
    title = models.CharField(max_length=200)
    author = models.CharField(max_length=200)
    file = S3DirectField(dest='sources', max_length=255)
    offset = models.IntegerField(default=0)

    def __str__(self):
        return self.title + " by " + self.author

    class Meta:
        ordering = ('title',)


class Char(models.Model):
    name = models.CharField(max_length=1)
    location = models.ManyToManyField(Source, through='CharInSource')

    def __str__(self):
        return self.name

    class Meta:
        ordering = ('name',)


class AltChar(models.Model):
    name = models.CharField(max_length=255, default="")
    canonical = models.ForeignKey(Char, on_delete=models.DO_NOTHING)
    sequence_no = models.IntegerField(default=0)
    source_obj = models.CharField(max_length=255, default="")
    location = models.ForeignKey(Source, default=1, on_delete=models.DO_NOTHING)
    page = models.IntegerField(default=0)
    image = Glue64Field()

    def __str__(self):
        return self.name + "*"

    def save(self, *args, **kwargs):
        if "data:image/png;base64" in self.image:
            s3 = boto3.resource(
                's3',
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY
            )

            filename = "{}-evolution-{}-{}-{}-{}.png".format(
                self.canonical.name,
                self.sequence_no,
                self.location.title,
                self.page,
                self.source_obj
            )
            data = base64.b64decode(self.image.replace("data:image/png;base64,", ""))

            s3.Object(settings.AWS_STORAGE_BUCKET_NAME, "uploads/altchars/" + filename).put(Body=data)
            self.image = "https://s3.eu-west-2.amazonaws.com/outlier-linguistics/uploads/altchars/" + filename
        super(AltChar, self).save(*args, **kwargs)

    class Meta:
        ordering = ('name',)


class CharInSource(models.Model):
    source = models.ForeignKey(Source, on_delete=models.CASCADE)
    char = models.ForeignKey(Char, on_delete=models.CASCADE)
    page = models.IntegerField()

    def __str__(self):
        return str(self.page)
