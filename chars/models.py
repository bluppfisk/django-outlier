from django.db import models


class Source(models.Model):
    title = models.CharField(max_length=200)
    author = models.CharField(max_length=200)
    file = models.FileField()
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


class CharInSource(models.Model):
    source = models.ForeignKey(Source, on_delete=models.CASCADE)
    char = models.ForeignKey(Char, on_delete=models.CASCADE)
    page = models.IntegerField()

    def __str__(self):
        return str(self.page)
