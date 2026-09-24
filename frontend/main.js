const API = "http://localhost:3001/api/products";
let allProducts = [];

function formatPrice(price) {
  return "KSh " + Number(price).toLocaleString() + ".00";
}

// catalogue: cards, filters, fetch, product detail


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
        class="add-cart-btn w-full border border-gray-300 py-2 text-sm rounded-lg hover:bg-gray-700 bg-black text-white"
        data-id="${product.id}"
        ${soldOut ? "disabled" : ""}
      >
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
    featured.innerHTML = allProducts
      .filter(function (p) {
        return p.featured;
      })
      .map(productCard)
      .join("");
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

  all.innerHTML =
    list.length === 0
      ? "<p>No products match your filters.</p>"
      : list.map(productCard).join("");

  if (status) {
    status.textContent =
      "Showing " + list.length + " of " + allProducts.length + " locks";
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

// Read ?search= and ?series= so header / footer links pre-fill the filters
const params = new URLSearchParams(window.location.search);
if (search) {
  const searchWord = params.get("search");
  if (searchWord) search.value = searchWord;
}
if (series) {
  const seriesWord = params.get("series");
  if (seriesWord) series.value = seriesWord;
}



async function loadOneProduct() {
  const box = document.querySelector("#product-detail");
  if (!box) return;

  const id = new URLSearchParams(window.location.search).get("id");
  if (!id) {
    box.innerHTML = "<p>No product selected.</p>";
    return;
  }


  try {
    const response = await fetch(API);
    if (!response.ok) throw new Error("bad response");
    const products = await response.json();
    allProducts = products;

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
          <button
          type="button"
            class="add-cart-btn bg-black text-white px-6 py-2 mb-4 rounded-md"
            data-id="${p.id}"
            ${p.stock <= 0 ? "disabled" : ""}
          >
            ${p.stock <= 0 ? "Sold out" : "Add to cart"}
          </button>
        <a href="ourproducts.html" class="underline">Back to shop</a>
        </div>
      </div>
    `;
  } catch (error) {
    box.innerHTML = "<p>Could not load product. Start the API.</p>";
  }
}

// Site tools: theme, country, hours, cookies, header search

// Light / Dark. Class goes on body. Choice saved so refresh keeps it.
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
if (localStorage.getItem("theme") === "dark") {
  setTheme("dark");
}

// Footer Kenya / Uganda / Tanzania. Saves the name only. Prices stay KSh.
const countrySelect = document.querySelector("#country-select");
if (countrySelect) {
  const savedCountry = localStorage.getItem("country");
  if (savedCountry) countrySelect.value = savedCountry;
  countrySelect.addEventListener("change", function () {
    localStorage.setItem("country", countrySelect.value);
  });
}

// Contact / About: Open now vs Closed. Shop hours Mon–Sat 07:00–18:00 EAT.
 function showOpenHours() {
  const status = document.querySelector("#open-status");
  if (!status) return;
       const now = new Date();
  const eatHour = now.getUTCHours() + 3;
  const day = now.getUTCDay();
  const open = day >= 1 && day <= 6 && eatHour >= 7 && eatHour < 18;
  status.textContent = open ? "Open now" : "Closed, we reply next business day";
}
showOpenHours();

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

// cookie banner only if the visitor. Accept/Deny
const banner = document.querySelector("#cookie-banner");
const acceptBtn = document.querySelector("#cookie-accept");
const denyBtn = document.querySelector("#cookie-deny");
if (banner && getCookie("cookiesAccepted") === "") {
  banner.style.display = "block";
}
if (acceptBtn) {
  acceptBtn.addEventListener("click", function () {
    setCookie("cookiesAccepted", "yes", 7);
    banner.style.display = "none";
  });
}
if (denyBtn) {
  denyBtn.addEventListener("click", function () {
    setCookie("cookiesAccepted", "no", 7);
    banner.style.display = "none";
  });
}

// Enter in the header box → All Products with ?search= HEADER
const headerSearch = document.querySelector("#header-search");
if (headerSearch) {
  headerSearch.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      window.location.href =
        "ourproducts.html?search=" + encodeURIComponent(headerSearch.value);
    }
  });
}

// Cart: add, qty, remove, badge, drawer, localStorage
function getCart() {
  const saved = localStorage.getItem("cart");
  return saved ? JSON.parse(saved) : [];
}

// Money in bg: price x qty for every line.
function cartSubtotal(cart) {
  let sum = 0;
  for (let i = 0; i < cart.length; i++) {
    sum = sum + cart[i].price * cart[i].qty;
  }
  return sum;
}

// Number on the cart icon.
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

// Draw the drawer: lines,+ /- Remove, subtotal, offer text.
function showCart() {
  const list = document.querySelector("#cart-list");
  const offer = document.querySelector("#cart-offer");
  const subtotalBox = document.querySelector("#cart-subtotal");
  if (!list) return;

  const cart = getCart();
  if (cart.length === 0) {
    list.innerHTML = "<p>Your cart is empty.</p>";
    if (offer) offer.textContent = "";
    if (subtotalBox) subtotalBox.textContent = "";
    return;
  }

  let html = "";
  for (let i = 0; i < cart.length; i++) {
    const item = cart[i];
    const line = item.price * item.qty;
    html +=
      "<div class='mb-3'>" +
      "<p>" + item.name + "</p>" +
      "<p class='text-sm'>" +
      formatPrice(item.price) + " x " + item.qty + " = " + formatPrice(line) +
      "</p>" +
      "<button type='button' class='qty-minus border px-2' data-id='" + item.id + "'>-</button> " +
       "<button type='button' class='qty-plus border px-2' data-id='" + item.id + "'>+</button> " +
      "<button type='button' class='qty-remove border px-2' data-id='" + item.id + "'>Remove</button>" +
      "</div>";
  }
  list.innerHTML = html;

  const sum = cartSubtotal(cart);
  if (subtotalBox) subtotalBox.textContent = "Subtotal: " + formatPrice(sum);
  if (offer) {
    if (sum >= 100000) {
      offer.textContent = "5% off unlocked. Free Nairobi delivery unlocked.";
    } else if (sum >= 50000) {
      offer.textContent = "Free Nairobi delivery unlocked. Add more for 5% off.";
    } else {
      offer.textContent = "Add " + formatPrice(50000 - sum) + " more for free Nairobi delivery.";
    }
  }
}

// Green line under the header on Home / All Products.
function showOfferLine() {
  const line = document.querySelector("#offer-line");
  if (!line) return;
  const sum = cartSubtotal(getCart());
  if (sum >= 100000) {
    line.textContent = "5% off and free Nairobi delivery unlocked";
  } else if (sum >= 50000) {
    line.textContent = "Free Nairobi delivery unlocked";
  } else {
    line.textContent =
      "Spend KSh 50,000+ for free Nairobi delivery · KSh 100,000+ for 5% off";
  }
}

// Write cart, then refresh badge, drawer, and offer line.
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  showCartCount();
  showCart();
  showOfferLine();
}

// Same id again → qty + 1. New id → new line. Needs allProducts from fetch.
function addToCart(id) {
  const product = allProducts.find(function (item) {
    return String(item.id) === String(id);
  });
  if (!product || product.stock <= 0) return;

  const cart = getCart();
  const found = cart.find(function (item) {
    return String(item.id) === String(id);
  });
  if (found) {
    found.qty = found.qty + 1;
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price, qty: 1 });
  }
  saveCart(cart);
}

// amount is +1 or -1. Qty 0 removes the line.
function changeQty(id, amount) {
  const cart = getCart();
  const found = cart.find(function (item) {
    return String(item.id) === String(id);
  });
  if (!found) return;
  found.qty = found.qty + amount;
  if (found.qty <= 0) {
    saveCart(cart.filter(function (item) {
      return String(item.id) !== String(id);
    }));
    return;
  }
  saveCart(cart);
}

function removeItem(id) {
  saveCart(getCart().filter(function (item) {
    return String(item.id) !== String(id);
  }));
}

// One listener for Add to cart and drawer buttons (class names).
document.addEventListener("click", function (event) {
  if (event.target.classList.contains("add-cart-btn")) {
    addToCart(event.target.getAttribute("data-id"));
  }
  if (event.target.classList.contains("qty-plus")) {
    changeQty(event.target.getAttribute("data-id"), 1);
  }
  if (event.target.classList.contains("qty-minus")) {
    changeQty(event.target.getAttribute("data-id"), -1);
  }
  if (event.target.classList.contains("qty-remove")) {
    removeItem(event.target.getAttribute("data-id"));
  }
});

const cartBtn = document.querySelector("#cart-btn");
const cartDrawer = document.querySelector("#cart-drawer");
const cartClose = document.querySelector("#cart-close");
if (cartBtn && cartDrawer) {
  cartBtn.addEventListener("click", function (event) {
    event.preventDefault();
    cartDrawer.classList.add("open");
    showCart();
  });
}
if (cartClose && cartDrawer) {
  cartClose.addEventListener("click", function () {
    cartDrawer.classList.remove("open");
  });
}

showCartCount();
showCart();
showOfferLine();

// Checkout (simulated). pickup or deliver

function cartTotals() {
  const cart = getCart();
  const subtotal = cartSubtotal(cart);
  const discount = subtotal >= 100000 ? subtotal * 0.05 : 0;
  return {
    cart: cart,
    subtotal: subtotal,
    discount: discount,
    afterDiscount: subtotal - discount
  };
}

function showCheckout() {
  const list = document.querySelector("#checkout-list");
  if (!list) return;

  const data = cartTotals();
  const method = document.querySelector("input[name='method']:checked");
  const wantDeliver = method && method.value === "deliver";
  const nairobi = document.querySelector("#nairobi-check");
  const extra = document.querySelector("#deliver-extra");
  const offer = document.querySelector("#checkout-offer");
  const deliveryBox = document.querySelector("#checkout-delivery");
  const totalBox = document.querySelector("#checkout-total");

  if (extra) extra.style.display = wantDeliver ? "block" : "none";

  if (data.cart.length === 0) {
    list.innerHTML = "<p>Your cart is empty.</p>";
    if (offer) offer.textContent = "";
    if (deliveryBox) deliveryBox.textContent = "";
    if (totalBox) totalBox.textContent = "";
    return;
  }

  let html = "";
  for (let i = 0; i < data.cart.length; i++) {
    const item = data.cart[i];
    html +=
      "<p class='mb-2'>" +
      item.name + " x " + item.qty + " - " + formatPrice(item.price * item.qty) +
      "</p>";
  }
  list.innerHTML = html;

  // Pickup = 0. Nairobi + 50k+ = 0. Nairobi under 50k = 1500. Other town = 2500.
  let delivery = 0;
  let deliveryText = "Pickup - no delivery fee";
  if (wantDeliver) {
    if (nairobi && nairobi.checked && data.subtotal >= 50000) {
      delivery = 0;
      deliveryText = "Delivery in Nairobi - free";
    } else if (nairobi && nairobi.checked) {
      delivery = 1500;
      deliveryText = "Delivery in Nairobi - " + formatPrice(1500);
    } else {
      delivery = 2500;
      deliveryText = "Delivery outside Nairobi - " + formatPrice(2500);
    }
  }

  if (offer) {
    offer.textContent =
      data.discount > 0
        ? "5% off: -" + formatPrice(data.discount)
        : "Spend KSh 100,000 to unlock 5% off";
  }
  if (deliveryBox) deliveryBox.textContent = deliveryText;
  if (totalBox) {
    totalBox.textContent = "To pay: " + formatPrice(data.afterDiscount + delivery);
  }
}

const checkoutPage = document.querySelector("#checkout-list");
if (checkoutPage) {
  showCheckout();
  const radios = document.querySelectorAll("input[name='method']");
  for (let i = 0; i < radios.length; i++) {
    radios[i].addEventListener("change", showCheckout);
  }
  const nairobi = document.querySelector("#nairobi-check");
  if (nairobi) nairobi.addEventListener("change", showCheckout);

  const placeBtn = document.querySelector("#place-order");
  if (placeBtn) {
    placeBtn.addEventListener("click", function () {
      const msg = document.querySelector("#checkout-msg");
      const data = cartTotals();
      if (data.cart.length === 0) {
        if (msg) msg.textContent = "Your cart is empty.";
        return;
      }
      // Recalculate so the page total matches the cart (no typed amount).
      const paid = data.afterDiscount;
      const check = cartSubtotal(data.cart) - data.discount;
      if (paid !== check) {
        if (msg) msg.textContent = "Price check failed. Order not placed.";
        return;
      }
      localStorage.setItem("lastOrder", JSON.stringify(data.cart));
      saveCart([]);
      if (msg) msg.textContent = "Order placed.";
      showCheckout();
    });
  }
}

// CONTACT FORM
// Here check fields then stop submit if bad then show Sending... to save enquiry.

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

    // Invalid → errors stay, no save.
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

    // No real email server..
    setTimeout(function () {
      localStorage.setItem("enquiry", JSON.stringify(enquiry));
      sendBtn.disabled = false;
      sendBtn.textContent = "Send";
      contactForm.reset();
      if (okBox) okBox.textContent = "Message sent. We will get back to you.";
    }, 1500);
  });
}

// Account
// Users live in localStorage
// Browse and add to cart with no login.
// Checkout with no currentUser t0> login.html?next=checkout

function getUsers() {
  const saved = localStorage.getItem("users");
  return saved ? JSON.parse(saved) : [];
}

function getCurrentUser() {
  const saved = localStorage.getItem("currentUser");
  return saved ? JSON.parse(saved) : null;
}

function setMsg(id, text, ok) {
  const box = document.querySelector("#" + id);
  if (!box) return;
  box.textContent = text;
  box.style.color = ok ? "rgb(0, 128, 0)" : "rgb(180, 0, 0)";
}

// Came from checkout → go back there. Header Login → Home.
function afterLoginGo() {
  const next = new URLSearchParams(window.location.search).get("next");
  window.location.href = next === "checkout" ? "checkout.html" : "index.html";
}

const registerView = document.querySelector("#register-view");
const loginView = document.querySelector("#login-view");
const showLoginBtn = document.querySelector("#show-login");
const showRegisterBtn = document.querySelector("#show-register");

if (showLoginBtn && registerView && loginView) {
  showLoginBtn.addEventListener("click", function () {
    registerView.style.display = "none";
    loginView.style.display = "block";
  });
}
if (showRegisterBtn && registerView && loginView) {
  showRegisterBtn.addEventListener("click", function () {
    loginView.style.display = "none";
    registerView.style.display = "block";
  });
}

const registerForm = document.querySelector("#register-form");
if (registerForm) {
  registerForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const name = document.querySelector("#reg-name").value.trim();
    const email = document.querySelector("#reg-email").value.trim();
    const password = document.querySelector("#reg-password").value;
    const confirm = document.querySelector("#reg-confirm").value;

    if (name.length < 2) {
      setMsg("reg-msg", "Please enter your name.", false);
      return;
    }
    if (email.indexOf("@") === -1) {
      setMsg("reg-msg", "Enter a valid email.", false);
      return;
    }
    if (password.length < 4) {
      setMsg("reg-msg", "Password must be at least 4 characters.", false);
      return;
    }
    if (password !== confirm) {
      setMsg("reg-msg", "Password and confirm password do not match.", false);
      return;
    }

    const users = getUsers();
    if (users.find(function (user) { return user.email === email; })) {
      setMsg("reg-msg", "That email is already registered. Please login.", false);
      return;
    }

    users.push({ name: name, email: email, password: password });
    localStorage.setItem("users", JSON.stringify(users));
    registerForm.reset();
    setMsg("reg-msg", "Account created. Save your email and password. You can sign in now.", true);

    // After the green message, show the Sign in card.
    setTimeout(function () {
      if (registerView && loginView) {
        registerView.style.display = "none";
        loginView.style.display = "block";
      }
    }, 2500);
  });
}

const loginForm = document.querySelector("#login-form");
if (loginForm) {
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const email = document.querySelector("#login-email").value.trim();
    const password = document.querySelector("#login-password").value;
    const user = getUsers().find(function (item) {
      return item.email === email;
    });

    if (!user) {
      setMsg("login-msg", "This email is not registered.", false);
      return;
    }
    if (user.password !== password) {
      setMsg("login-msg", "Password does not match.", false);
      return;
    }

    localStorage.setItem(
      "currentUser",
      JSON.stringify({ name: user.name || "", email: user.email })
    );
    setMsg("login-msg", user.name ? "Welcome " + user.name : "Login successful.", true);
    setTimeout(afterLoginGo, 3000);
  });
}

// Checkout page + not logged in → must sign in first.
if (document.querySelector("#checkout-list") && !getCurrentUser()) {
  window.location.href = "login.html?next=checkout";
}

function showAuthHeader() {
  const link = document.querySelector("#auth-link");
  const hello = document.querySelector("#welcome-line");
  const welcomeUser = document.querySelector("#welcome-user");
  const user = getCurrentUser();

  if (link) {
    if (user) {
      link.textContent = "Logout";
      link.href = "#";
      link.onclick = function (event) {
        event.preventDefault();
        localStorage.removeItem("currentUser");
        window.location.href = "index.html";
      };
    } else {
      link.textContent = "Login";
      link.href = "login.html";
    }
  }
  if (hello && user && user.name) hello.textContent = "Hello welcome " + user.name;
  if (welcomeUser) welcomeUser.textContent = user && user.name ? "Hello " + user.name : "";
}
showAuthHeader();

loadOneProduct();
loadProducts();