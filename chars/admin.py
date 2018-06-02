from django.contrib import admin
# from django.contrib.admin import widgets
from django import forms
from django.db import models
import io

import csv

from .models import Char, Source, CharInSource


class LocationInline(admin.TabularInline):
    model = Char.location.through
    extra = 3


class CharAdmin(admin.ModelAdmin):
    inlines = [
        LocationInline,
    ]


class BulkUpload(forms.Form):
    file = forms.FileField()
    source = forms.ModelChoiceField(queryset=Source.objects.all())

    def save(self):
        # print(dir(self.cleaned_data['file']))
        # handle = open(self.cleaned_data['file'], 'rb')
        file = self.cleaned_data['file']
        source = self.cleaned_data['source']
        file.seek(0)
        to_be_added = []
        for line in file.readlines():
            data = line.decode('utf-8').split(',')
            name = data[0]
            if len(name) > 1:
                continue
            page = data[1].split('\n')[0]

            char = Char(name=name)
            char.save()
            location = CharInSource(source=source, page=page, char=char)
            # char.location.set(location)
            location.save()

            to_be_added.append({
                'source': location.source,
                'location': location.page,
                'char': char
            })

        return to_be_added


admin.site.register(Char, CharAdmin)
admin.site.register(Source)
