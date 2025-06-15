function addType() {
  const div = document.querySelector('#typeContainer .multi-inputs');
  const input = document.createElement('input');
  input.className = 'type';
  input.placeholder = 'Type';
  input.addEventListener('input', updatePriceInputs);
  div.appendChild(input);
  updatePriceInputs();
}

function addSize() {
  const div = document.querySelector('#sizeContainer .multi-inputs');
  const input = document.createElement('input');
  input.className = 'size';
  input.placeholder = 'Size';
  input.addEventListener('input', updatePriceInputs);
  div.appendChild(input);
  updatePriceInputs();
}

function updatePriceInputs() {
  const types = [...document.querySelectorAll('.type')].map(t => t.value.trim()).filter(Boolean);
  const sizes = [...document.querySelectorAll('.size')].map(s => s.value.trim()).filter(Boolean);

  const container = document.getElementById('priceTable');
  container.innerHTML = '<label>Enter Prices (for each Type x Size)</label>';

  if (types.length === 0 || sizes.length === 0) {
    const msg = document.createElement('p');
    msg.textContent = 'Please add at least one type and one size.';
    container.appendChild(msg);
    return;
  }

  types.forEach(type => {
    sizes.forEach(size => {
      const row = document.createElement('div');
      row.innerHTML = `
        <input value="${type}" disabled />
        <input value="${size}" disabled />
        <input type="number" min="0" step="0.01" placeholder="Price" data-type="${type}" data-size="${size}" class="price-input" />
      `;
      container.appendChild(row);
    });
  });
}

function saveProduct() {
  const name = document.getElementById('productName').value.trim();
  const category = document.getElementById('category').value.trim();
  const manufacturer = document.getElementById('manufacturer').value.trim();

  if (!name || !category || !manufacturer) {
    alert('Please fill all product details.');
    return;
  }

  const priceInputs = [...document.querySelectorAll('.price-input')];
  if (priceInputs.length === 0) {
    alert('Please add at least one type and size with prices.');
    return;
  }

  const variants = [];
  for (const p of priceInputs) {
    const price = parseFloat(p.value);
    if (isNaN(price) || price <= 0) {
      alert(`Invalid price for type "${p.dataset.type}" and size "${p.dataset.size}".`);
      return;
    }
    variants.push({ type: p.dataset.type, size: p.dataset.size, price });
  }

  const newProduct = { name, category, manufacturer, variants };

  // Save to localStorage (append or create new)
function saveProductToFirebase(product) {
  db.collection("products").add(product)
    .then(() => {
      alert("Product saved to Firebase!");
    })
    .catch(error => {
      console.error("Error adding product: ", error);
    });
}


  // Clear form for new entry
  document.getElementById('productName').value = '';
  document.getElementById('category').value = '';
  document.getElementById('manufacturer').value = '';
  document.querySelector('#typeContainer .multi-inputs').innerHTML = '<input type="text" class="type" placeholder="Type" />';
  document.querySelector('#sizeContainer .multi-inputs').innerHTML = '<input type="text" class="size" placeholder="Size" />';
  document.getElementById('priceTable').innerHTML = '<label>Enter Prices (for each Type x Size)</label>';
}

document.querySelector('#typeContainer .multi-inputs input').addEventListener('input', updatePriceInputs);
document.querySelector('#sizeContainer .multi-inputs input').addEventListener('input', updatePriceInputs);
