from rest_framework import serializers

from providers.models import ServiceCategory, ProviderProfile, Service


class ServiceCategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = ServiceCategory
        fields = ["id", "name", "description"]


class ServiceSerializer(serializers.ModelSerializer):

    category_name = serializers.CharField(
        source="category.name",
        read_only=True
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
        read_only=True
    )

    services = ServiceSerializer(
        many=True,
        read_only=True
    )

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
