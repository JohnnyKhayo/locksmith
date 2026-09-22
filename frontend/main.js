const API = "http://localhost:3001/api/products";

let allProducts = [];

function formatPrice(price) {
  return "KSh" + Number(price).toLocaleString() + ".00";
}
// Build the HTML for one product card

function productCard(product) {
  const soldOut = product.stock <= 0;
  return `
    <div>
      <a href="product.html?id=${product.id}">
        <img src="${product.image}" alt="${product.name}" class="w-full h-64 object-cover mb-3 rounded-lg">
        <p class="text-sm font-medium">${product.name}</p>
      </a>
      <p class="text-xs text-gray-500 mb-1">${product.series} Series</p>
      <p class="text-sm font-medium mt-2 mb-3">${formatPrice(product.price)}</p>
      <button
        type="button"
        class="add-cart-btn w-full border border-gray-300 py-2 text-sm rounded-lg"
        data-id="${product.id}"
        ${soldOut ? "disabled" : ""}
      >
        ${soldOut ? "Sold out" : "Add to cart"}
      </button>
    </div>
  `;
}
// Draw products on the page
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

    // Read filter controls
  const search = document.querySelector("#search-input");
  const series = document.querySelector("#series-select");
  const sort = document.querySelector("#sort-select");
  const inStock = document.querySelector("#in-stock-only");

  const searchText = search ? search.value.toLowerCase() : "";
  const seriesValue = series ? series.value : "all";
  const sortValue = sort ? sort.value : "default";
  const stockOnly = inStock ? inStock.checked : false;

    // Keep products that match search, series, and stock

  let list = allProducts.filter(function (p) {
    const text = (p.name + " " + p.sku).toLowerCase();
    const okSearch = text.indexOf(searchText) !== -1;
    const okSeries = seriesValue === "all" || p.series === seriesValue;
    const okStock = !stockOnly || p.stock > 0;
    return okSearch && okSeries && okStock;
  });

    // Sort the list if the user picked a sort option

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

  // Put cards on the page, or a short message if nothing matches

  if (list.length === 0) {
    all.innerHTML = "<p>No products match your filters.</p>";
  } else {
    all.innerHTML = list.map(productCard).join("");
  }

  if (status) {
    status.textContent = "Showing " + list.length + " of " + allProducts.length + " locks";
  }
}

// Get products from the API, then draw them
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

// When the user types or changes a filter, draw the list again
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

// country/region dropdown
const countrySelect = document.querySelector("#country-select");

if (countrySelect) {
  const savedCountry = localStorage.getItem("country");
  if (savedCountry) {
    countrySelect.value = savedCountry;
  }

  countrySelect.addEventListener("change", function () {
    localStorage.setItem("country", countrySelect.value);
  });
}

// open hours functionality
function showOpenHours() {
  const status = document.querySelector("#open-status");
  if (!status) return;

  const now = new Date();
  const eatHour = now.getUTCHours() + 3;
  const day = now.getUTCDay();

  const isWeekday = day >= 1 && day <= 6;
  const isOpenHour = eatHour >= 7 && eatHour < 18;

  if (isWeekday && isOpenHour) {
    status.textContent = "Open now";
  } else {
    status.textContent = "Closed, we reply next business day";
  }
}

showOpenHours();

// cookie functionality
function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = name + "=" + value + ";expires=" + date.toUTCString() + ";path=/";
}

function getCookie(name) {
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const part = cookies[i].trim();
    if (part.indexOf(name + "=") === 0) {
      return part.slice(name.length + 1);
    }
  }
  return "";
}

const banner = document.querySelector("#cookie-banner");
const acceptBtn = document.querySelector("#cookie-accept");

if (banner && getCookie("cookiesAccepted") !== "yes") {
  banner.style.display = "block";
}

if (acceptBtn) {
  acceptBtn.addEventListener("click", function () {
    setCookie("cookiesAccepted", "yes", 7);
    banner.style.display = "none";
  });
}

// search header icon
const headerSearch = document.querySelector("#header-search");

if (headerSearch) {
  headerSearch.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      const text = headerSearch.value;
      window.location.href = "ourproducts.html?search=" + encodeURIComponent(text);
    }
  });
}

const pageSearch = document.querySelector("#search-input");

if (pageSearch) {
  const params = new URLSearchParams(window.location.search);
  const searchWord = params.get("search");
  if (searchWord) {
    pageSearch.value = searchWord;
  }
}




