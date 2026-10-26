from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import User
from .serializers import RegisterSerializer


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "id": request.user.id,
            "name": request.user.name,
            "email": request.user.email,
            "phone": request.user.phone,

            "address": request.user.address,
            "area": request.user.area,
            "city": request.user.city,
            "state": request.user.state,
            "pincode": request.user.pincode,
        })
