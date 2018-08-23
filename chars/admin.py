from django.contrib import admin
from django import forms
from .models import Char, Source, AltChar
from .utils import LocationSourceMapper, CSVFileReader


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
        locations = CSVFileReader.read(self.cleaned_data['file'])
        map = LocationSourceMapper.map(
            locations=locations,
            source=self.cleaned_data['source']
        )
        return map


admin.site.register(Char, CharAdmin)
admin.site.register(AltChar)
admin.site.register(Source)
