from django.contrib import admin

# Register your models here.

from.models import User, Gear, Pack

class GearAdmin(admin.ModelAdmin):
    list_display = ("user", "category", "brand", "description", "weight", "worn", "consumable")

# Register your models here.
admin.site.register(User)
admin.site.register(Gear, GearAdmin)
admin.site.register(Pack)