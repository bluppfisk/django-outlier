from django.shortcuts import get_list_or_404
from django.views import generic
from django.http import HttpResponseRedirect
from django.urls import reverse

from .models import Char


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
        char = self.kwargs['slug']
        object_list = get_list_or_404(Char, name=char)

        return object_list
