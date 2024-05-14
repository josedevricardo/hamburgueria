const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());

// Middleware para log de requisições
app.use((req, res, next) => {
  console.log(`[${req.method}] - ${req.originalUrl}`);
  next();
});

// Middleware para verificar se o ID existe
const checkIdMiddleware = (req, res, next) => {
  // Simulação de IDs existentes
  const existingIds = orders.map(order => order.id);

  if (!existingIds.includes(req.params.id)) {
    return res.status(404).json({ error: 'Pedido não encontrado.' });
  }

  next();
};

// Simulação de um banco de dados temporário
let orders = [];

// Rotas

app.post('/order', (req, res) => {
  const { order, clientName, price } = req.body;
  const id = uuidv4();
  const newOrder = { id, order, clientName, price, status: 'Em preparação' };
  orders.push(newOrder);
  res.status(201).json(newOrder);
});

app.get('/order', (req, res) => {
  res.json(orders);
});

app.put('/order/:id', checkIdMiddleware, (req, res) => {
  const { id } = req.params;
  const index = orders.findIndex(order => order.id === id);
  if (index !== -1) {
    orders[index] = { ...orders[index], ...req.body };
    res.json(orders[index]);
  } else {
    res.status(404).json({ error: 'Pedido não encontrado.' });
  }
});

app.delete('/order/:id', checkIdMiddleware, (req, res) => {
  const { id } = req.params;
  orders = orders.filter(order => order.id !== id);
  res.sendStatus(204);
});

app.get('/order/:id', checkIdMiddleware, (req, res) => {
  const { id } = req.params;
  const foundOrder = orders.find(order => order.id === id);
  res.json(foundOrder);
});

app.patch('/order/:id', checkIdMiddleware, (req, res) => {
  const { id } = req.params;
  const index = orders.findIndex(order => order.id === id);
  if (index !== -1) {
    orders[index].status = 'Pronto';
    res.json(orders[index]);
  } else {
    res.status(404).json({ error: 'Pedido não encontrado.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
