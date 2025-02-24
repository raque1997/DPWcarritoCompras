document.addEventListener("DOMContentLoaded", async () => {
  const productsContainer = document.getElementById("products-container");

  if (productsContainer) {
    const products = await getProducts();
    localStorage.setItem("products", JSON.stringify(products));
    printProducts(products, productsContainer);
  }

  const btnAddProduct = document.querySelectorAll("#btn-add-product");

  if (btnAddProduct) {
    btnAddProduct.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = e.target.getAttribute("data-id");
        addProduct(id);
      });
    });
  }
});

// Fetch de API de productos
const getProducts = async () => {
  try {
    let products = localStorage.getItem("products") || [];
    let data = [];

    if (products.length === 0) {
      const response = await fetch("https://api.escuelajs.co/api/v1/products");
      data = await response.json();
      products = data.slice(1, 21).map((product) => {
        return {
          ...product,
          stock: Math.floor(Math.random() * 10),
        };
      });
    } else {
      products = JSON.parse(products);
    }

    return products;
  } catch (error) {
    console.log("Error fetching the products:", error);
  }
};

// Imprimir productos
printProducts = (products, container) => {
  let productCard = "";
  container.innerHTML = "";
  products.forEach((product) => {
    productCard += `
    <div class="col-md-4">
      <div class="card mb-4 shadow-sm">
        <img src="${product.images[0]}" class="card-img-top" alt="${
      product.title
    }">
        <div class="card-body">
            <h5 class="card-title">${product.title}</h5>
            <p class="card-text">${product.description}</p>
            <p class="card-text"><strong>$${product.price}</strong></p>
            <p class="card-text"><strong>Disponible: </strong>${
              product.stock
            }</p>
            <div class="d-flex justify-content-between align-items-center">
              <button type="button" ${
                product.stock === 0 ? "disabled" : ""
              } class="btn btn-sm btn-outline-secondary" data-id="${
      product.id
    }" id="btn-add-product">
                Agregar al carrito
              </button>
            </div>
        </div>
      </div>
    </div>`;
  });
  container.innerHTML = productCard;
};
