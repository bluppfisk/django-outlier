from rest_framework import serializers
from .models import Char, Source, AltChar, CharInSource
from django.conf import settings

# class SingleCharSerializer(serializers.ModelSerializer):
#     forms = serializers.SerializerMethodField()
#     locations = serializers.SerializerMethodField()

#     class Meta:
#         model = Char
#         fields = ('id', 'name', 'locations', 'forms',)

#     def get_forms(self, obj):
#         qset = AltChar.objects.filter(canonical=obj)
#         return [AltCharSerializer(m).data for m in qset]

#     def get_locations(self, obj):
#         return CharSerializer().get_locations(obj)


class AltCharSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = AltChar
        fields = ('id', 'name', 'image', 'location', 'page', 'sequence_no', 'source_obj',)

    def get_image(self, obj):
        return obj.get_full_image_path()


class CharSerializer(serializers.ModelSerializer):
    locations = serializers.SerializerMethodField()
    altchars = serializers.SerializerMethodField()

    class Meta:
        model = Char
        fields = ('id', 'name', 'locations', 'altchars',)
        depth = 1

    def get_locations(self, obj):
        qset = CharInSource.objects.filter(char=obj)
        return [CharInSourceSerializer(m).data for m in qset]

    def get_altchars(self, obj):
        qset = AltChar.objects.filter(canonical=obj)
        return [AltCharSerializer(m).data for m in qset]


class CharInSourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = CharInSource
        fields = ('page', 'source',)


class SourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Source
        fields = ('id', 'title', 'author', 'file', )
