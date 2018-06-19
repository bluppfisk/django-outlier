from django.shortcuts import get_list_or_404, render
from django.views import generic
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.contrib.admin.views.decorators import staff_member_required

from .admin import BulkUpload
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
