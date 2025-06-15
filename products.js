const productContainer = document.getElementById('productContainer');
const cartItemsList = document.getElementById('cartItems');
const totalAmountEl = document.getElementById('totalAmount');
const submitOrderBtn = document.getElementById('submitOrder');
const mpesaInput = document.getElementById('mpesaInput');
const searchInput = document.getElementById('searchInput');
const categorySelect = document.getElementById('categorySelect');

let products = JSON.parse(localStorage.getItem('products') || '[]');
let cart = [];

function populateCategorySelect() {
  const categories = [...new Set(products.map(p => p.category))];
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    categorySelect.appendChild(option);
  });
}

function renderProducts(filterCategory = '', searchTerm = '') {
  productContainer.innerHTML = '';
  let filtered = products;

  if (filterCategory) {
    filtered = filtered.filter(p => p.category === filterCategory);
  }
  if (searchTerm) {
    filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }

  filtered.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';

    // Build size options string for dropdown
    const sizeOptions = product.variants.map(variant =>
      `<option value="${variant.size}" data-price="${variant.price}" data-type="${variant.type}">
        ${variant.type} - ${variant.size} - KES ${variant.price.toFixed(2)}
      </option>`
    ).join('');

    card.innerHTML = `
      <h3>${product.name}</h3>
      <small>Manufacturer: ${product.manufacturer}</small>
      <select class="variantSelect">${sizeOptions}</select>
      <input type="number" min="1" value="1" class="qtyInput" />
      <button class="addToCartBtn">Add to Cart</button>
    `;

    const qtyInput = card.querySelector('.qtyInput');
    const addToCartBtn = card.querySelector('.addToCartBtn');
    const variantSelect = card.querySelector('.variantSelect');

    addToCartBtn.onclick = () => {
      const selectedOption = variantSelect.options[variantSelect.selectedIndex];
      const size = selectedOption.value;
      const price = parseFloat(selectedOption.dataset.price);
      const type = selectedOption.dataset.type;
      const qty = parseInt(qtyInput.value);

      if (!qty || qty < 1) {
        alert('Please enter a valid quantity.');
        return;
      }
      addToCart(product.name, type, size, price, qty);
    };

    productContainer.appendChild(card);
  });
}

function addToCart(name, type, size, price, qty) {
  const existingIndex = cart.findIndex(item =>
    item.name === name && item.type === type && item.size === size
  );
  if (existingIndex !== -1) {
    cart[existingIndex].qty += qty;
  } else {
    cart.push({ name, type, size, price, qty });
  }
  updateCart();
}

function updateCart() {
  cartItemsList.innerHTML = '';
  let total = 0;

  cart.forEach((item, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${item.name} (${item.type} - ${item.size}) - Qty: ${item.qty} - KES ${(item.price * item.qty).toFixed(2)}
      <button data-index="${index}">Remove</button>
    `;

    const removeBtn = li.querySelector('button');
    removeBtn.onclick = () => {
      cart.splice(index, 1);
      updateCart();
    };

    cartItemsList.appendChild(li);
    total += item.price * item.qty;
  });

  totalAmountEl.textContent = total.toFixed(2);
}

submitOrderBtn.onclick = () => {
  const mpesa = mpesaInput.value.trim();
  if (!mpesa || mpesa.length < 10) {
    alert('Please enter a valid Mpesa number.');
    return;
  }
  if (cart.length === 0) {
    alert('Your cart is empty.');
    return;
  }
  alert(`Order received. Please pay KES ${totalAmountEl.textContent} via Mpesa (${mpesa})`);
  cart = [];
  updateCart();
  mpesaInput.value = '';
};

searchInput.addEventListener('input', () => {
  renderProducts(categorySelect.value, searchInput.value);
});

categorySelect.addEventListener('change', () => {
  renderProducts(categorySelect.value, searchInput.value);
});

populateCategorySelect();
renderProducts();
