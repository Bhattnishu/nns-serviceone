from django.db import models


class Booking(models.Model):

    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        ACCEPTED = "ACCEPTED", "Accepted"
        REJECTED = "REJECTED", "Rejected"
        CANCELLED = "CANCELLED", "Cancelled"
        COMPLETED = "COMPLETED", "Completed"

    customer = models.ForeignKey(
        "accounts.User",
        on_delete=models.CASCADE,
        related_name="bookings"
    )

    service = models.ForeignKey(
        "providers.Service",
        on_delete=models.PROTECT,
        related_name="bookings"
    )

    message = models.TextField(blank=True)

    preferred_date = models.DateTimeField(
        null=True,
        blank=True
    )

    address = models.TextField(
        null=True,
        blank=True
    )

    latitude = models.DecimalField(
        max_digits=8,
        decimal_places=6,
        null=True,
        blank=True
    )

    longitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        null=True,
        blank=True
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
