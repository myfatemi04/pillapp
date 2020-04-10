from django.shortcuts import render, redirect
from django.http import JsonResponse

from pillapp.models import Patient
import django.contrib.auth.hashers

# Create your views here.
def patient_login(request):
    if request.method == 'GET':
        return render(request, "patient_login.html")
    elif request.method == 'POST':
        if 'patient_email' not in request.POST or 'patient_password' not in request.POST:
            return render(request, "patient_login.html", {"message": "Please fill out all fields"})
        
        patient_email = request.POST['patient_email']
        patient_pass = request.POST['patient_password']

        patients = Patient.objects.filter(patient_email=patient_email)
        if not patients:
            return render(request, "patient_login.html", {"message": "Username or password incorrect"})

        patient = patients[0]

        if not django.contrib.auth.hashers.check_password(patient_pass, patient.password_hash):
            return render(request, "patient_login.html", {"message": "Username or password incorrect"})

        request.session['patient_email'] = patient_email

        return redirect("/patient")

def patient_main(request):
    if 'patient_email' not in request.session:
        return redirect("/patient_login")

    return render(request, "patient_main.html")

def patient_logout(request):
    del request.session['patient_email']
    return redirect("/")

def patient_register(request):
    if request.method == 'GET':
        return render(request, "patient_register.html")
    else:
        fields = [
            'patient_email',
            'patient_firstname',
            'patient_lastname',
            'patient_password'
        ]
        for field in fields:
            if field not in request.POST:
                return render(request, "patient_register.html", {"message": "Please fill out all required fields"})
        
        patient_email = request.POST['patient_email']
        patient_firstname = request.POST['patient_firstname']
        patient_lastname = request.POST['patient_lastname']
        patient_password = request.POST['patient_password']
        hashed_password = django.contrib.auth.hashers.make_password(patient_password)

        patients = Patient.objects.filter(patient_email=patient_email)
        if patients:
            return render(request, "patient_register.html", {"message": "This email has already been used by another user"})

        new_patient = Patient(
            patient_email=patient_email,
            patient_firstname=patient_firstname,
            patient_lastname=patient_lastname,
            password_hash=hashed_password
        )

        new_patient.save()
        request.session['patient_email'] = patient_email
        return redirect("/patient")
