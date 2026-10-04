from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Booking
from .serializers import (
    BookingCreateSerializer,
    CustomerBookingSerializer,
    ProviderBookingSerializer,
    BookingStatusSerializer,
)


class BookingCreateView(generics.CreateAPIView):
    serializer_class = BookingCreateSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)


class CustomerBookingListView(generics.ListAPIView):
    serializer_class = CustomerBookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(
            customer=self.request.user
        )


class ProviderBookingListView(generics.ListAPIView):
    serializer_class = ProviderBookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(
            service__provider__user=self.request.user
        )

class ProviderBookingStatusView(generics.UpdateAPIView):

    serializer_class = BookingStatusSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ["patch"]

    def get_queryset(self):
        return Booking.objects.filter(
            service__provider__user=self.request.user
        )