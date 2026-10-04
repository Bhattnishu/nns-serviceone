from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from .models import ProviderProfile, Service
from .serializers import ProviderProfileSerializer, ServiceSerializer

from .models import ProviderProfile
from .serializers import ProviderProfileSerializer


class ProviderProfileCreateView(generics.CreateAPIView):
    serializer_class = ProviderProfileSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class MyProviderProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProviderProfileSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_object(self):
        return self.request.user.provider_profile


class ServiceCreateView(generics.CreateAPIView):
    serializer_class = ServiceSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        provider = self.request.user.provider_profile

        if provider.status != ProviderProfile.Status.APPROVED:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied(
                "Only approved providers can create services."
            )

        serializer.save(provider=provider)


class MyServicesListView(generics.ListAPIView):
    serializer_class = ServiceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        provider = self.request.user.provider_profile
        return Service.objects.filter(provider=provider)


class MyServiceDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ServiceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        provider = self.request.user.provider_profile
        return Service.objects.filter(provider=provider)
