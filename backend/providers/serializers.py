from rest_framework import serializers

from .models import ProviderProfile, Service


class ProviderProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProviderProfile
        fields = [
            "id",
            "description",
            "experience_years",
            "profile_photo",
            "status",
        ]
        read_only_fields = ["id", "status"]


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ["id", "category", "service_name", "description", "price",]
        read_only_fields = ["id"]
