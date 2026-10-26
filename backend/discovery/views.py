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
        providers = ProviderProfile.objects.filter(
            status="APPROVED"
        )

        category = self.request.query_params.get("category")
        search = self.request.query_params.get("search", "").strip()
        state = self.request.query_params.get("state", "").strip()
        district = self.request.query_params.get("district", "").strip()
        pincode = self.request.query_params.get("pincode", "").strip()
        area = self.request.query_params.get("area", "").strip()

        if category:
            providers = providers.filter(
                services__category_id=category
            )

        if search:
            for word in search.split():
                providers = providers.filter(
                    Q(user__name__icontains=search)
                    | Q(services__service_name__icontains=word)
                    | Q(services__category__name__icontains=word)
                    | Q(services__description__icontains=word)
                )

        if state:
            providers = providers.filter(
                service_state__iexact=state
            )

        if district:
            providers = providers.filter(
                service_district__iexact=district
            )

        if pincode:
            providers = providers.filter(
                service_pincode=pincode
            )

        if area:
            providers = providers.filter(
                service_area__icontains=area
            )

        return providers.distinct()

class ProviderDetailView(generics.RetrieveAPIView):
    queryset = ProviderProfile.objects.filter(status="APPROVED")
    serializer_class = ServiceProviderProfileSerializer
