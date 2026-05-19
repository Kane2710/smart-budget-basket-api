const express = require("express");
const cors = require("cors");

const { products } = require("./data");
const {
  calculateBasketTotal,
  checkBudgetStatus
} = require("./budgetService");

const app = express();

app.use(cors());
app.use(express.json());

let basket = [];
let weeklyBudget = 50;

app.get("/", (req, res) => {
  res.json({
    message: "Smart Budget Basket API",
    availableEndpoints: [
      "GET /health",
      "GET /products",
      "POST /basket",
      "GET /basket/total",
      "POST /budget",
      "GET /basket/status",
      "DELETE /basket"
    ]
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    service: "Smart Budget Basket API"
  });
});

app.get("/products", (req, res) => {
  res.json({
    products
  });
});

app.post("/basket", (req, res) => {
  const productId = Number(req.body.productId);
  const quantity = Number(req.body.quantity || 1);

  if (!productId || quantity <= 0) {
    return res.status(400).json({
      error: "Valid productId and quantity are required"
    });
  }

  const product = products.find((item) => item.id === productId);

  if (!product) {
    return res.status(404).json({
      error: "Product not found"
    });
  }

  const basketItem = {
    productId: product.id,
    name: product.name,
    supermarket: product.supermarket,
    price: product.price,
    quantity
  };

  basket.push(basketItem);

  res.status(201).json({
    message: "Product added to basket",
    basket
  });
});

app.get("/basket/total", (req, res) => {
  const total = calculateBasketTotal(basket);

  res.json({
    basket,
    total
  });
});

app.post("/budget", (req, res) => {
  const amount = Number(req.body.amount);

  if (!amount || amount <= 0) {
    return res.status(400).json({
      error: "A valid budget amount is required"
    });
  }

  weeklyBudget = amount;

  res.json({
    message: "Weekly budget updated",
    weeklyBudget
  });
});

app.get("/basket/status", (req, res) => {
  const total = calculateBasketTotal(basket);
  const status = checkBudgetStatus(total, weeklyBudget);

  res.json(status);
});

app.delete("/basket", (req, res) => {
  basket = [];

  res.json({
    message: "Basket cleared",
    basket
  });
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Smart Budget Basket API is running on port ${PORT}`);
  });
}

module.exports = app;