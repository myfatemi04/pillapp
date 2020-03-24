from django.db import models

class Patient(models.Model):
    patient_id = models.IntegerField()
    patient_firstname = models.CharField(max_length=255)
    patient_lastname = models.CharField(max_length=255)
    patient_email = models.CharField(max_length=255)
    password_hash = models.CharField(max_length=255)

class Pharmacy(models.Model):
    pharmacy_id = models.IntegerField(primary_key=True)
    pharmacy_name = models.CharField(max_length=255)
    access_code_hash = models.CharField(max_length=255)

class Order(models.Model):
    order_id = models.IntegerField(primary_key=True)
    patient_id = models.ForeignKey(Patient, on_delete=models.CASCADE)
    pharmacy_id = models.ForeignKey(Pharmacy, on_delete=models.CASCADE)
    order_date = models.DateTimeField("order date")
    status = models.CharField(max_length=255)
    message = models.CharField(max_length=1023)

