(async () => {
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const healthUrl = 'http://localhost:3000/health';
  // wait for server
  for (let i = 0; i < 15; i++) {
    try {
      const res = await fetch(healthUrl);
      if (res.ok) {
        console.log('health ok');
        break;
      }
    } catch (e) {
      process.stdout.write('.');
      await sleep(1000);
    }
    if (i === 14) {
      console.error('\nServer did not become ready in time');
      process.exit(1);
    }
  }

  // create product
  const prodRes = await fetch('http://localhost:3000/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Smoke Product', description: 'Created by smoke test', price: 19.99, stock: 5 })
  });
  const prod = await prodRes.json();
  console.log('\n--- CREATED PRODUCT ---');
  console.log(JSON.stringify(prod, null, 2));

  // list products
  const allRes = await fetch('http://localhost:3000/api/products');
  const all = await allRes.json();
  console.log('\n--- ALL PRODUCTS ---');
  console.log(JSON.stringify(all, null, 2));

  // create order
  const orderRes = await fetch('http://localhost:3000/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId: prod._id, quantity: 2, customerName: 'Smoke Buyer', customerEmail: 'buyer@example.com' })
  });
  const order = await orderRes.json();
  console.log('\n--- CREATED ORDER ---');
  console.log(JSON.stringify(order, null, 2));

  // list orders
  const ordersRes = await fetch('http://localhost:3000/api/orders');
  const orders = await ordersRes.json();
  console.log('\n--- ALL ORDERS ---');
  console.log(JSON.stringify(orders, null, 2));

  process.exit(0);
})();
