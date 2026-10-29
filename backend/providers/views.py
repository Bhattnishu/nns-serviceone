from rest_framework import generics
from rest_framework.exceptions import NotFound, PermissionDenied
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated

from .models import ProviderProfile, Service
from .serializers import ProviderProfileSerializer, ServiceSerializer


def get_user_provider_profile(user):
    provider = getattr(user, "provider_profile", None)

    if provider is None:
        raise NotFound(
            "You need to create a provider profile first."
        )

    return provider


class ProviderProfileCreateView(generics.CreateAPIView):
    serializer_class = ProviderProfileSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class MyProviderProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProviderProfileSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_object(self):
        return get_user_provider_profile(self.request.user)


class ServiceCreateView(generics.CreateAPIView):
    serializer_class = ServiceSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        provider = get_user_provider_profile(self.request.user)

        if provider.status != ProviderProfile.Status.APPROVED:
            raise PermissionDenied(
                "Only approved providers can create services."
            )

        serializer.save(provider=provider)


class MyServicesListView(generics.ListAPIView):
    serializer_class = ServiceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        provider = get_user_provider_profile(self.request.user)
        return Service.objects.filter(provider=provider)


class MyServiceDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ServiceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        provider = get_user_provider_profile(self.request.user)
        return Service.objects.filter(provider=provider)

    def perform_update(self, serializer):
        serializer.save(status=Service.Status.PENDING)
