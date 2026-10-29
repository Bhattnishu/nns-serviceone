from django.contrib import admin
from .models import ServiceCategory, ProviderProfile, Service


@admin.register(ServiceCategory)
class ServiceCategoryAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)


@admin.register(ProviderProfile)
class ProviderProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "experience_years", "status")
    list_filter = ("status",)
    search_fields = ("user__name", "user__email")
    list_editable = ("status",)


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = (
        "service_name",
        "provider",
        "category",
        "price",
        "status",
    )
    list_filter = ("status", "category")
    search_fields = (
        "service_name",
        "provider__user__name",
        "category__name",
    )
    list_editable = ("status",)
    list_select_related = ("provider", "category")
