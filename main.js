// Formatear precio
const formatTotal = (price) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

// Formatear descripción
const formatDescription = (description) => {
  return description.length > 60
    ? `${description.slice(0, 60)}...`
    : description;
};

// Alertas
const showAlert = (title, text, icon, textButton = "Seguir comprando") => {
  return Swal.fire({
    position: "center",
    title,
    text,
    icon,
    confirmButtonColor: "#3085d6",
    confirmButtonText: textButton,
    allowOutsideClick: false,
  });
};

const showAlertHtml = (title, html, icon, textButton = "Entendido") => {
  return Swal.fire({
    position: "center",
    title,
    html,
    icon,
    confirmButtonColor: "#3085d6",
    confirmButtonText: textButton,
    allowOutsideClick: false,
  });
};

// Alerta de confirmación
const showAlertConfirm = (title, text, confirmButtonText = "Aceptar") => {
  return Swal.fire({
    position: "center",
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText,
    cancelButtonText: "Cancelar",
    allowOutsideClick: false,
  });
};

// Alerta cargando
const showAlertLoading = (title = "Procesando") => {
  let timerInterval;
  return Swal.fire({
    title,
    timer: 2000,
    timerProgressBar: true,
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
      const timer = Swal.getPopup().querySelector("b");
      timerInterval = setInterval(() => {
        timer.textContent = `${Swal.getTimerLeft()}`;
      }, 100);
    },
    willClose: () => {
      clearInterval(timerInterval);
    },
  });
};

// Validar tajea de crédito o débito
const validateCreditCard = (card) => {
  const creditCard = card.replace(/ /g, "");
  const regex =
    /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|6(?:011|5[0-9][0-9])[0-9]{12})$/;
  return regex.test(creditCard);
};
