from django.contrib import admin

from .models import Char, Source


class LocationInline(admin.TabularInline):
    model = Char.location.through
    extra = 3


class CharAdmin(admin.ModelAdmin):
    inlines = [
        LocationInline,
    ]


admin.site.register(Char, CharAdmin)
admin.site.register(Source)
