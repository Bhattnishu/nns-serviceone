from django.urls import path

from .views import (
    ProviderProfileCreateView,
    MyProviderProfileView,
    ServiceCreateView,
    MyServicesListView,
    MyServiceDetailView,
)

urlpatterns = [
    path("profile/", ProviderProfileCreateView.as_view(), name="provider-profile"),
    path("profile/me/", MyProviderProfileView.as_view(),
         name="my-provider-profile"),
    path("services/", ServiceCreateView.as_view(), name="service-create"),
    path("services/my/", MyServicesListView.as_view(), name="my-services"),
    path("services/<int:pk>/", MyServiceDetailView.as_view(),
         name="my-service-detail"),
]
