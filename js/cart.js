document.addEventListener("DOMContentLoaded", () => {
  // Implementando mascaras para los campos del formulario
  importMasks();
  // Elementos del carrito de compras
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const containerCart = document.getElementById("container-cart");

  if (containerCart) {
    printCart(cart, containerCart);
  }

  // Evento click para eliminar productos del carrito
  const btnDeleteProduct = document.querySelectorAll("#btn-delete-product");
  if (btnDeleteProduct) {
    btnDeleteProduct.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = e.target.getAttribute("data-id");
        deleteProduct(id);
      });
    });
  }

  // Agregar validación al formulario de pago
  const checkoutButton = document.querySelector(".btn-info");
  if (checkoutButton) {
    checkoutButton.addEventListener("click", (e) => {
      e.preventDefault(); // Prevenir que el formulario se envíe automáticamente
      validatePaymentForm();
    });
  }
});

// Validar formulario de pago
const validatePaymentForm = () => {
  const cardholderName = document.getElementById("cardholderName").value.trim();
  const cardNumber = document.getElementById("cardNumber").value.trim();
  const expiration = document.getElementById("expiration").value.trim();
  const cvv = document.getElementById("cvv").value.trim();
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length == 0) {
    showAlert(
      "Información",
      "No hay productos en el carrito",
      "info",
      "Entendido"
    );
    return;
  }

  let isValid = true;
  let errors = [];
  let html = "";

  if (!cardholderName) {
    isValid = false;
    errors.push("El nombre del titular es obligatorio.");
  }

  if (!cardNumber) {
    isValid = false;
    errors.push("El número de tarjeta es obligatorio.");
  } else if (!validateCreditCard(cardNumber)) {
    isValid = false;
    errors.push("El número de tarjeta no es válido.");
  }

  if (!expiration) {
    isValid = false;
    errors.push("La fecha de vencimiento es obligatoria.");
  } else if (!/^\d{2}\/\d{2}$/.test(expiration)) {
    isValid = false;
    errors.push("La fecha de vencimiento no es válida.");
  }

  if (!cvv) {
    isValid = false;
    errors.push("El CVV es obligatorio.");
  } else if (!/^\d{3}$/.test(cvv)) {
    isValid = false;
    errors.push("El CVV no es válido.");
  }

  console.log(cvv);

  if (!isValid) {
    // Usar SweetAlert para mostrar el mensaje de error
    errors.forEach((error) => {
      html += `<p>${error}</p>`;
    });

    showAlertHtml("Error", html, "error");
  } else {
    // Usar SweetAlert para confirmar el procesamiento del pago
    showAlertLoading().then(() => {
      // Redirigir a invoice.html después de que se haya confirmado el formulario
      showAlert(
        "¡Éxito!",
        "Pago procesado correctamente",
        "success",
        "Ir a la factura"
      ).then(() => {
        window.location.href = "invoice.html";
      });
    });
  }
};

// Agregar productos al carrito
const addProduct = (id) => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const products = JSON.parse(localStorage.getItem("products"));

  const filteredProduct = products.find((product) => product.id == id);

  const newProducts = products.map((product) =>
    product.id == id ? { ...product, stock: product.stock - 1 } : product
  );
  localStorage.setItem("products", JSON.stringify(newProducts));

  const newCart = cart.find((product) => product.id == id)
    ? cart.map((product) =>
        product.id == id
          ? { ...product, quantity: product.quantity + 1 }
          : product
      )
    : [
        ...cart,
        {
          id: filteredProduct.id,
          title: filteredProduct.title,
          price: filteredProduct.price,
          description: filteredProduct.description,
          images: filteredProduct.images,
          quantity: 1,
        },
      ];
  localStorage.setItem("cart", JSON.stringify(newCart));

  showAlert("¡Éxito!", "Producto agregado al carrito", "success").then(() => {
    setTimeout(() => {
      window.location.reload();
    }, 500);
  });
};

// Eliminar productos del carrito
const deleteProduct = (id) => {
  const cart = JSON.parse(localStorage.getItem("cart"));
  const products = JSON.parse(localStorage.getItem("products"));

  showAlertConfirm(
    "¿Está seguro/a del eliminar el producto?",
    "No podrás deshacer esta acción",
    "Eliminar"
  ).then((result) => {
    if (result.isConfirmed) {
      const newProducts = products.map((product) =>
        product.id == id
          ? {
              ...product,
              stock: product.stock + cart.find((p) => p.id == id).quantity,
            }
          : product
      );

      const newCart = cart.filter((product) => product.id != id);

      localStorage.setItem("products", JSON.stringify(newProducts));
      localStorage.setItem("cart", JSON.stringify(newCart));

      showAlert(
        "¡Éxito!",
        "Producto eliminado del carrito",
        "success",
        "Continuar en el carrito"
      ).then(() => {
        setTimeout(() => {
          window.location.reload();
        }, 500);
      });
    }
  });
};

