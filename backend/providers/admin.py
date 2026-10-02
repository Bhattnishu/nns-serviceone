from django.contrib import admin
from .models import ServiceCategory, ProviderProfile, Service

admin.site.register(ServiceCategory)


@admin.register(ProviderProfile)
class ProviderProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "category", "experience_years", "status")


admin.site.register(Service)
