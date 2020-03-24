from django.shortcuts import render, redirect
from django.http import JsonResponse

from pillapp.models import verify_login, get_orders, get_patients

# Create your views here.
def pharmacy_login(request):
    if request.method == 'GET':
        return render(request, "pharmacy_login.html")
    else:
        pharmacy_id_str = request.POST['pharmacy_id']

        if not pharmacy_id_str.isdigit():
            return render(request, "pharmacy_login.html", {"message": "Incorrect login"})
        
        pharmacy_id = int(pharmacy_id_str)
        access_code = request.POST['access_code']

        if verify_login(pharmacy_id, access_code):
            request.session['pharmacy_id'] = pharmacy_id
            return redirect("/pharmacy")
        else:
            return render(request, "pharmacy_login.html", {"message": "Incorrect login"})

def pharmacy_main(request):
    if 'pharmacy_id' not in request.session:
        return redirect("/pharmacy_login")
    else:
        return render(request, "pharmacy_main.html")

def pharmacy_logout(request):
    del request.session['pharmacy_id']
    return redirect("/")

def api_orders(request):
    if 'pharmacy_id' not in request.session:
        return JsonResponse({"status": "error", "error_message": "need_login"})
    
    pharmacy_id = request.session['pharmacy_id']
    orders = get_orders(pharmacy_id)
    return JsonResponse({"orders": orders})

def api_patient(request, patient_id):
    if 'pharmacy_id' not in request.session:
        return JsonResponse({"status": "error", "error_message": "need_login"})

    patients = get_patients(patient_id)
    if len(patients) == 0:
        return JsonResponse({"status": "error", "error_message": "patient_not_found"})
    else:
        return JsonResponse({"patient": patients[0]})
