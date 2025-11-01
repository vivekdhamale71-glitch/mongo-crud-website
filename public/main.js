const productsApi = 'https://my-product-api.onrender.com/api/products';
const ordersApi = 'https://my-product-api.onrender.com/api/orders';

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text || text === 0) e.textContent = text;
  return e;
}

async function fetchProducts() {
  const res = await fetch(productsApi);
  return res.json();
}

async function fetchOrders() {
  const res = await fetch(ordersApi);
  return res.json();
}

async function renderProducts() {
  const container = document.getElementById('products');
  container.innerHTML = 'Loading...';
  try {
    const products = await fetchProducts();
    container.innerHTML = '';
    if (!products.length) container.appendChild(el('div', 'empty', 'No products yet'));
    products.forEach(p => {
      const card = el('div', 'card');
      card.appendChild(el('div', 'card-title', `${p.name} — $${p.price.toFixed(2)}`));
      card.appendChild(el('div', 'card-sub', `${p.description ?? ''}`));
      card.appendChild(el('div', 'card-sub', `Stock: ${p.stock}`));

      const actions = el('div', 'card-actions');
      const edit = el('button', 'btn', 'Edit');
      edit.onclick = () => populateProductForm(p);
      const del = el('button', 'btn danger', 'Delete');
      del.onclick = () => deleteProduct(p._id);
      const buy = el('button', 'btn primary', 'Buy');
      buy.onclick = () => buyProduct(p);
      actions.appendChild(edit);
      actions.appendChild(del);
      actions.appendChild(buy);
      card.appendChild(actions);
      container.appendChild(card);
    });
  } catch (err) {
    container.innerHTML = 'Failed to load products';
  }
}

async function renderOrders() {
  const container = document.getElementById('orders');
  container.innerHTML = 'Loading...';
  try {
    const orders = await fetchOrders();
    container.innerHTML = '';
    if (!orders.length) container.appendChild(el('div', 'empty', 'No orders yet'));
    orders.forEach(o => {
      const card = el('div', 'card');
      const prodName = o.product ? `${o.product.name}` : 'Unknown product';
      card.appendChild(el('div', 'card-title', `${prodName} — $${o.totalPrice.toFixed(2)}`));
      card.appendChild(el('div', 'card-sub', `Qty: ${o.quantity} | Customer: ${o.customerName} <${o.customerEmail}>`));
      card.appendChild(el('div', 'card-sub', `At: ${new Date(o.createdAt).toLocaleString()}`));
      container.appendChild(card);
    });
  } catch (err) {
    container.innerHTML = 'Failed to load orders';
  }
}

function resetProductForm() {
  document.getElementById('product-id').value = '';
  document.getElementById('p-name').value = '';
  document.getElementById('p-desc').value = '';
  document.getElementById('p-price').value = '';
  document.getElementById('p-stock').value = 0;
  document.getElementById('product-form-title').textContent = 'Create product';
  document.getElementById('p-cancel').hidden = true;
}

function populateProductForm(p) {
  document.getElementById('product-id').value = p._id;
  document.getElementById('p-name').value = p.name;
  document.getElementById('p-desc').value = p.description ?? '';
  document.getElementById('p-price').value = p.price;
  document.getElementById('p-stock').value = p.stock;
  document.getElementById('product-form-title').textContent = 'Edit product';
  document.getElementById('p-cancel').hidden = false;
}

async function deleteProduct(id) {
  if (!confirm('Delete this product?')) return;
  await fetch(`${productsApi}/${id}`, { method: 'DELETE' });
  await renderProducts();
}

async function buyProduct(product) {
  const qty = Number(prompt('Quantity to buy', '1'));
  if (!qty || qty <= 0) return alert('Invalid quantity');
  const name = prompt('Customer name');
  if (!name) return alert('Name required');
  const email = prompt('Customer email');
  if (!email) return alert('Email required');

  try {
    const res = await fetch(ordersApi, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: product._id, quantity: qty, customerName: name, customerEmail: email })
    });
    if (!res.ok) {
      const err = await res.json();
      return alert('Order failed: ' + (err.error || res.statusText));
    }
    await renderProducts();
    await renderOrders();
    alert('Order placed');
  } catch (err) {
    console.error(err);
    alert('Order failed');
  }
}

document.getElementById('product-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('product-id').value;
  const payload = {
    name: document.getElementById('p-name').value.trim(),
    description: document.getElementById('p-desc').value.trim(),
    price: Number(document.getElementById('p-price').value),
    stock: Number(document.getElementById('p-stock').value)
  };
  try {
    if (id) {
      await fetch(`${productsApi}/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    } else {
      await fetch(productsApi, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    }
    resetProductForm();
    await renderProducts();
  } catch (err) {
    console.error(err);
    alert('Failed to save product');
  }
});

document.getElementById('p-cancel').addEventListener('click', (e) => {
  e.preventDefault();
  resetProductForm();
});

// Init
resetProductForm();
renderProducts();
renderOrders();
