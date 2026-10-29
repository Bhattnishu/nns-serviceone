
from rest_framework import serializers
from django.db.models import Q

from providers.models import ServiceCategory, ProviderProfile, Service


class ServiceCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceCategory
        fields = ["id", "name", "description"]


class ServiceSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(
        source="category.name",
        read_only=True,
    )

    class Meta:
        model = Service
        fields = [
            "id",
            "service_name",
            "category_name",
            "description",
            "price",
        ]


class ServiceProviderProfileSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(
        source="user.name",
        read_only=True,
    )

    services = serializers.SerializerMethodField()

    class Meta:
        model = ProviderProfile
        fields = [
            "id",
            "user_name",
            "description",
            "experience_years",
            "profile_photo",
            "service_state",
            "service_district",
            "service_pincode",
            "service_area",
            "services",
        ]

    def get_services(self, obj):
        services = obj.services.filter(
            status=Service.Status.APPROVED,
            provider__status=ProviderProfile.Status.APPROVED,
        )

        request = self.context.get("request")

        if request:
            category = request.query_params.get("category")
            search = request.query_params.get("search", "").strip()

            if category:
                services = services.filter(category_id=category)

            if search:
                query = Q()

                for word in search.split():
                    query &= (
                        Q(service_name__icontains=word)
                        | Q(category__name__icontains=word)
                        | Q(description__icontains=word)
                    )

                services = services.filter(query)

        return ServiceSerializer(services, many=True).data
