from django.urls import path

from .views import CategoryListView, ProviderListView, ProviderDetailView


urlpatterns = [
    path("categories/", CategoryListView.as_view(), name="category-list"),
    path("providers/", ProviderListView.as_view(), name="provider-list"),
    path("providers/<int:pk>/", ProviderDetailView.as_view(), name="provider-detail"),
]
