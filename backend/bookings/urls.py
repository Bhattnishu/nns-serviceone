from django.urls import path

from .views import (
    BookingCreateView,
    CustomerBookingListView,
    ProviderBookingListView,
    ProviderBookingStatusView,
    CancelBookingView,
    CustomerBookingDetailView,
    ProviderBookingDetailView,
)

urlpatterns = [
    path("", BookingCreateView.as_view(), name="booking-create"),
    path("my/", CustomerBookingListView.as_view(), name="my-bookings"),
    path("provider/", ProviderBookingListView.as_view(), name="provider-bookings"),
    path("<int:pk>/status/", ProviderBookingStatusView.as_view(),
         name="booking-status"),
    path("my/<int:pk>/", CustomerBookingDetailView.as_view(), name="my-booking-detail",
         ),
    path("<int:pk>/cancel/", CancelBookingView.as_view(), name="booking-cancel"),
    path("provider/<int:pk>/", ProviderBookingDetailView.as_view(), name="provider-booking-detail",
         ),
]
