from rest_framework import generics
from django.db.models import Q

from providers.models import ServiceCategory, ProviderProfile

from .serializers import (
    ServiceCategorySerializer,
    ServiceProviderProfileSerializer,
)


class CategoryListView(generics.ListAPIView):

    queryset = ServiceCategory.objects.all()
    serializer_class = ServiceCategorySerializer


class ProviderListView(generics.ListAPIView):
    serializer_class = ServiceProviderProfileSerializer

    def get_queryset(self):

        provider = ProviderProfile.objects.filter(
            status="APPROVED"
        )

        category = self.request.query_params.get("category")
        search = self.request.query_params.get("search")

        if category:
            provider = provider.filter(
                services__category_id=category
            ).distinct()

        if search:
            provider = provider.filter(
                Q(user__name__icontains=search) |
                Q(services__service_name__icontains=search) |
                Q(services__category__name__icontains=search) |
                Q(services__description__icontains=search)
            ).distinct()

        return provider


class ProviderDetailView(generics.RetrieveAPIView):
    queryset = ProviderProfile.objects.filter(status="APPROVED")
    serializer_class = ServiceProviderProfileSerializer
