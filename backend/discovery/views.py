
from django.db.models import Q
from rest_framework import generics
from rest_framework.permissions import AllowAny

from providers.models import ServiceCategory, ProviderProfile, Service

from .serializers import (
    ServiceCategorySerializer,
    ServiceProviderProfileSerializer,
)


class CategoryListView(generics.ListAPIView):
    queryset = ServiceCategory.objects.all()
    serializer_class = ServiceCategorySerializer
    permission_classes = [AllowAny]


class ProviderListView(generics.ListAPIView):
    serializer_class = ServiceProviderProfileSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        providers = ProviderProfile.objects.filter(
            status=ProviderProfile.Status.APPROVED,
            services__status=Service.Status.APPROVED,
        )

        category = self.request.query_params.get("category")
        search = self.request.query_params.get("search", "").strip()
        state = self.request.query_params.get("state", "").strip()
        district = self.request.query_params.get("district", "").strip()
        pincode = self.request.query_params.get("pincode", "").strip()
        area = self.request.query_params.get("area", "").strip()

        if category:
            providers = providers.filter(
                services__category_id=category,
                services__status=Service.Status.APPROVED,
            )

        if search:
            for word in search.split():
                providers = providers.filter(
                    Q(user__name__icontains=word)
                    | Q(
                        services__service_name__icontains=word,
                        services__status=Service.Status.APPROVED,
                    )
                    | Q(
                        services__category__name__icontains=word,
                        services__status=Service.Status.APPROVED,
                    )
                    | Q(
                        services__description__icontains=word,
                        services__status=Service.Status.APPROVED,
                    )
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
    queryset = ProviderProfile.objects.filter(
        status=ProviderProfile.Status.APPROVED,
        services__status=Service.Status.APPROVED,
    ).distinct()
    serializer_class = ServiceProviderProfileSerializer
    permission_classes = [AllowAny]
