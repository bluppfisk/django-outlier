from django.shortcuts import get_list_or_404, get_object_or_404, render
from django.views import generic
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.contrib.admin.views.decorators import staff_member_required
from rest_framework import generics
from rest_framework.response import Response
# from rest_framework.permissions import IsAdminUser

from .serializers import AltCharSerializer, CharSerializer, SourceSerializer, CharInSourceSerializer

from .admin import BulkUpload
from .models import AltChar, Char, Source, CharInSource


class CharListAPIView(generics.ListCreateAPIView):
    queryset = Char.objects.all()

    def list(self, request):
        qset = self.get_queryset()

        sources = []
        for i in qset:
            for j in i.location.all():
                if j not in sources:
                    sources.append(j)

        data = CharSerializer(qset, many=True).data
        sources = SourceSerializer(sources, many=True).data
        return Response({
            'chars': data,
            'sources': sources,
        })


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
        print(data)
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

        return Response(CharInSourceSerializer(cis).data)


class SourceListAPIView(generics.ListAPIView):
    queryset = Source.objects.all()
    serializer_class = SourceSerializer


class CharAPIView(generics.RetrieveAPIView):
    queryset = Char.objects.all()
    lookup_field = "name"
    serializer_class = CharSerializer

    def retrieve(self, *args, **kwargs):
        pk = self.kwargs.pop('pk', None)
        if pk:
            instance = get_object_or_404(Char, pk=pk)
        else:
            name = self.kwargs.pop('name', '')
            instance = get_object_or_404(Char, name=name)

        char = CharSerializer(instance).data
        sources = [SourceSerializer(m).data for m in {i for i in instance.location.all()}]

        return Response({
            'char': char,
            'sources': sources,
        })

    def put(self, request):
        data = request.data
        char = Char.objects.get(pk=data.get('char_id'))
        source = Source.objects.get(pk=data.get('source_id'))
        page = data.get('page_no')

        char_in_source = CharInSource(source=source, char=char, page=page)
        # char_in_source.save()

        response = CharSerializer(char).data
        return Response(response)


class IndexView(generic.ListView):
    template_name = "chars/index.html"
    context_object_name = "recent_chars"

    def get_queryset(self):
        return Char.objects.all().order_by('-id')[:10]


def search(request):
    if request.POST["char"] == "":
        return HttpResponseRedirect(reverse('chars:index'))

    return HttpResponseRedirect(reverse('chars:results', args=(request.POST["char"],)))


class ResultsView(generic.ListView):
    template_name = "chars/results.html"
    context_object_name = "chars"
    slug_field = 'name'

    def get_queryset(self):
        char = self.kwargs.pop('slug', '')
        object_list = get_list_or_404(Char, name=char)
        return object_list

    def render_to_response(self, context):
        if len(self.object_list) == 1:
            return HttpResponseRedirect(reverse('chars:details', args=(self.char,)))
        return super(ResultsView, self).render_to_response(context)


class DetailsView(generic.DetailView):
    model = Char
    template_name = "chars/details.html"
    context_object_name = "char"
    slug_field = "name"
    pk_field = "pk"

    def get_object(self):
        pk = self.kwargs.pop('pk', None)
        if pk:
            return get_object_or_404(Char, pk=pk)

        char = self.kwargs.pop('slug', '')
        return get_object_or_404(Char, name=char)


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
