const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());


const products = [
  { productId: 1, name: 'Split AC 1.5 Ton',      category: 'Home Appliances',  price: 45000, photo: 'https://images.unsplash.com/photo-1718203862467-c33159fdc504?w=400&h=300&fit=crop&auto=format&q=80',    stock: 10 },
  { productId: 2, name: 'Office Chair (Ergonomic)', category: 'Office Equipment', price: 8500,  photo: 'https://images.unsplash.com/photo-1688578735352-9a6f2ac3b70a?w=400&h=300&fit=crop&auto=format&q=80', stock: 15 },
  { productId: 3, name: "Men's Formal Shirt",     category: 'Men Clothing',    price: 1200,  photo: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=300&fit=crop&auto=format&q=80', stock: 30 },
  { productId: 4, name: 'Smartphone X200',        category: 'Electronic Gadgets', price: 32000, photo: 'https://images.unsplash.com/photo-1578242174372-e26b3681587f?w=400&h=300&fit=crop&auto=format&q=80', stock: 8 },
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