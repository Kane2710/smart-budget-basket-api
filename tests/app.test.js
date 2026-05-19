const request = require("supertest");
const app = require("../src/app");

describe("Smart Budget Basket API", () => {
  beforeEach(async () => {
    await request(app).delete("/basket");
    await request(app).post("/budget").send({ amount: 50 });
  });

  test("GET /health returns service status", async () => {
    const response = await request(app).get("/health");

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("OK");
    expect(response.body.service).toBe("Smart Budget Basket API");
  });

  test("GET /products returns product list", async () => {
    const response = await request(app).get("/products");

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body.products)).toBe(true);
    expect(response.body.products.length).toBeGreaterThan(0);
  });

  test("POST /basket adds a product to the basket", async () => {
    const response = await request(app)
      .post("/basket")
      .send({ productId: 1, quantity: 2 });

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe("Product added to basket");
    expect(response.body.basket.length).toBe(1);
  });

  test("GET /basket/total returns correct basket total", async () => {
    await request(app)
      .post("/basket")
      .send({ productId: 1, quantity: 2 });

    const response = await request(app).get("/basket/total");

    expect(response.statusCode).toBe(200);
    expect(response.body.total).toBe(6.4);
  });

  test("GET /basket/status returns Over budget when budget is exceeded", async () => {
    await request(app)
      .post("/basket")
      .send({ productId: 5, quantity: 1 });

    await request(app)
      .post("/budget")
      .send({ amount: 5 });

    const response = await request(app).get("/basket/status");

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("Over budget");
  });
});