// Vaciar carrito
const clearCart = () => {
  const cart = JSON.parse(localStorage.getItem("cart"));
  const products = JSON.parse(localStorage.getItem("products"));

  const newProducts = products.map((product) =>
    cart.find((p) => p.id == product.id)
      ? {
          ...product,
          stock: product.stock + cart.find((p) => p.id == product.id).quantity,
        }
      : product
  );

  localStorage.setItem("products", JSON.stringify(newProducts));
  localStorage.setItem("cart", JSON.stringify([]));

  showAlert(
    "¡Éxito!",
    "Carrito vaciado correctamente",
    "success",
    "Continuar comprando"
  ).then(() => {
    setTimeout(() => {
      window.location.reload();
    }, 500);
  });
};

// Imprimir productos en el carrito
printCart = (cart, container) => {
  const quantityItems = document.getElementById("quantity-items");
  const subtotalElement = document.getElementById("subtotal");
  const totalElement = document.getElementById("total");
  const shippingCost = 20.0; // Costo de envío fijo

  if (cart.length > 0) {
    const totalItems = cart.reduce((acc, product) => acc + product.quantity, 0);
    quantityItems.innerHTML = `Tienes ${totalItems} item${
      totalItems > 1 ? "s" : ""
    } en tu carrito`;

    // Calcular subtotal
    const subtotal = cart.reduce(
      (acc, product) => acc + product.price * product.quantity,
      0
    );
    subtotalElement.innerText = `$${subtotal.toFixed(2)}`;

    // Calcular total (subtotal + envío)
    const total = subtotal + shippingCost;
    totalElement.innerText = `$${total.toFixed(2)}`;
  } else {
    quantityItems.innerHTML = "Tu carrito está vacío";
    subtotalElement.innerText = `$0.00`;
    totalElement.innerText = `$${shippingCost.toFixed(2)}`;
  }

  let cardItem = "";
  container.innerHTML = "";
  cart.forEach((product) => {
    cardItem += `<div class="d-flex align-items-center border-bottom py-3">
      <img src="${product.images[0]}" width="50" alt="${
      product.title
    }" class="rounded">
      <div class="flex-grow-1 ms-3">
        <h6 class="mb-0">${product.title}</h6>
        <small class="text-muted">${formatDescription(
          product.description
        )}</small>
      </div>
      <div class="text-center" style="width: 50px;">
        <span>${product.quantity}</span>
      </div>
      <div class="text-end" style="width: 100px;">
        <span>${formatTotal(product.price * product.quantity)}</span>
      </div>
      <i data-id="${
        product.id
      }" id="btn-delete-product" class="bi bi-trash text-danger ms-3" style="cursor: pointer;"></i>
    </div>`;
  });
  container.innerHTML = cardItem;
};

// Implementar mascaras para los campos del formulario
const importMasks = () => {
  const cardNumber = document.getElementById("cardNumber");
  const expiration = document.getElementById("expiration");
  const cvv = document.getElementById("cvv");

  if (!cardNumber || !expiration || !cvv) return;

  // Máscara para el número de tarjeta
  IMask(cardNumber, {
    mask: "0000 0000 0000 0000",
    lazy: false,
    placeholderChar: "#",
    autofix: true,
  });

  // Máscara para la fecha de vencimiento
  IMask(expiration, {
    mask: "MM/YY",
    lazy: false,
    autofix: true,
    blocks: {
      MM: {
        mask: IMask.MaskedRange,
        placeholderChar: "M",
        from: 1,
        to: 12,
        maxLength: 2,
      },
      YY: {
        mask: IMask.MaskedRange,
        placeholderChar: "Y",
        from: new Date().getFullYear() % 100,
        to: 99,
        maxLength: 2,
      },
    },
  });

  // Máscara para el CVV
  IMask(cvv, {
    mask: "000",
    definitions: {
      0: /[0-9]/,
    },
    lazy: false,
    placeholderChar: "#",
  });
};
