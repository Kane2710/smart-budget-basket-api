const {
  calculateBasketTotal,
  checkBudgetStatus
} = require("../src/budgetService");

describe("Budget Service", () => {
  test("calculates basket total correctly", () => {
    const items = [
      { price: 3.2, quantity: 2 },
      { price: 2.8, quantity: 1 }
    ];

    const total = calculateBasketTotal(items);

    expect(total).toBe(9.2);
  });

  test("returns Within budget when total is less than budget", () => {
    const result = checkBudgetStatus(30, 50);

    expect(result.status).toBe("Within budget");
    expect(result.remaining).toBe(20);
  });

  test("returns Over budget when total is greater than budget", () => {
    const result = checkBudgetStatus(60, 50);

    expect(result.status).toBe("Over budget");
    expect(result.remaining).toBe(-10);
  });
});