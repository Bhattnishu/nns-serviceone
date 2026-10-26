from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import get_user_model

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["name", "email", "phone", "password"]

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class LoginSerializer(serializers.Serializer):
    identifier = serializers.CharField()
    password = serializers.CharField(
        write_only=True,
        trim_whitespace=False
    )

    def validate(self, attrs):
        identifier = attrs.get("identifier", "").strip()
        password = attrs.get("password")

        # Find the user by email first.
        user = User.objects.filter(email__iexact=identifier).first()

        # If no email matches, try the phone number.
        if user is None:
            user = User.objects.filter(phone=identifier).first()

        # Reject invalid credentials.
        if user is None or not user.check_password(password):
            raise AuthenticationFailed(
                "Invalid email/phone or password."
            )

        # Reject inactive accounts.
        if not user.is_active:
            raise AuthenticationFailed("This account is inactive.")

        # Generate JWT tokens.
        refresh = RefreshToken.for_user(user)

        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }

class ProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "name",
            "email",
            "phone",
            "address",
            "area",
            "city",
            "state",
            "pincode",
        ]

    def validate_email(self, value):
        # Prevent another account from using this email.
        queryset = User.objects.filter(email__iexact=value).exclude(
            pk=self.instance.pk
        )
        if queryset.exists():
            raise serializers.ValidationError(
                "This email address is already in use."
            )
        return value

    def validate_phone(self, value):
        # Prevent another account from using this phone number.
        queryset = User.objects.filter(phone=value).exclude(
            pk=self.instance.pk
        )
        if queryset.exists():
            raise serializers.ValidationError(
                "This phone number is already in use."
            )
        return value