// cart
function getCart() {
  const saved = localStorage.getItem("cart");
  if (saved) {
    return JSON.parse(saved);
  }
  return [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  showCartCount();
}

function showCartCount() {
  const countBox = document.querySelector("#cart-count");
  if (!countBox) return;

  const cart = getCart();
  let total = 0;
  for (let i = 0; i < cart.length; i++) {
    total = total + cart[i].qty;
  }
  countBox.textContent = total;
}

function addToCart(id) {
  const product = allProducts.find(function (item) {
    return String(item.id) === String(id);
  });
  if (!product) return;
  if (product.stock <= 0) return;

  const cart = getCart();
  const found = cart.find(function (item) {
    return String(item.id) === String(id);
  });

  if (found) {
    found.qty = found.qty + 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      qty: 1
    });
  }

  saveCart(cart);
}

document.addEventListener("click", function (event) {
  if (!event.target.classList.contains("add-cart-btn")) return;
  addToCart(event.target.getAttribute("data-id"));
});

showCartCount();

// form
function showError(id, message) {
  const box = document.querySelector("#" + id);
  if (box) box.textContent = message;
}

function clearErrors() {
  showError("name-error", "");
  showError("email-error", "");
  showError("phone-error", "");
  showError("subject-error", "");
  showError("comment-error", "");
}

function formIsValid() {
  clearErrors();
  let ok = true;

  const name = document.querySelector("#name").value.trim();
  const email = document.querySelector("#email").value.trim();
  const phone = document.querySelector("#phone").value.trim();
  const subject = document.querySelector("#subject").value;
  const comment = document.querySelector("#comment").value.trim();

  if (name.length < 2) {
    showError("name-error", "Please enter your name");
    ok = false;
  }

  if (email.indexOf("@") === -1) {
    showError("email-error", "Please enter a valid email");
    ok = false;
  }

  if (phone.length < 10) {
    showError("phone-error", "Please enter a phone number");
    ok = false;
  }

  if (subject === "") {
    showError("subject-error", "Please choose a subject");
    ok = false;
  }

  if (comment.length < 10) {
    showError("comment-error", "Please write a longer comment");
    ok = false;
  }

  return ok;
}

const contactForm = document.querySelector("#contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const okBox = document.querySelector("#form-ok");
    const sendBtn = contactForm.querySelector("button[type='submit']");

    if (!formIsValid()) {
      if (okBox) okBox.textContent = "";
      return;
    }

    sendBtn.disabled = true;
    sendBtn.textContent = "Sending...";
    if (okBox) okBox.textContent = "";

    const enquiry = {
      name: document.querySelector("#name").value.trim(),
      email: document.querySelector("#email").value.trim(),
      phone: document.querySelector("#phone").value.trim(),
      subject: document.querySelector("#subject").value,
      comment: document.querySelector("#comment").value.trim()
    };

    setTimeout(function () {
      localStorage.setItem("enquiry", JSON.stringify(enquiry));
      sendBtn.disabled = false;
      sendBtn.textContent = "Send";
      contactForm.reset();
      if (okBox) okBox.textContent = "Message sent. We will get back to you.";
    }, 1500);
  });
}

// Product detail page
async function loadOneProduct() {
  const box = document.querySelector("#product-detail");
  if (!box) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    box.innerHTML = "<p>No product selected.</p>";
    return;
  }

  try {
    const response = await fetch(API);
    if (!response.ok) throw new Error("bad response");
    const products = await response.json();
    const p = products.find(function (item) {
      return String(item.id) === String(id);
    });

    if (!p) {
      box.innerHTML = "<p>Product not found.</p>";
      return;
    }

    box.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <img src="${p.image}" alt="${p.name}" class="w-full object-cover">
        <div>
          <p class="text-sm mb-2">${p.series} Series · ${p.sku}</p>
          <h1 class="text-3xl mb-4">${p.name}</h1>
          <p class="text-xl mb-4">${formatPrice(p.price)}</p>
          <p class="mb-4">${p.description}</p>
          <p class="mb-6">${p.stock > 0 ? "In stock" : "Sold out"}</p>
          <a href="ourproducts.html" class="underline">Back to shop</a>
        </div>
      </div>
    `;
  } catch (error) {
    box.innerHTML = "<p>Could not load product. Start the API.</p>";
  }
}

loadOneProduct();
loadProducts();