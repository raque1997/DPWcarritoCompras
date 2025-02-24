document.addEventListener("DOMContentLoaded", () => {
    // Obtener la información del carrito desde el localStorage
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const shippingCost = 20.00; // Costo de envío fijo
    const taxRate = 0.13; // 13% de IVA

    // Obtener los elementos del DOM
    const invoiceDate = document.getElementById("invoice-date");
    const orderNumber = document.getElementById("order-number");
    const paymentMethod = document.getElementById("payment-method");
    const productTable = document.getElementById("product-table");
    const subtotalElement = document.getElementById("subtotal");
    const shippingElement = document.getElementById("shipping");
    const taxElement = document.getElementById("tax");
    const totalElement = document.getElementById("total");

    // Generar una fecha de compra actual y un número de orden aleatorio
    const date = new Date().toLocaleDateString();
    const orderNum = `MT${Math.floor(Math.random() * 100000000)}`;

    // Asignar valores a los campos
    invoiceDate.textContent = date;
    orderNumber.textContent = orderNum;
    paymentMethod.innerHTML = '<img src="https://img.icons8.com/color/48/000000/mastercard.png" width="20" />'; // Puedes ajustar el método de pago según sea necesario

    // Calcular subtotal, IVA y total
    let subtotal = 0;
    let tax = 0;

    // Agregar productos a la tabla
    cart.forEach(product => {
        const totalPrice = product.price * product.quantity;
        subtotal += totalPrice;

        // Crear fila de producto
        const row = document.createElement("tr");
        row.innerHTML = `
            <td width="20%"><img src="${product.images[0]}" width="90"></td>
            <td width="60%">
                <span class="font-weight-bold">${product.title}</span>
                <div class="product-qty">
                    <span class="d-block">Cantidad: ${product.quantity}</span>
                </div>
            </td>
            <td width="20%">
                <div class="text-right">
                    <span class="font-weight-bold">$${totalPrice.toFixed(2)}</span>
                </div>
            </td>
        `;
        productTable.appendChild(row);
    });

    tax = subtotal * taxRate;
    const total = subtotal + shippingCost + tax;

    // Asignar valores a los elementos de totales
    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    shippingElement.textContent = `$${shippingCost.toFixed(2)}`;
    taxElement.textContent = `$${tax.toFixed(2)}`;
    totalElement.textContent = `$${total.toFixed(2)}`;


    const resetCartLink = document.getElementById("reset-cart");

    if (resetCartLink) {
        resetCartLink.addEventListener("click", () => {
            // Borra el carrito del localStorage
            localStorage.removeItem("cart");
        });
    }

});
