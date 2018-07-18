from django.urls import path

from . import views

app_name = 'chars'
urlpatterns = [
    path('', views.IndexView.as_view(), name="index"),
    path('admin/bulk', views.bulk_view, name="bulk"),
    path('search/', views.search, name="search"),
    path('search/<str:slug>', views.ResultsView.as_view(), name="results"),
    path('char/<int:pk>', views.DetailsView.as_view(), name="details"),
    path('char/<str:slug>', views.DetailsView.as_view(), name="details"),
    path('api/chars', views.CharListAPIView.as_view(), name="char-list-api"),
    path('api/char/<int:pk>', views.CharAPIView.as_view(), name="char-api"),
    path('api/char/<str:name>', views.CharAPIView.as_view(), name="char-list-slug-api"),
]
