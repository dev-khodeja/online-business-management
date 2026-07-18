const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());


const products = [
  { productId: 1, name: 'Split AC 1.5 Ton',        category: 'Home Appliances', price: 45000, photo: 'https://images.unsplash.com/photo-1718203862467-c33159fdc504?w=400&h=300&fit=crop&auto=format&q=80', stock: 10 },
  { productId: 2, name: 'Double Door Refrigerator', category: 'Home Appliances', price: 38000, photo: 'https://images.unsplash.com/photo-1631048500348-35da7398a264?w=400&h=300&fit=crop&auto=format&q=80', stock: 12 },
  { productId: 3, name: 'Front Load Washing Machine', category: 'Home Appliances', price: 29500, photo: 'https://images.unsplash.com/photo-1622473590925-e3616c0a41bf?w=400&h=300&fit=crop&auto=format&q=80', stock: 14 },
  { productId: 4, name: 'Microwave Oven 25L',       category: 'Home Appliances', price: 9500,  photo: 'https://images.unsplash.com/photo-1596552183299-000ef779e88d?w=400&h=300&fit=crop&auto=format&q=80', stock: 20 },
];

let orders = [];
let nextOrderId = 1001;

// ---------- Routes ----------

// 1) Product list
app.get('/api/products', (req, res) => {
  res.json(products);
});

// 2) Order Place
app.post('/api/orders', (req, res) => {
  const { productId, quantity, customerName, phone, address, paymentMethod } = req.body;

  // basic validation
  if (!productId || !quantity || !customerName || !phone || !address) {
    return res.status(400).json({ success: false, message: 'সব তথ্য দিন (product, quantity, name, phone, address)।' });
  }

  const product = products.find(p => p.productId === Number(productId));
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product খুঁজে পাওয়া যায়নি।' });
  }

  if (product.stock < quantity) {
    return res.status(400).json({ success: false, message: 'পর্যাপ্ত Stock নেই।' });
  }


  product.stock -= quantity;

  const order = {
    orderId: nextOrderId++,
    productId: product.productId,
    productName: product.name,
    quantity: Number(quantity),
    totalAmount: product.price * Number(quantity),
    customerName,
    phone,
    address,
    paymentMethod: paymentMethod || 'Cash on Delivery',
    status: 'Order Placed',
    orderDate: new Date().toISOString(),
  };

  orders.push(order);

  console.log('New order placed:', order);

  res.status(201).json({ success: true, message: 'অর্ডার সফলভাবে সম্পন্ন হয়েছে!', order });
});


app.get('/api/orders/:id', (req, res) => {
  const order = orders.find(o => o.orderId === Number(req.params.id));
  if (!order) return res.status(404).json({ success: false, message: 'Order পাওয়া যায়নি।' });
  res.json({ success: true, order });
});


app.get('/api/orders', (req, res) => {
  res.json(orders);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend server চলছে: http://localhost:${PORT}`);
});
