from django.urls import path

from . import views

app_name = 'chars'
urlpatterns = [
    path('', views.IndexView.as_view(), name="index"),
    path('admin/bulk/', views.bulk_view, name="bulk"),
    path('search/', views.search, name="search"),
    path('<str:slug>/', views.ResultsView.as_view(), name="results"),
]
