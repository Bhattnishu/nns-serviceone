from rest_framework import serializers
from .models import Booking


class BookingCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Booking

        fields = [
            "service",
            "message",
            "preferred_date",
            "address",
            "latitude",
            "longitude",
        ]


class ProviderBookingSerializer(serializers.ModelSerializer):

    customer_name = serializers.CharField(
        source="customer.name",
        read_only=True
    )

    customer_phone = serializers.CharField(
        source="customer.phone",
        read_only=True
    )

    service_name = serializers.CharField(
        source="service.service_name",
        read_only=True
    )

    class Meta:
        model = Booking

        fields = [
            "id",
            "customer_name",
            "customer_phone",
            "service_name",
            "message",
            "preferred_date",
            "address",
            "latitude",
            "longitude",
            "status",
            "created_at",
        ]

        read_only_fields = fields


class CustomerBookingSerializer(serializers.ModelSerializer):

    provider_name = serializers.CharField(
        source="service.provider.user.name",
        read_only=True
    )

    provider_phone = serializers.CharField(
        source="service.provider.user.phone",
        read_only=True
    )

    service_name = serializers.CharField(
        source="service.service_name",
        read_only=True
    )

    class Meta:
        model = Booking

        fields = [
            "id",
            "provider_name",
            "provider_phone",
            "service_name",
            "message",
            "preferred_date",
            "address",
            "latitude",
            "longitude",
            "status",
            "created_at",
        ]

        read_only_fields = fields

class BookingStatusSerializer(serializers.ModelSerializer):

    class Meta:
        model = Booking
        fields = ["status"]

    def validate_status(self, value):

        if value not in [
            Booking.Status.ACCEPTED,
            Booking.Status.REJECTED,
        ]:
            raise serializers.ValidationError(
                "You can only accept or reject a booking."
            )

        if self.instance.status != Booking.Status.PENDING:
            raise serializers.ValidationError(
                "Only pending bookings can be updated."
            )

        return value