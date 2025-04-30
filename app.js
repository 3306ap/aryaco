// Replace with your deployed Apps Script URL
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzCsDzxwY6tpslnjHNgUBQJ4V46k5dqTATQOfyGrKHhJdCNsklVjPZPqIGNACc7xYI/exec';

// Register Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js');
}

// Fetch and display products
async function loadProducts() {
  const res = await fetch(`${SCRIPT_URL}?sheet=Products`);
  const products = await res.json();
  const container = document.getElementById('products');
  const select = document.getElementById('productSelect');

  products.forEach(p => {
    // Card display
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${p.ImageURL}" alt="${p.Name}">
      <h3>${p.Name}</h3>
      <p>₹${p.Price}</p>
    `;
    container.appendChild(card);

    // Select option
    const option = document.createElement('option');
    option.value = p.Name;
    option.textContent = `${p.Name} - ₹${p.Price}`;
    select.appendChild(option);
  });
}

document.getElementById('orderForm').addEventListener('submit', async e => {
  e.preventDefault();
  const data = {
    name: e.target.name.value,
    phone: e.target.phone.value,
    product: e.target.productSelect.value,
    quantity: e.target.quantity.value,
    address: e.target.address.value
  };
  const res = await fetch(SCRIPT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  const result = await res.json();
  document.getElementById('orderStatus').textContent = (result.status === 'success')
    ? 'Order submitted! Thank you.'
    : 'Submission failed. Please try again.';
  e.target.reset();
});

// Initialize
loadProducts();
