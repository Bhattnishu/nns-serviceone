
from django.test import TestCase
from django.urls import reverse

from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import User
from providers.models import ProviderProfile, Service, ServiceCategory
from bookings.models import Booking
from bookings.serializers import BookingCreateSerializer


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
            Service.Status.APPROVED,
        )

        self.pending_provider_service = self.create_service(
            "pending@example.com",
            "Pending Provider",
            "9000000002",
            ProviderProfile.Status.PENDING,
            Service.Status.APPROVED,
        )

        self.rejected_provider_service = self.create_service(
            "rejected@example.com",
            "Rejected Provider",
            "9000000003",
            ProviderProfile.Status.REJECTED,
            Service.Status.APPROVED,
        )

        self.pending_service = self.create_service(
            "pendingservice@example.com",
            "Approved Provider With Pending Service",
            "9000000004",
            ProviderProfile.Status.APPROVED,
            Service.Status.PENDING,
        )

        self.rejected_service = self.create_service(
            "rejectedservice@example.com",
            "Approved Provider With Rejected Service",
            "9000000005",
            ProviderProfile.Status.APPROVED,
            Service.Status.REJECTED,
        )

    def create_service(
        self,
        email,
        name,
        phone,
        provider_status,
        service_status,
    ):
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
            status=service_status,
        )

    def test_approved_provider_and_service_are_allowed(self):
        serializer = BookingCreateSerializer(
            data={"service": self.approved_service.id}
        )

        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_pending_provider_service_is_rejected(self):
        serializer = BookingCreateSerializer(
            data={"service": self.pending_provider_service.id}
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("service", serializer.errors)

    def test_rejected_provider_service_is_rejected(self):
        serializer = BookingCreateSerializer(
            data={"service": self.rejected_provider_service.id}
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("service", serializer.errors)

    def test_pending_service_is_rejected(self):
        serializer = BookingCreateSerializer(
            data={"service": self.pending_service.id}
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("service", serializer.errors)

    def test_rejected_service_is_rejected(self):
        serializer = BookingCreateSerializer(
            data={"service": self.rejected_service.id}
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("service", serializer.errors)


class BookingAPITests(APITestCase):
    def setUp(self):
        self.category = ServiceCategory.objects.create(
            name="Test Tutoring"
        )

        self.customer = User.objects.create_user(
            email="customer@example.com",
            password="TestPassword123!",
            name="Test Customer",
            phone="9000000011",
        )

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

        self.service = Service.objects.create(
            provider=self.provider,
            category=self.category,
            service_name="Math Tutoring",
            description="Mathematics lessons",
            price="500.00",
            status=Service.Status.APPROVED,
        )

    def test_customer_can_create_booking(self):
        self.client.force_authenticate(user=self.customer)

        response = self.client.post(
            reverse("booking-create"),
            {
                "service": self.service.id,
                "message": "I need a math tutor.",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
            response.data,
        )

        booking = Booking.objects.get()

        self.assertEqual(booking.customer, self.customer)
        self.assertEqual(booking.service, self.service)

    def test_customer_cannot_view_another_customers_booking(self):
        booking = Booking.objects.create(
            customer=self.customer,
            service=self.service,
            message="I need a math tutor.",
        )

        another_customer = User.objects.create_user(
            email="another@example.com",
            password="TestPassword123!",
            name="Another Customer",
            phone="9000000013",
        )

        self.client.force_authenticate(user=another_customer)

        response = self.client.get(
            reverse("my-booking-detail", args=[booking.id])
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND,
        )

    def test_provider_cannot_update_another_providers_booking(self):
        booking = Booking.objects.create(
            customer=self.customer,
            service=self.service,
            message="I need a math tutor.",
        )

        another_provider = User.objects.create_user(
            email="anotherprovider@example.com",
            password="TestPassword123!",
            name="Another Provider",
            phone="9000000014",
        )

        ProviderProfile.objects.create(
            user=another_provider,
            description="Another tutoring provider",
            status=ProviderProfile.Status.APPROVED,
        )

        self.client.force_authenticate(user=another_provider)

        response = self.client.patch(
            reverse("booking-status", args=[booking.id]),
            {"status": Booking.Status.ACCEPTED},
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND,
        )

        booking.refresh_from_db()
        self.assertEqual(booking.status, Booking.Status.PENDING)
