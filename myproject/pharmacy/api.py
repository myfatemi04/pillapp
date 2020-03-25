from pillapp.models import get_orders, get_patients, Order
from django.http import JsonResponse
from django.urls import path

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

api_urls = [
    path('orders/list', get_orders_list),
    path('orders/set_status', set_order_status),
    path('patients', get_patient)
]