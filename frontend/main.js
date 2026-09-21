const API = "http://localhost:3001/api/products";

function formatPrice(price) {
  return `KSh${Number(price).toLocaleString()}.00`;
}

function productCard(product) {
  const soldOut = product.stock <= 0;
  return `
    <div>
      <img src="${product.image}" alt="${product.name}" class="w-full h-64 object-cover mb-3">
      <p class="text-sm font-medium">${product.name}</p>
      <p class="text-xs text-gray-500 mb-1">${product.series} Series</p>
      <p class="text-sm font-medium mt-2 mb-3">${formatPrice(product.price)}</p>
      <button class="w-full border border-gray-300 py-2 text-sm" disabled="${soldOut}">
        ${soldOut ? "Sold out" : "Add to cart"}
      </button>
    </div>
  `;
}

async function loadProducts() {
  const featured = document.querySelector("#featured-grid");
  const all = document.querySelector("#product-grid");
  const status = document.querySelector("[data-product-status]");

  if (!featured && !all) return;

  try {
    const response = await fetch(API);
    if (!response.ok) throw new Error("Could not load products");
    const products = await response.json();

    if (featured) {
      featured.innerHTML = products
        .filter((p) => p.featured)
        .map(productCard)
        .join("");
    }
    if (all) {
      all.innerHTML = products.map(productCard).join("");
    }
    if (status) status.textContent = `Showing ${products.length} locks`;
  } catch (error) {
    console.error(error);
    if (status) {
      status.textContent =
        "Could not load products. Start the API: node server.js";
    }
  }
}

loadProducts();