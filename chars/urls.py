from django.urls import path, re_path

from . import views

app_name = 'chars'
urlpatterns = [
    path('', views.IndexView.as_view(), name="index"),
    path('admin/bulk', views.bulk_view, name="bulk"),
    path('search/', views.search, name="search"),
    path('search/<str:slug>', views.ResultsView.as_view(), name="results"),
    path('char/<int:pk>', views.DetailsView.as_view(), name="details"),
    path('char/<str:slug>', views.DetailsView.as_view(), name="details"),
    path('api/char', views.CharListAPIView.as_view(), name="char-list-api"),
    path('api/char/<int:pk>', views.CharAPIView.as_view(), name="char-api"),
    path('api/char/<str:name>', views.CharAPIView.as_view(), name="char-list-slug-api"),
    path('api/char/<int:pk>/location', views.LocationAPIView.as_view(), name="location-create-api"),
    path('api/char/<int:pk>/location/<int:loc_pk>', views.LocationAPIView.as_view(), name="location-detail-api"),
    path('api/char/<int:pk>/altchar', views.AltCharAPIView.as_view(), name="altchar-create-api"),
    path('api/char/<int:pk>/altchar/<int:ac_pk>', views.AltCharAPIView.as_view(), name="altchar-detail-api"),
    path('api/source', views.SourceListAPIView.as_view(), name="source-list-api"),
    path('api/source/<int:pk>/locationMapper', views.MapperAPIView.as_view(), name="mapper-api")
]
