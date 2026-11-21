const alertBox = document.getElementById("alert");
const alertIcon = document.getElementById("alertIcon");
const alertTitle = document.getElementById("alertTitle");
const alertText = document.getElementById("alertText");
const alertButton = document.getElementById("alertButton");

function showAlert(title, message, type = "error") {
  alertTitle.textContent = title;
  alertText.textContent = message;
  alertIcon.textContent = type === "success" ? "✓" : "!";
  alertBox.dataset.type = type;
  alertBox.hidden = false;
  requestAnimationFrame(() => alertBox.classList.add("open"));
  alertButton.focus();
}

function closeAlert() {
  alertBox.classList.remove("open");
  setTimeout(() => {
    alertBox.hidden = true;
  }, 250);
}

alertButton.addEventListener("click", closeAlert);

alertBox.addEventListener("click", (event) => {
  if (event.target === alertBox) {
    closeAlert();
  }
});

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("loginName").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!name || !password) {
    showAlert("Oops!", "Please fill in your name and password.");
    return;
  }

  loginForm.hidden = true;
  document.getElementById("welcome").classList.add("show");
  document.getElementById("welcomeText").textContent = `${name}, your member rates are now active.`;
  showAlert(`Hello, ${name}!`, "You have signed in successfully.", "success");
});

const cart = [];
const cartBox = document.getElementById("cart");
const overlay = document.getElementById("overlay");
const cartItems = document.getElementById("cartItems");
const cartEmpty = document.getElementById("cartEmpty");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");

function openCart() {
  cartBox.classList.add("open");
  overlay.classList.add("open");
}

function closeCart() {
  cartBox.classList.remove("open");
  overlay.classList.remove("open");
}

function addToCart(name, price, nights = 1) {
  const item = cart.find((room) => room.name === name);

  if (item) {
    item.qty += nights;
  } else {
    cart.push({ name, price, qty: nights });
  }

  renderCart();
}

function changeQty(name, step) {
  const item = cart.find((room) => room.name === name);
  item.qty += step;

  if (item.qty === 0) {
    cart.splice(cart.indexOf(item), 1);
  }

  renderCart();
}

function renderCart() {
  cartItems.innerHTML = "";
  let total = 0;
  let count = 0;

  cart.forEach((item) => {
    total += item.price * item.qty;
    count += item.qty;

    const li = document.createElement("li");
    li.className = "cart-item";
    li.innerHTML = `
      <div>
        <b>${item.name}</b>
        <span>$${item.price} × ${item.qty} ${item.qty === 1 ? "night" : "nights"}</span>
      </div>
      <div class="qty">
        <button type="button" data-step="-1">−</button>
        <span>${item.qty}</span>
        <button type="button" data-step="1">+</button>
      </div>
    `;

    li.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => changeQty(item.name, Number(button.dataset.step)));
    });

    cartItems.appendChild(li);
  });

  cartTotal.textContent = `$${total}`;
  cartCount.textContent = count;
  cartEmpty.hidden = cart.length > 0;

  cartCount.classList.remove("bump");
  void cartCount.offsetWidth;
  cartCount.classList.add("bump");
}

document.querySelectorAll(".add-btn").forEach((button) => {
  const label = button.textContent;

  button.addEventListener("click", () => {
    addToCart(button.dataset.name, Number(button.dataset.price));

    button.textContent = "Added ✓";
    button.classList.add("added");

    setTimeout(() => {
      button.textContent = label;
      button.classList.remove("added");
    }, 1200);
  });
});

document.getElementById("cartOpen").addEventListener("click", openCart);
document.getElementById("cartClose").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

document.getElementById("checkout").addEventListener("click", () => {
  if (cart.length === 0) {
    showAlert("Your stay is empty", "Choose a room before confirming.");
    return;
  }

  const total = cartTotal.textContent;
  cart.length = 0;
  renderCart();
  closeCart();
  showAlert("See you soon!", `Your booking of ${total} is confirmed. We sent the details to your email.`, "success");
});

const roomSelect = document.getElementById("roomSelect");
const dayPicker = document.getElementById("dayPicker");
const booking = { name: "Deluxe King", price: 210, day: "", nights: 2, guests: 2 };

function updateSummary() {
  document.getElementById("sumRoom").textContent = booking.name;
  document.getElementById("sumDay").textContent = booking.day || "—";
  document.getElementById("sumNights").textContent = booking.nights;
  document.getElementById("sumGuests").textContent = booking.guests;
  document.getElementById("sumPrice").textContent = `$${booking.price}`;
  document.getElementById("sumTotal").textContent = `$${booking.price * booking.nights}`;
  document.getElementById("nights").textContent = booking.nights;
  document.getElementById("guests").textContent = booking.guests;
}

function chooseRoom(name) {
  const item = roomSelect.querySelector(`li[data-name="${name}"]`);

  booking.name = name;
  booking.price = Number(item.dataset.price);

  roomSelect.querySelector(".dropdown-value").textContent = name;
  roomSelect.querySelector("li.selected").classList.remove("selected");
  item.classList.add("selected");
  roomSelect.classList.remove("open");

  document.getElementById("sumImg").src = `https://images.unsplash.com/${item.dataset.img}?auto=format&fit=crop&w=900&q=80`;
  updateSummary();
}

roomSelect.querySelector(".dropdown-btn").addEventListener("click", () => {
  roomSelect.classList.toggle("open");
});

roomSelect.querySelectorAll("li").forEach((item) => {
  item.addEventListener("click", () => chooseRoom(item.dataset.name));
});

document.addEventListener("click", (event) => {
  if (!roomSelect.contains(event.target)) {
    roomSelect.classList.remove("open");
  }
});

document.querySelectorAll(".room-link").forEach((link) => {
  link.addEventListener("click", () => chooseRoom(link.dataset.room));
});

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

for (let i = 1; i <= 7; i++) {
  const date = new Date();
  date.setDate(date.getDate() + i);

  const button = document.createElement("button");
  button.type = "button";
  button.className = "day";
  button.dataset.label = `${weekDays[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
  button.innerHTML = `<small>${weekDays[date.getDay()]}</small><b>${date.getDate()}</b><small>${months[date.getMonth()]}</small>`;

  button.addEventListener("click", () => {
    const active = dayPicker.querySelector(".day.active");
    if (active) active.classList.remove("active");
    button.classList.add("active");
    booking.day = button.dataset.label;
    updateSummary();
  });

  dayPicker.appendChild(button);
}

document.querySelectorAll(".stepper button").forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.target;
    const max = target === "nights" ? 14 : 4;
    const value = booking[target] + Number(button.dataset.step);

    if (value >= 1 && value <= max) {
      booking[target] = value;
      updateSummary();
    }
  });
});

document.getElementById("bookForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("guestName").value.trim();
  const email = document.getElementById("guestEmail").value.trim();

  if (!booking.day) {
    showAlert("Pick a day", "Please choose your check-in day.");
    return;
  }

  if (!name || !email.includes("@")) {
    showAlert("Almost there", "Please write your name and a valid email.");
    return;
  }

  addToCart(`${booking.name}, from ${booking.day}`, booking.price, booking.nights);
  showAlert("Added to your stay", `${booking.name} for ${booking.nights} ${booking.nights === 1 ? "night" : "nights"} from ${booking.day}. Open your stay to confirm.`, "success");
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeAlert();
    closeCart();
  }
});

const navToggle = document.getElementById("navToggle");

document.querySelectorAll(".nav a").forEach((link) => {
  link.addEventListener("click", () => {
    navToggle.checked = false;
  });
});

updateSummary();
