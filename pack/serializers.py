from rest_framework import serializers
from .models import Gear, Pack

class GearSerializer(serializers.ModelSerializer):

    class Meta:
        model = Gear
        fields = ('id', 'user', 'category', 'brand', 'description', 'weight', 'worn', 'consumable')

class PackSerializer(serializers.ModelSerializer):

    class Meta:
        model = Pack
        fields = ('id', 'user', 'name', 'days', 'nights', 'miles', 'gear')

