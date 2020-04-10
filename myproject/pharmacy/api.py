from pillapp.models import get_orders, get_patients, Order, Patient, Pharmacy
from django.http import JsonResponse
from django.urls import path
from datetime import datetime

def set_order_status(request):
    if 'pharmacy_id' not in request.session:
        return JsonResponse({"status": "error", "error_message": "need_login"})
    
    pharmacy_id = request.session['pharmacy_id']

    if 'order_id' not in request.POST:
        return JsonResponse({"status": "error", "error_message": "specify_order_id"})
    
    if 'status' not in request.POST:
        return JsonResponse({"status": "error", "error_message": "specify_status"})

    order_id = request.POST['order_id']
    new_status = request.POST['status']
    
    query_results = Order.objects.filter(pharmacy_id=pharmacy_id, order_id=order_id)

    if not query_results:
        return JsonResponse({"status": "error", "error_message": "order_not_found"})

    order = query_results[0]
    order.status = new_status
    order.save()
    return JsonResponse({"status": "success"})

def get_orders_list(request):
    if 'pharmacy_id' not in request.session:
        return JsonResponse({"status": "error", "error_message": "need_login"})
    
    pharmacy_id = request.session['pharmacy_id']
    orders = get_orders(pharmacy_id)
    return JsonResponse({"status": "success", "orders": orders})

def get_patient(request):
    if 'pharmacy_id' not in request.session:
        return JsonResponse({"status": "error", "error_message": "need_login"})

    if 'patient_id' not in request.POST:
        return JsonResponse({"status": "error", "error_message": "specify_patient"})

    patients = get_patients(request.POST['patient_id'])
    if len(patients) == 0:
        return JsonResponse({"status": "error", "error_message": "patient_not_found"})
    else:
        return JsonResponse({"status": "success", "patient": patients[0]})

def get_orders_by_patient(request):
    if 'patient_email' not in request.session:
        return JsonResponse({"status": "error", "error_message": "need_login"})

    patient_email = request.session['patient_email']
    orders = Order.objects.filter(patient__patient_email=patient_email).order_by("-order_date")
    orders_values = orders.values("message", "status", "order_date")
    return JsonResponse({"status": "success", "orders": list(orders_values)})

def add_order(request):
    if 'patient_email' not in request.session:
        return JsonResponse({"status": "error", "error_message": "need_login"})
    
    patient_email = request.session['patient_email']
    this_patient = Patient.objects.filter(patient_email=patient_email)[0]
    pharmacy = Pharmacy.objects.filter(pharmacy_id=1)[0]
    address = request.POST['address']
    message = request.POST['message']
    new_order = Order(
        patient=this_patient,
        pharmacy=pharmacy,
        address=address,
        order_date=datetime.now(),
        status="pending",
        message=message
    )
    new_order.save()
    return JsonResponse({"status": "success"})
    

api_urls = [
    path('orders/list', get_orders_list),
    path('orders/set_status', set_order_status),
    path('orders/tracker', get_orders_by_patient),
    path('orders/request', add_order),
    path('patients', get_patient)
]