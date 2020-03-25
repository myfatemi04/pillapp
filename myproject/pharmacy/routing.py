from .pharmacyconsumer import PharmacyConsumer
from django.urls import path

websocket_urlpatterns = [
    path('ws/pharmacy/orders', PharmacyConsumer)
]
