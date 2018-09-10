from django.shortcuts import get_object_or_404, render
from django.conf import settings
from django.contrib.admin.views.decorators import staff_member_required
from django.views.decorators.csrf import csrf_exempt
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.parsers import FileUploadParser
from rest_framework.decorators import api_view
import boto3
import json
from botocore.client import Config

from .serializers import AltCharSerializer, CharSerializer, SourceSerializer, CharInSourceSerializer
from .admin import BulkUpload
from .models import AltChar, Char, Source, CharInSource
from .utils import CSVFileReader, LocationSourceMapper


###
# Receives a CSV file with character => [page, source] mappings
# and a Source object to be processed by LocationSourceMapper

class MapperAPIView(generics.GenericAPIView):
    parser_classes = (FileUploadParser, )

    def put(self, request, *args, **kwargs):
        file = request.FILES['file']
        source = Source.objects.get(pk=kwargs.pop('pk'))
        locations = CSVFileReader.read(file)
        map = LocationSourceMapper.map(locations=locations, source=source)

        return Response({"numberAdded": len(map)})


###
# Deals with creating, updating and deleting historical forms of characters

class AltCharAPIView(generics.GenericAPIView):
    serializer_class = AltCharSerializer
    queryset = AltChar.objects.all()

    # TODO: implement put function
    def put(self, request, *args, **kwargs):
        data = request.data
        data.update({
            "source": Source.objects.get(pk=data.get('source')),
            "canonical": Char.objects.get(pk=kwargs.pop('pk'))
        })
        # char = Char.objects.get(pk=kwargs.pop('pk'))
        # ac = AltChar.objects.create(**data)
        # serializer = AltCharSerializer(data=data)
        # if serializer.is_valid():
        #     print(serializer.validated_data)
        #     ac = serializer.save()

        # return Response(AltCharSerializer(ac).data)
        # char = Char.objects.get(pk=kwargs.pop('pk'))
        # ac = AltChar.objects.get(pk=kwargs.pop('ac_pk'))
        # ac.update(**data)
        # ac.source = Source.objects.get(pk=data.get('source'))
        # ac.sequence_no = data.get('sequence_no')

        # ac.save()

    def post(self, request, *args, **kwargs):
        char = Char.objects.get(pk=kwargs.pop('pk'))
        data = request.data
        source = Source.objects.get(pk=data.get('source'))
        data.update({
            'canonical': char,
            'source': source
        })
        ac = AltChar(**data)
        ac.save()

        return Response(AltCharSerializer(ac).data)

    def delete(self, request, *args, **kwargs):
        char = Char.objects.get(pk=kwargs.pop('pk'))
        altchar = AltChar.objects.get(pk=kwargs.pop('ac_pk'))

        altchar.delete()

        return Response(AltCharSerializer([m for m in AltChar.objects.filter(canonical=char)], many=True).data)


##
# CRUD for Location (character => [source, page])

class LocationAPIView(generics.GenericAPIView):
    serializer_class = CharInSourceSerializer
    queryset = CharInSource.objects.all()

    def get(self, *args, **kwargs):
        char = Char.objects.get(pk=kwargs.pop('pk'))
        cis = CharInSource.objects.filter(char=char)

        return Response(CharInSourceSerializer(cis, many=True).data)

    def delete(self, request, *args, **kwargs):
        char = Char.objects.get(pk=kwargs.pop('pk'))
        cis = CharInSource.objects.get(pk=kwargs.pop('loc_pk'))
        cis.delete()

        return Response(CharSerializer(char).data)

    def post(self, request, *args, **kwargs):
        char = Char.objects.get(pk=kwargs.pop('pk'))
        source = Source.objects.get(pk=request.data.get('source').get('id'))
        page = request.data.get('page')

        cis = CharInSource(source=source, page=page, char=char)
        cis.save()


###
# Create, Read and Update for Source objects

class SourceAPIView(generics.GenericAPIView):
    def get(self, request, *args, **kwargs):
        sources = Source.objects.all()
        return Response(SourceSerializer(sources, many=True).data)

    def put(self, request, *args, **kwargs):
        source_data = request.data
        source = Source(**source_data)
        source.save()

        return Response(SourceSerializer(source).data)

    def post(self, request, *args, **kwargs):
        source_data = request.data
        source = Source(**source_data)
        source.save()

        return Response(SourceSerializer(source).data)

###
# A bit more DRF-like, using actual DestroyAPIView

class SourceDeleteAPIView(generics.DestroyAPIView):
    lookup_field = "pk"
    queryset = Source.objects.all()


###
# Returns a Character object with its details

class CharAPIView(generics.RetrieveAPIView):
    serializer_class = CharSerializer

    # Parameter in API URL can be either id or name. Deal with both cases here.
    def get_object(self):
        pk = self.kwargs.pop('pk', None)
        if pk:
            instance = get_object_or_404(Char, pk=pk)
        else:
            name = self.kwargs.pop('name', '')
            instance = get_object_or_404(Char, name=name)

        return instance


###
# Only for static admin page

@staff_member_required
def bulk_view(request):
    if request.method == "POST":
        form = BulkUpload(request.POST, request.FILES)

        if form.is_valid():
            data = form.save()

            context = {"form": form, "error": "Success", "data": data}
            return render(request, 'admin/bulk.html', context)
        else:
            context = {"form": form, "error": "Invalid form"}
            return render(request, 'admin/bulk.html', context)
    else:
        form = BulkUpload()
        context = {"form": form}
        return render(request, 'admin/bulk.html', context)


###
# Generates a presigned url that allows direct uploads
# to S3 without passing through the backend and without
# exposing credentials.

@csrf_exempt
@api_view(('POST',))
def generate_presigned_s3_url(request):
    data = json.loads(request.body)
    filetype = data['filetype']  # helps constrain uploaded data
    filename = data['filename']  # must contain path relative to bucket

    s3 = boto3.client(
        's3',
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        region_name=settings.S3DIRECT_REGION,
        config=Config(signature_version="s3v4")
    )
    url = s3.generate_presigned_url(
        'put_object',
        Params={
            'Bucket': settings.AWS_STORAGE_BUCKET_NAME,
            'Key': filename,
            'ContentType': filetype

        },
        HttpMethod='PUT',
        ExpiresIn=3600
    )
    return Response(url)
