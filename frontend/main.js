const API = "http://localhost:3001/api/products";

let allProducts = [];

function formatPrice(price) {
  return "KSh" + Number(price).toLocaleString() + ".00";
}

function productCard(product) {
  const soldOut = product.stock <= 0;
  return `
    <div>
      <img src="${product.image}" alt="${product.name}" class="w-full h-64 object-cover mb-3">
      <p class="text-sm font-medium">${product.name}</p>
      <p class="text-xs text-gray-500 mb-1">${product.series} Series</p>
      <p class="text-sm font-medium mt-2 mb-3">${formatPrice(product.price)}</p>
      <button class="w-full border border-gray-300 py-2 text-sm" ${soldOut ? "disabled" : ""}>
        ${soldOut ? "Sold out" : "Add to cart"}
      </button>
    </div>
  `;
}

function showProducts() {
  const featured = document.querySelector("#featured-grid");
  const all = document.querySelector("#product-grid");
  const status = document.querySelector("[data-product-status]");

  if (featured) {
    const list = allProducts.filter(function (p) {
      return p.featured;
    });
    featured.innerHTML = list.map(productCard).join("");
  }

  if (!all) return;

  const search = document.querySelector("#search-input");
  const series = document.querySelector("#series-select");
  const sort = document.querySelector("#sort-select");
  const inStock = document.querySelector("#in-stock-only");

  const searchText = search ? search.value.toLowerCase() : "";
  const seriesValue = series ? series.value : "all";
  const sortValue = sort ? sort.value : "default";
  const stockOnly = inStock ? inStock.checked : false;

  let list = allProducts.filter(function (p) {
    const text = (p.name + " " + p.sku).toLowerCase();
    const okSearch = text.indexOf(searchText) !== -1;
    const okSeries = seriesValue === "all" || p.series === seriesValue;
    const okStock = !stockOnly || p.stock > 0;
    return okSearch && okSeries && okStock;
  });

  if (sortValue === "price-asc") {
    list.sort(function (a, b) {
      return a.price - b.price;
    });
  }
  if (sortValue === "price-desc") {
    list.sort(function (a, b) {
      return b.price - a.price;
    });
  }
  if (sortValue === "name-asc") {
    list.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });
  }

  if (list.length === 0) {
    all.innerHTML = "<p>No products match your filters.</p>";
  } else {
    all.innerHTML = list.map(productCard).join("");
  }

  if (status) {
    status.textContent = "Showing " + list.length + " of " + allProducts.length + " locks";
  }
}

async function loadProducts() {
  const status = document.querySelector("[data-product-status]");
  try {
    const response = await fetch(API);
    if (!response.ok) throw new Error("Could not load products");
    allProducts = await response.json();
    showProducts();
  } catch (error) {
    console.error(error);
    if (status) {
      status.textContent = "Could not load products. Start the API: node server.js";
    }
  }
}

const search = document.querySelector("#search-input");
const series = document.querySelector("#series-select");
const sort = document.querySelector("#sort-select");
const inStock = document.querySelector("#in-stock-only");

if (search) search.addEventListener("input", showProducts);
if (series) series.addEventListener("change", showProducts);
if (sort) sort.addEventListener("change", showProducts);
if (inStock) inStock.addEventListener("change", showProducts);

// dark & light theme functionality
function setTheme(name) {
  if (name === "dark") {
    document.body.classList.add("dark-theme");
  } else {
    document.body.classList.remove("dark-theme");
  }
  localStorage.setItem("theme", name);
}

const lightBtn = document.querySelector("#light-btn");
const darkBtn = document.querySelector("#dark-btn");

if (lightBtn) {
  lightBtn.addEventListener("click", function () {
    setTheme("light");
  });
}

if (darkBtn) {
  darkBtn.addEventListener("click", function () {
    setTheme("dark");
  });
}

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  setTheme("dark");
}

loadProducts();