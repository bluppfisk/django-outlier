from django.contrib import admin
from django import forms
from .models import Char, Source, CharInSource, AltChar


class LocationInline(admin.TabularInline):
    model = Char.location.through
    extra = 3


class AltCharInline(admin.TabularInline):
    model = AltChar
    extra = 3


class CharAdmin(admin.ModelAdmin):
    inlines = [
        LocationInline,
        AltCharInline,
    ]


class BulkUpload(forms.Form):
    file = forms.FileField()
    source = forms.ModelChoiceField(queryset=Source.objects.all())

    def save(self):
        file = self.cleaned_data['file']
        source = self.cleaned_data['source']
        file.seek(0)
        to_be_added = []
        for line in file.readlines():
            data = line.decode('utf-8').split(',')
            name = data[0]
            if len(name) > 1:
                continue  # any faulty characters
            page = data[1].split('\n')[0]

            char = Char(name=name)
            char.save()
            location = CharInSource(source=source, page=page, char=char)
            location.save()

            to_be_added.append({
                'source': location.source,
                'location': location.page,
                'char': char
            })

        return to_be_added


admin.site.register(Char, CharAdmin)
admin.site.register(AltChar)
admin.site.register(Source)
