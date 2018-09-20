from rest_framework import serializers
from .models import Char, Source, AltChar, CharInSource


class AltCharSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = AltChar
        fields = ("id", "name", "image", "source", "page", "sequence_no", "source_obj")
        depth = 1

    def get_image(self, obj):
        return obj.get_full_image_path()


class AltCharMiniSerializer(AltCharSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = AltChar
        fields = ("id", "name", "image", "source", "page", "sequence_no", "source_obj")
        depth = 0

    def get_image(self, obj):
        return obj.get_full_image_path()


class CharSerializer(serializers.ModelSerializer):
    locations = serializers.SerializerMethodField()
    altchars = serializers.SerializerMethodField()

    class Meta:
        model = Char
        fields = ("id", "name", "locations", "altchars")
        depth = 1

    def get_locations(self, obj):
        qset = CharInSource.objects.filter(char=obj)
        return [CharInSourceSerializer(m).data for m in qset]

    def get_altchars(self, obj):
        qset = AltChar.objects.filter(canonical=obj)
        return [AltCharMiniSerializer(m).data for m in qset]


class CharInSourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = CharInSource
        fields = ("id", "page", "source")


class SourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Source
        fields = ("id", "title", "author", "file", "offset")
