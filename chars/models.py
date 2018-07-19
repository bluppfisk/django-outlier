from django.db import models
from s3direct.fields import S3DirectField
from glue64.fields import Glue64Field
from django.conf import settings
from .utils import StorageHandler


class Source(models.Model):
    title = models.CharField(max_length=200, unique=True)
    author = models.CharField(max_length=200)
    file = S3DirectField(dest='sources', max_length=255)
    offset = models.IntegerField(default=0)

    def __str__(self):
        return self.title + " by " + self.author

    class Meta:
        ordering = ('title',)


class Char(models.Model):
    name = models.CharField(max_length=1, unique=True)
    location = models.ManyToManyField(Source, through='CharInSource')

    def __str__(self):
        return self.name

    class Meta:
        ordering = ('name',)


class CharInSource(models.Model):
    source = models.ForeignKey(Source, on_delete=models.CASCADE)
    char = models.ForeignKey(Char, on_delete=models.CASCADE)
    page = models.IntegerField()

    def __str__(self):
        return str(self.char.name + " in " + self.source.title + " on page " + self.page)


class AltChar(models.Model):
    name = models.CharField(max_length=255, default="")
    canonical = models.ForeignKey(Char, on_delete=models.DO_NOTHING)
    sequence_no = models.IntegerField(default=0)
    source_obj = models.CharField(max_length=255, default="")
    location = models.ForeignKey(Source, default=1, on_delete=models.DO_NOTHING)
    page = models.IntegerField(default=0)
    image = Glue64Field(dest=settings.ALTCHAR_PATH)

    __original_image = None

    def __str__(self):
        return self.canonical.name + " (hist)"

    def __init__(self, *args, **kwargs):
        super(AltChar, self).__init__(*args, **kwargs)
        self.__original_image = self.image

    def save(self, *args, **kwargs):
        filename = "{}-evolution-{}-{}-{}-{}.png".format(
            self.canonical.name,
            self.sequence_no,
            self.location.title,
            self.page,
            self.source_obj
        )

        if "data:image/png;base64" in self.image:
            # freshly pasted: upload
            StorageHandler.base64_to_s3(self.image, settings.ALTCHAR_PATH, filename)

        self.image = filename

        if self.__original_image != self.image and self.__original_image != "":
            # rename file on S3 if data changed
            original_filename = self.__original_image.split("/")[-1:][0]
            StorageHandler.rename_object(original_filename, filename)

        super(AltChar, self).save(*args, **kwargs)
        self.__original_image = self.image

    def delete(self, *args, **kwargs):
        StorageHandler.delete_object(settings.ALTCHAR_PATH + self.image)
        super(AltChar, self).delete(*args, **kwargs)

    def get_full_image_path(self):
        return "{}{}/{}{}".format(
            settings.AWS_ACCESS_URL,
            settings.AWS_STORAGE_BUCKET_NAME,
            settings.ALTCHAR_PATH,
            self.image
        )

    class Meta:
        ordering = ('name',)
