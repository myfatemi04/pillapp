function request_orders() {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let orders = JSON.parse(this.responseText);
            display_orders(orders);
        }
    };
    xhr.open("GET", "/api_orders");
    xhr.send()
}

function display_orders(orders) {
    let table_body = $("#table-body")[0];
    table_body.innerHTML = "";
    for (let order of orders.orders) {
        let row = table_body.insertRow(-1);
        let address_cell = row.insertCell(-1);
        let message_cell = row.insertCell(-1);
        let email_cell = row.insertCell(-1);
        let status_cell = row.insertCell(-1);
        address_cell.innerHTML = order.address;
        message_cell.innerHTML = order.message;
        email_cell.innerHTML = order.patient_email;
        status_cell.innerHTML = order.status;
    }
}

function start_requesting_orders() {
    setInterval(request_orders, 1000);
}
