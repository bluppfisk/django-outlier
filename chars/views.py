from django.shortcuts import get_list_or_404, get_object_or_404, render
from django.views import generic
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.contrib.admin.views.decorators import staff_member_required
from rest_framework import generics
from rest_framework.response import Response
# from rest_framework.permissions import IsAdminUser

from .serializers import CharSerializer, SourceSerializer

from .admin import BulkUpload
from .models import Char


class CharListAPIView(generics.ListAPIView):
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


class CharAPIView(generics.RetrieveAPIView):
    queryset = Char.objects.all()
    lookup_field = "name"

    def retrieve(self, *args, **kwargs):
        pk = self.kwargs.pop('pk', None)
        if pk:
            instance = get_object_or_404(Char, pk=pk)
        else:
            name = self.kwargs.pop('name', '')
            instance = get_object_or_404(Char, name=name)

        char = CharSerializer(instance).data
        sources = [SourceSerializer(m).data for m in [i for i in instance.location.all()]]

        return Response({
            'char': char,
            'sources': sources,
        })


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
