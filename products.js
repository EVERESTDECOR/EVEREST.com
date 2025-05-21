const products = [
    // Fittings (PPR)
    { name: 'Elbow 90°', category: 'ppr_fittings' },
    { name: 'Elbow 45°', category: 'ppr_fittings' },
    { name: 'Tee', category: 'ppr_fittings' },
    { name: 'Reducing Tee', category: 'ppr_fittings' },
    { name: 'Cross Tee', category: 'ppr_fittings' },
    { name: 'Union ', category: 'ppr_fittings' },
    { name: 'Nipple ', category: 'ppr_fittings' },
    { name: 'Socket', category: 'ppr_fittings' },
    { name: 'Reducer', category: 'ppr_fittings' },
    { name: 'Bushing', category: 'ppr_fittings' },
    { name: 'Cap', category: 'ppr_fittings' },
    { name: 'Plug', category: 'ppr_fittings' },



    // Fittings (PVC)
    { name: 'Elbow 90° (PVC)', category: 'pvc_fittings' },
    { name: 'Elbow 45° (PVC)', category: 'pvc_fittings' },
    { name: 'Tee (PVC)', category: 'pvc_fittings' },
    { name: 'Reducing Tee (PVC)', category: 'pvc_fittings' },
    { name: 'Socket (PVC)', category: 'pvc_fittings' },
    { name: 'Coupling (PVC)', category: 'pvc_fittings' },
    { name: 'Bend (PVC)', category: 'pvc_fittings' },

    // Pipes
    { name: 'PVC Pipe', category: 'pvc_pipes' },
    { name: 'PPR Pipe', category: 'ppr_pipes' },

    // Valves
    { name: 'Ball Valve', category: 'valves' },
    { name: 'Gate Valve', category: 'valves' },
    { name: 'Check Valve', category: 'valves' },
    { name: 'Angle Valve', category: 'valves' },

    // Drainage & Waste
    { name: 'Floor Trap', category: 'drainage' },
    { name: 'Sink Strainer', category: 'drainage' },
    { name: 'Drain Pipe', category: 'drainage' },
    { name: 'Siphon', category: 'drainage' },

    // Shower & Bathroom Accessories (Placeholder)
    { name: 'Shower Head', category: 'bathroom' },
    { name: 'Soap Dish', category: 'bathroom' },
    { name: 'Toilet Brush Holder', category: 'bathroom' }



];

const priceSheet = {};
products.forEach(p => {
    priceSheet[p.name] = 100; // Placeholder price
});
 
// 🔵 Type options for applicable products
const productTypes = {
    'PVC Pipe': ['Heavy', 'Medium', 'Light'],
    'PPR Pipe': ['normall', 'PN16', 'PN20'],
    'Ball Valve': ['Plastic', 'Metal'],
    'Gate Valve': ['Brass','pegler', 'Stainless Steel'],
    'Check Valve': ['Vertical', 'Horizontal'],
    'Angle Valve': ['lirrie', '3/4"'],
    'Floor Trap': ['Round', 'Square'],
    'Shower Head': ['Rainfall', 'Handheld']
    // Add more products and types as needed
};

const productContainer = document.getElementById('productContainer');
const cartItemsList = document.getElementById('cartItems');
const totalAmountEl = document.getElementById('totalAmount');
const submitOrderBtn = document.getElementById('submitOrder');
let cart = [];

function renderProducts(category = "") {
    productContainer.innerHTML = "";
    const filtered = category ? products.filter(p => p.category === category) : products;
    filtered.forEach(product => {
        const div = document.createElement("div");
        div.className = "product-card";

        const hasType = productTypes[product.name] !== undefined;

        div.innerHTML = `
            <h3>${product.name}</h3>
            <input type="text" placeholder="Size (e.g. 1\")" class="sizeInput">
            ${hasType ? `
                <select class="typeInput">
                    <option value="">Select Type</option>
                    ${productTypes[product.name].map(type => `<option value="${type}">${type}</option>`).join('')}
                </select>
            ` : ''}
            <input type="number" placeholder="Quantity" class="qtyInput" min="1">
            <button onclick="addToCart('${product.name}', this)">Add to Cart</button>
        `;
        productContainer.appendChild(div);
    });
}

function addToCart(productName, btn) {
    const parent = btn.parentElement;
    const size = parent.querySelector('.sizeInput')?.value || '';
    const qty = parseInt(parent.querySelector('.qtyInput')?.value);
    const typeInput = parent.querySelector('.typeInput');
    const type = typeInput ? typeInput.value : '';

    if (!qty || qty < 1 || (typeInput && !type)) {
        alert("Please enter all required fields.");
        return;
    }

    const price = priceSheet[productName] || 0;
    cart.push({ name: productName, size, type, qty, price });
    updateCart();
}

function updateCart() {
    cartItemsList.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        const li = document.createElement('li');
        let text = `${item.name}`;
        if (item.size) text += ` - Size: ${item.size}`;
        if (item.type) text += ` - Type: ${item.type}`;
        text += ` - Qty: ${item.qty}`;
        li.innerHTML = `${text} <button onclick="removeFromCart(${index})">Remove</button>`;
        cartItemsList.appendChild(li);
        total += item.qty * item.price;
    });

    totalAmountEl.textContent = total;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

submitOrderBtn.addEventListener('click', () => {
    const mpesa = document.getElementById('mpesaInput').value;
    if (!mpesa || mpesa.length < 10) {
        alert("Please enter a valid Mpesa number.");
        return;
    }

    if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }

    alert(`Order received. Please pay KES ${totalAmountEl.textContent} via Mpesa (${mpesa})`);
});

document.getElementById('categorySelect').addEventListener('change', e => {
    renderProducts(e.target.value);
});

document.getElementById('searchInput').addEventListener('input', e => {
    const search = e.target.value.toLowerCase();
    const filtered = products.filter(p => p.name.toLowerCase().includes(search));
    productContainer.innerHTML = "";
    filtered.forEach(product => {
        const div = document.createElement("div");
        div.className = "product-card";

        const hasType = productTypes[product.name] !== undefined;

        div.innerHTML = `
            <h3>${product.name}</h3>
            <input type="text" placeholder="Size (e.g. 1\")" class="sizeInput">
            ${hasType ? `
                <select class="typeInput">
                    <option value="">Select Type</option>
                    ${productTypes[product.name].map(type => `<option value="${type}">${type}</option>`).join('')}
                </select>
            ` : ''}
            <input type="number" placeholder="Quantity" class="qtyInput" min="1">
            <button onclick="addToCart('${product.name}', this)">Add to Cart</button>
        `;
        productContainer.appendChild(div);
    });
});

// Initial load
renderProducts();
