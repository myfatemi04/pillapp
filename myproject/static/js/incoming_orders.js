let STATUS_OPTIONS = [
    "pending",
    "shipping",
    "shipped"
];

/*
let socket;

function load_socket() {
    socket = new WebSocket(
        "ws://"
        + window.location.host
        + "/ws/pharmacy/orders"
    );

    socket.onmessage = function(e) {
        let orders = JSON.parse(e.data);
        add_orders(orders);
    };

    socket.onclose = function(e) {
        console.error("Socket closed");
    }
}
*/

function set_status(order_id, new_status) {
    $.post(
        "/api/orders/set_status",
        {
            "order_id": order_id,
            "status": new_status
        },
        function(data, status) {
            console.log("Data update status: " + status);
        }
    );
}

function request_orders() {
    $.getJSON("/api/orders/list", function(orders) {
        add_orders(orders);
    });
}

function create_row(order, table_body) {
    let row = table_body.insertRow(-1);
    let address_cell = row.insertCell(-1);
    let message_cell = row.insertCell(-1);
    let email_cell = row.insertCell(-1);
    address_cell.innerHTML = order.address;
    message_cell.innerHTML = order.message;
    email_cell.innerHTML = `<a href="mailto:${order.patient_email}">${order.patient_email}</a>`;

    let status_dropdown = document.createElement("select");
    for (let status_option of STATUS_OPTIONS) {
        let option = document.createElement("option");
        option.innerHTML = status_option;
        option.setAttribute("value", status_option)
        if (status_option == order.status) {
            option.setAttribute("selected", "1");
        }
        status_dropdown.appendChild(option);
    }
    
    let status_button = document.createElement("button");
    status_dropdown.id = `option_${order.order_id}_status`;
    status_button.id = `button_${order.order_id}_status`;
    status_button.innerHTML = 'Update status';
    status_button.setAttribute("class", "btn btn-light");

    let status_cell = row.insertCell(-1);
    let button_cell = row.insertCell(-1);

    status_cell.innerHTML = status_dropdown.outerHTML;
    button_cell.innerHTML = status_button.outerHTML;

    $(`#button_${order.order_id}_status`).click(
        function() {
            set_status(order.order_id, $(`#option_${order.order_id}_status`)[0].value);
        }
    );


}

function add_orders(orders) {
    let table_body = $("#table-body")[0];
    for (let order of orders.orders) {
        create_row(order, table_body);
    }
}

function remove_old_orders() {
    let table_body = $("#table-body")[0];
    table_body.innerHTML = '';
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
    request_orders();
    init_ajax_csrf();
    $("#refresh-orders").click(
        function() {
            remove_old_orders();
            request_orders();
        }
    );
    setInterval(function() {
        remove_old_orders();
        request_orders();
    }, 60000);
}
