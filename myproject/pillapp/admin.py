from django.contrib import admin

from .models import Patient, Pharmacy, Order
# Register your models here.
admin.site.register(Patient)
admin.site.register(Pharmacy)
admin.site.register(Order)