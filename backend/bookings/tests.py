from django.test import TestCase

from accounts.models import User
from providers.models import ProviderProfile, Service, ServiceCategory
from .serializers import BookingCreateSerializer
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from bookings.models import Booking


class BookingCreateSerializerTests(TestCase):
    def setUp(self):
        self.category = ServiceCategory.objects.create(
            name="Tutoring"
        )

        self.approved_service = self.create_service(
            "approved@example.com",
            "Approved Provider",
            "9000000001",
            ProviderProfile.Status.APPROVED,
        )

        self.pending_service = self.create_service(
            "pending@example.com",
            "Pending Provider",
            "9000000002",
            ProviderProfile.Status.PENDING,
        )

        self.rejected_service = self.create_service(
            "rejected@example.com",
            "Rejected Provider",
            "9000000003",
            ProviderProfile.Status.REJECTED,
        )

    def create_service(self, email, name, phone, provider_status):
        user = User.objects.create_user(
            email=email,
            password="TestPassword123!",
            name=name,
            phone=phone,
        )

        provider = ProviderProfile.objects.create(
            user=user,
            description=f"Services offered by {name}",
            status=provider_status,
        )

        return Service.objects.create(
            provider=provider,
            category=self.category,
            service_name="Math Tutoring",
            description="Mathematics lessons",
            price="500.00",
        )

    def test_approved_provider_service_is_allowed(self):
        serializer = BookingCreateSerializer(
            data={"service": self.approved_service.id}
        )

        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_pending_provider_service_is_rejected(self):
        serializer = BookingCreateSerializer(
            data={"service": self.pending_service.id}
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("service", serializer.errors)

    def test_rejected_provider_service_is_rejected(self):
        serializer = BookingCreateSerializer(
            data={"service": self.rejected_service.id}
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("service", serializer.errors)


class BookingAPITests(APITestCase):
    def setUp(self):
        # Create a service category.
        self.category = ServiceCategory.objects.create(
            name="Test Tutoring"
        )

        # Create a customer.
        self.customer = User.objects.create_user(
            email="customer@example.com",
            password="TestPassword123!",
            name="Test Customer",
            phone="9000000011",
        )

        # Create a provider.
        self.provider_user = User.objects.create_user(
            email="provider@example.com",
            password="TestPassword123!",
            name="Test Provider",
            phone="9000000012",
        )

        self.provider = ProviderProfile.objects.create(
            user=self.provider_user,
            description="Provides tutoring services",
            status=ProviderProfile.Status.APPROVED,
        )

        # Create a service offered by the approved provider.
        self.service = Service.objects.create(
            provider=self.provider,
            category=self.category,
            service_name="Math Tutoring",
            description="Mathematics lessons",
            price="500.00",
        )

    def test_customer_can_create_booking(self):
        # Simulate an authenticated customer.
        self.client.force_authenticate(user=self.customer)

        # Submit a request to the booking API.
        response = self.client.post(
            reverse("booking-create"),
            {
                "service": self.service.id,
                "message": "I need a math tutor.",
            },
            format="json",
        )

        # Check that the API reports successful creation.
        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

        # Check that the booking was saved correctly.
        booking = Booking.objects.get()

        self.assertEqual(booking.customer, self.customer)
        self.assertEqual(booking.service, self.service)

    def test_customer_cannot_view_another_customers_booking(self):
        # Create a booking belonging to the first customer.
        booking = Booking.objects.create(
            customer=self.customer,
            service=self.service,
            message="I need a math tutor.",
        )

        # Create a different customer.
        another_customer = User.objects.create_user(
            email="another@example.com",
            password="TestPassword123!",
            name="Another Customer",
            phone="9000000013",
        )

        # Authenticate as the second customer.
        self.client.force_authenticate(user=another_customer)

        # Try to view the first customer's booking.
        response = self.client.get(
            reverse("my-booking-detail", args=[booking.id])
        )

        # The booking should not be accessible.
        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND,
        )

    def test_provider_cannot_update_another_providers_booking(self):
        # Create a booking for our existing provider.
        booking = Booking.objects.create(
            customer=self.customer,
            service=self.service,
            message="I need a math tutor.",
        )

        # Create a different provider account.
        another_provider = User.objects.create_user(
            email="anotherprovider@example.com",
            password="TestPassword123!",
            name="Another Provider",
            phone="9000000014",
        )

        # Give the other user a provider profile.
        ProviderProfile.objects.create(
            user=another_provider,
            description="Another tutoring provider",
            status=ProviderProfile.Status.APPROVED,
        )

        # Authenticate as the other provider.
        self.client.force_authenticate(user=another_provider)

        # Try to accept the first provider's booking.
        response = self.client.patch(
            reverse("booking-status", args=[booking.id]),
            {"status": Booking.Status.ACCEPTED},
            format="json",
        )

        # The API should deny access to this booking.
        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND,
        )

        # The booking must remain pending.
        booking.refresh_from_db()
        self.assertEqual(booking.status, Booking.Status.PENDING)
