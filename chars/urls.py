from django.urls import path
from rest_framework_jwt.views import obtain_jwt_token, refresh_jwt_token

from . import views

app_name = "chars"
urlpatterns = [
    # static admin page
    path("admin/bulk/", views.bulk_view, name="bulk"),
    # crud api for models
    path("api/char/<int:pk>/", views.CharAPIView.as_view(), name="char-api"),
    path("api/char/<str:name>/", views.CharAPIView.as_view(), name="char-list-slug-api"),
    path(
        "api/char/<int:pk>/location/",
        views.LocationAPIView.as_view(),
        name="location-create-api",
    ),
    path(
        "api/char/<int:pk>/location/<int:loc_pk>/",
        views.LocationAPIView.as_view(),
        name="location-detail-api",
    ),
    path(
        "api/char/<int:pk>/altchar/",
        views.AltCharAPIView.as_view(),
        name="altchar-create-api",
    ),
    path(
        "api/char/<int:pk>/altchar/<int:ac_pk>/",
        views.AltCharAPIView.as_view(),
        name="altchar-detail-api",
    ),
    path("api/source/", views.SourceAPIView.as_view(), name="source-api"),
    path(
        "api/source/<int:pk>",
        views.SourceDeleteAPIView.as_view(),
        name="source-delete-api",
    ),
    path(
        "api/source/<int:pk>/locationMapper/",
        views.MapperAPIView.as_view(),
        name="mapper-api",
    ),
    # authentication api
    path("api/token-auth/", obtain_jwt_token),
    path("api/token-refresh/", refresh_jwt_token),
    # presigned url for direct uploads to s3
    path("api/get_presigned_url/", views.generate_presigned_s3_url),
]
