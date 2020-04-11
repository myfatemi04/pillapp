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
            add_orders(orders);
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
    let pharmacy = $("#pharmacy")[0].value;
    $.post(
        "/api/orders/request",
        {
            "message": message,
            "address": address,
            "pharmacy": pharmacy
        },
        function(data, status) {
            $("#message")[0].value = "";
            $("#address")[0].value = "";
            $("#pharmacy").val("");
            $("#send-status")[0].innerHTML = data;
            setTimeout(() => { $("#send-status")[0].innerHTML = ""; }, 10000);
            remove_old_orders();
            request_new_orders();
        }
    )
}

function init() {
    remove_old_orders();
    request_new_orders();
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