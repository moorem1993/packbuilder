from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.

class User(AbstractUser):
    pass

class Gear(models.Model):

    GEAR_CATEGORY_CHOICES = [
        ('BG', 'Backpacking Gear'),
        ('BK', 'Backcountry Kitchen'),
        ('FW', 'Food and Water'),
        ('CFW', 'Clothing and Footwear'),
        ('NAV', 'Navigation'),
        ('EFA', 'Emergency and First Aid'),
        ('HH', 'Health and Hygiene'),
        ('TR', 'Tools and Repair Items'),
        ('XTRA', 'Backpacking Extras'),
        ('PI', 'Personal Items'),
    ]

    user = models.ForeignKey("User", on_delete=models.CASCADE)
    category = models.CharField("Category", max_length=64, choices=GEAR_CATEGORY_CHOICES)
    brand = models.CharField("Brand", max_length=128, blank=True)
    description = models.CharField("Description", max_length=128, blank=True)
    weight = models.FloatField("Weight", blank=True)
    worn = models.BooleanField("Worn")
    consumable = models.BooleanField("Consumable")

    def __str__(self):
        return self.description

class Pack(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE)
    name = models.CharField("Name", max_length=64, blank=True)
    days = models.IntegerField("Days", blank=True, default="0")
    nights = models.IntegerField("Nights", blank=True, default="0")
    miles = models.FloatField("Miles", blank=True, default="0")
    gear = models.ManyToManyField("Gear", related_name="gear", blank=True)

    def __str__(self):
        return self.name