from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

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


class CancelBookingView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            booking = Booking.objects.get(id=pk, customer=request.user)
        except Booking.DoesNotExist:
            return Response(
                {"detail": "Booking not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        if booking.status not in [Booking.Status.PENDING, Booking.Status.ACCEPTED,]:
            return Response(
                {"detail": "This booking cannot be cancelled."},
                status=status.HTTP_400_BAD_REQUEST
            )
        booking.status = Booking.Status.CANCELLED
        booking.save()

        return Response(
            {"detail": "Booking cancelled successfully."},
            status=status.HTTP_200_OK
        )


class CustomerBookingDetailView(generics.RetrieveAPIView):
    serializer_class = CustomerBookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(
            customer=self.request.user
        )


class ProviderBookingDetailView(generics.RetrieveAPIView):
    serializer_class = ProviderBookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(
            service__provider__user=self.request.user
        )
