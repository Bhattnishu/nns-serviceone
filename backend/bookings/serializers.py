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

    customer_phone = serializers.SerializerMethodField()

    service_name = serializers.CharField(
        source="service.service_name",
        read_only=True
    )

    address = serializers.SerializerMethodField()
    latitude = serializers.SerializerMethodField()
    longitude = serializers.SerializerMethodField()

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

    def get_customer_phone(self, obj):
        if obj.status in [
            Booking.Status.ACCEPTED,
            Booking.Status.COMPLETED,
        ]:
            return obj.customer.phone
        return None

    def get_address(self, obj):
        if obj.status in [
            Booking.Status.ACCEPTED,
            Booking.Status.COMPLETED,
        ]:
            return obj.address
        return None

    def get_latitude(self, obj):
        if obj.status in [
            Booking.Status.ACCEPTED,
            Booking.Status.COMPLETED,
        ]:
            return obj.latitude
        return None

    def get_longitude(self, obj):
        if obj.status in [
            Booking.Status.ACCEPTED,
            Booking.Status.COMPLETED,
        ]:
            return obj.longitude
        return None


class CustomerBookingSerializer(serializers.ModelSerializer):

    provider_name = serializers.CharField(
        source="service.provider.user.name",
        read_only=True
    )

    provider_phone = serializers.SerializerMethodField()

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

    def get_provider_phone(self, obj):
        if obj.status in [
            Booking.Status.ACCEPTED,
            Booking.Status.COMPLETED,
        ]:
            return obj.service.provider.user.phone
        return None


class BookingStatusSerializer(serializers.ModelSerializer):

    class Meta:
        model = Booking
        fields = ["status"]

    def validate_status(self, value):

        current_status = self.instance.status

        if current_status == Booking.Status.PENDING:
            if value not in [
                Booking.Status.ACCEPTED,
                Booking.Status.REJECTED,
            ]:
                raise serializers.ValidationError(
                    "A pending booking can only be accepted or rejected."
                )

        elif current_status == Booking.Status.ACCEPTED:
            if value != Booking.Status.COMPLETED:
                raise serializers.ValidationError(
                    "An accepted booking can only be marked as completed."
                )

        else:
            raise serializers.ValidationError(
                "This booking status cannot be changed."
            )

        return value
