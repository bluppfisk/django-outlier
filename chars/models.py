from django.db import models
from s3direct.fields import S3DirectField
from glue64.fields import Glue64Field
from django.conf import settings
from random import randint
from .utils import S3StorageHandler as StorageHandler


class Source(models.Model):
    title = models.CharField(max_length=200, unique=True)
    author = models.CharField(max_length=200)
    file = S3DirectField(dest=settings.SOURCE_PATH)
    offset = models.IntegerField(default=0)

    def delete(self, *args, **kwargs):
        StorageHandler.delete_object(settings.SOURCE_PATH + self.file)
        StorageHandler.delete_folder(settings.SOURCE_PATH + self.file)
        super(Source, self).delete(*args, **kwargs)

    def get_full_file_path(self):
        return "{}{}/{}{}".format(
            settings.AWS_ACCESS_URL,
            settings.AWS_STORAGE_BUCKET_NAME,
            settings.SOURCE_PATH,
            self.file,
        )

    class Meta:
        ordering = ["title"]


class Char(models.Model):
    name = models.CharField(max_length=1, unique=True)
    location = models.ManyToManyField(Source, through="CharInSource")

    def __str__(self):
        return self.name

    class Meta:
        ordering = ["name"]


class CharInSource(models.Model):
    source = models.ForeignKey(Source, on_delete=models.CASCADE)
    char = models.ForeignKey(Char, on_delete=models.CASCADE)
    page = models.IntegerField()

    def __str__(self):
        return "{} in {} on page {}".format(self.char.name, self.source.title, self.page)

    class Meta:
        ordering = ["pk"]


class AltChar(models.Model):
    name = models.CharField(max_length=255, default="")
    canonical = models.ForeignKey(Char, on_delete=models.DO_NOTHING)
    sequence_no = models.IntegerField(default=0)
    source_obj = models.CharField(max_length=255, default="")
    source = models.ForeignKey(Source, default=1, on_delete=models.DO_NOTHING)
    page = models.IntegerField(default=0)
    image = Glue64Field(dest=settings.ALTCHAR_PATH)

    def save(self, *args, **kwargs):
        filename = self.get_filename()

        if "data:image/png;base64" in self.image:
            # freshly pasted: upload
            StorageHandler.base64_upload(self.image, settings.ALTCHAR_PATH, filename)
        else:
            # compare newly computed filename with one in database
            # and rename file on S3 instead
            original_image = AltChar.objects.get(pk=self.id).image
            if original_image != filename:
                StorageHandler.rename_object(
                    settings.ALTCHAR_PATH + original_image,
                    settings.ALTCHAR_PATH + filename,
                )

        # below misleads the browser cache into refreshing the resource after a save operation
        self.image = "{}?{}".format(filename, randint(0, 3000))

        super(AltChar, self).save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        StorageHandler.delete_object(settings.ALTCHAR_PATH + self.image)
        super(AltChar, self).delete(*args, **kwargs)

    def get_full_image_path(self, image=None):
        image = image or self.image
        return "{}{}/{}{}".format(
            settings.AWS_ACCESS_URL,
            settings.AWS_STORAGE_BUCKET_NAME,
            settings.ALTCHAR_PATH,
            image,
        )

    def get_filename(self):
        filename = "{}-evolution-{}-{}-{}-{}.png".format(
            self.canonical.name,
            self.sequence_no,
            self.source.title,
            self.page,
            self.source_obj,
        )
        keepcharacters = (" ", ".", "_", "-")
        return "".join(c for c in filename if c.isalnum() or c in keepcharacters).rstrip()

    class Meta:
        ordering = ["id"]
        unique_together = ("canonical", "sequence_no", "page", "source", "name")
