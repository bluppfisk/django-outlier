from rest_framework import serializers
from .models import Char, Source, AltChar, CharInSource


class SingleCharSerializer(serializers.ModelSerializer):
    forms = serializers.SerializerMethodField()
    locations = serializers.SerializerMethodField()

    class Meta:
        model = Char
        fields = ('id', 'name', 'locations', 'forms',)

    def get_forms(self, obj):
        qset = AltChar.objects.filter(canonical=obj)
        return [AltCharSerializer(m).data for m in qset]

    def get_locations(self, obj):
        return CharSerializer().get_locations(obj)


class AltCharSerializer(serializers.ModelSerializer):
    class Meta:
        model = AltChar
        fields = ('id', 'name', 'image',)


class CharSerializer(serializers.ModelSerializer):
    locations = serializers.SerializerMethodField()

    class Meta:
        model = Char
        fields = ('id', 'name', 'locations',)
        depth = 1

    def get_locations(self, obj):
        qset = CharInSource.objects.filter(char=obj)
        return [CharInSourceSerializer(m).data for m in qset]


class CharInSourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = CharInSource
        fields = ('page', 'source',)


class SourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Source
        fields = ('id', 'title', 'author',)


class SummarySerializer(serializers.Serializer):
    chars = [CharSerializer(m).data for m in Char.objects.all()]
    sources = [SourceSerializer(m).data for m in Source.objects.all()]
    data = {
        'chars': chars,
        'sources': sources,
    }
