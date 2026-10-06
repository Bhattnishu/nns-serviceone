from rest_framework import generics
from django.db.models import Q
from rest_framework.permissions import AllowAny

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
    permission_classes = [AllowAny]

    def get_queryset(self):

        provider = ProviderProfile.objects.filter(
            status="APPROVED"
        )

        category = self.request.query_params.get("category")
        search = self.request.query_params.get("search")
        state = self.request.query_params.get("state")
        district = self.request.query_params.get("district")
        pincode = self.request.query_params.get("pincode")

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

        if state:
            provider = provider.filter(
                service_state__iexact=state
            )

        if district:
            provider = provider.filter(
                service_district__iexact=district
            )

        if pincode:
            provider = provider.filter(
                service_pincode=pincode
            )

        return provider


class ProviderDetailView(generics.RetrieveAPIView):
    queryset = ProviderProfile.objects.filter(status="APPROVED")
    serializer_class = ServiceProviderProfileSerializer
