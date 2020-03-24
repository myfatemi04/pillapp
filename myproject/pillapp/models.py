from django.db import models

# Create your models here.
from django.db import models

class Patient(models.Model):
    patient_id = models.IntegerField(primary_key=True)
    patient_firstname = models.CharField(max_length=255)
    patient_lastname = models.CharField(max_length=255)
    patient_email = models.CharField(max_length=255)
    password_hash = models.CharField(max_length=255)

class Pharmacy(models.Model):
    pharmacy_id = models.IntegerField(primary_key=True)
    pharmacy_name = models.CharField(max_length=255)
    access_code_hash = models.CharField(max_length=255)

    def __str__(self):
        return f"Pharmacy[{self.pharmacy_id}] \"{self.pharmacy_name}\""

class Order(models.Model):
    order_id = models.IntegerField(primary_key=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    pharmacy = models.ForeignKey(Pharmacy, on_delete=models.CASCADE)

    address = models.CharField(max_length=255)

    order_date = models.DateTimeField("order date")
    status = models.CharField(max_length=255)
    message = models.CharField(max_length=1023)

def verify_hash(hash, test):
    return hash == test

def verify_login(pharmacy_id, access_code):
    matching_ids = Pharmacy.objects.filter(pharmacy_id=pharmacy_id).values()
    if len(matching_ids) == 0:
        return False
    
    pharmacy = matching_ids[0]

    if verify_hash(pharmacy['access_code_hash'], access_code):
        return True
    else:
        return False

def get_orders(pharmacy_id):
    query_results = Order.objects.filter(pharmacy_id=pharmacy_id).order_by("-order_date")
    pharmacy_orders = list(query_results.values())
    for x in range(len(pharmacy_orders)):
        pharmacy_orders[x]['patient_email'] = query_results[x].patient.patient_email

    return pharmacy_orders

def get_patients(patient_id):
    patients = Patient.objects.filter(patient_id=patient_id).values("patient_id", "patient_firstname", "patient_lastname", "patient_email")
    return patients

