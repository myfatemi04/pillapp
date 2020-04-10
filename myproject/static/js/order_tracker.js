let STATUS_TEXTS = {
    "pending": "<b class='text-secondary'>Pending</b>",
    "spam": "<b class='text-danger'>Marked as spam</b>",
    "approved": "<b class='text-warning'>Approved</b>",
    "shipping": "<b class='text-info'>Shipping</b>",
    "shipped": "<b class='text-success'>Shipped!</b>"
};

function remove_old_orders() {
    $("#order-tracker")[0].innerHTML = '';
}

function request_new_orders() {
    $.getJSON(
        "/api/orders/tracker",
        function(orders) {
            if (orders['status'] == 'success')
                add_orders(orders['orders']);
        }
    );
}

function add_row(order, table_body) {
    let row = table_body.insertRow(-1);
    let message_cell = row.insertCell(-1);
    let status_cell = row.insertCell(-1);
    message_cell.innerHTML = order.message;
    status_cell.innerHTML = STATUS_TEXTS[order.status];
}

function add_orders(orders) {
    let table_body = $("#order-tracker")[0];
    for (let order of orders) {
        add_row(order, table_body);
    }
}

function request_delivery() {
    let message = $("#message")[0].value;
    let address = $("#address")[0].value;
    $.post(
        "/api/orders/request",
        {
            "message": message,
            "address": address
        },
        function(data, status) {

        }
    )
}

function getCookie(c_name)
{
    if (document.cookie.length > 0)
    {
        let c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1)
        {
            c_start = c_start + c_name.length + 1;
            let c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) c_end = document.cookie.length;
            return unescape(document.cookie.substring(c_start,c_end));
        }
    }
    return "";
 }

function init_ajax_csrf() {
    $(function () {
        $.ajaxSetup({
            headers: { "X-CSRFToken": getCookie("csrftoken") }
        });
    });
}

function init() {
    remove_old_orders();
    request_new_orders();
    init_ajax_csrf();
    $("#request-delivery").click(
        function() {
            request_delivery();
        }
    );
    $("#refresh-orders").click(
        function() {
            remove_old_orders();
            request_new_orders();
        }
    );
    setInterval(function() {
        $("#refresh-orders").click();
    },
    60000);
}