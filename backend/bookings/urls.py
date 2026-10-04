from django.urls import path

from .views import (
    BookingCreateView,
    CustomerBookingListView,
    ProviderBookingListView,
    ProviderBookingStatusView,
)


urlpatterns = [
    path(
        "",
        BookingCreateView.as_view(),
        name="booking-create",
    ),

    path(
        "my/",
        CustomerBookingListView.as_view(),
        name="my-bookings",
    ),

    path(
        "provider/",
        ProviderBookingListView.as_view(),
        name="provider-bookings",
    ),

    path(
        "<int:pk>/status/",
        ProviderBookingStatusView.as_view(),
        name="booking-status",
    ),
]
