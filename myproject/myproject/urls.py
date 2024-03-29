"""myproject URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

from pharmacy.views import pharmacy_login, pharmacy_main, pharmacy_logout
from patient.views import patient_login, patient_main, patient_logout, patient_register
from pharmacy.api import api_urls
from pillapp.views import main_page

urlpatterns = [
    path('admin/', admin.site.urls),

    path('pharmacy', pharmacy_main),
    path('pharmacy_login', pharmacy_login),
    path('pharmacy_logout', pharmacy_logout),

    path('patient', patient_main),
    path('patient_login', patient_login),
    path('patient_logout', patient_logout),
    path('patient_register', patient_register),

    path('api/', include(api_urls)),
    
    path('', main_page)
]
