from django.db import models

# Create your models here.
class Restaurant(models.Model):

    name = models.CharField(max_length=150)
    description = models.TextField(blank=True)

    logo = models.ImageField(upload_to="restaurant/", blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    address = models.TextField(blank=True)
    website = models.URLField(blank=True)
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    class Meta:
        verbose_name = "Restaurant"
        verbose_name_plural = "Restaurants"

    def __str__(self):
        return self.name


class OperatingHours(models.Model):

    DAYS = [
        (0, "Monday"),
        (1, "Tuesday"),
        (2, "Wednesday"),
        (3, "Thursday"),
        (4, "Friday"),
        (5, "Saturday"),
        (6, "Sunday"),
    ]

    day = models.PositiveSmallIntegerField(choices=DAYS, unique=True)
    opening_time = models.TimeField(null=True, blank=True)

    closing_time = models.TimeField(null=True, blank=True)
    is_closed = models.BooleanField(default=False)

    class Meta:
        ordering = ["day"]
        verbose_name_plural = "Operating hours"

    def __str__(self):
        return self.get_day_display()


class RestaurantSettings(models.Model):

    restaurant = models.OneToOneField(Restaurant, on_delete=models.CASCADE, related_name="settings")
    currency = models.CharField(max_length=10, default="NPR")
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    service_charge_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    qr_ordering_enabled = models.BooleanField(default=True)
    minimum_order_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Restaurant Setting"
        verbose_name_plural = "Restaurant Settings"

    def __str__(self):
        return f"Settings - {self.restaurant.name}"
