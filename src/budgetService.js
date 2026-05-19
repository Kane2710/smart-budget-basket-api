function calculateBasketTotal(items) {
  const total = items.reduce((sum, item) => {
    return sum + Number(item.price) * Number(item.quantity);
  }, 0);

  return Number(total.toFixed(2));
}

function checkBudgetStatus(total, budget) {
  const remaining = Number((budget - total).toFixed(2));

  return {
    total,
    budget,
    remaining,
    status: total > budget ? "Over budget" : "Within budget"
  };
}

module.exports = {
  calculateBasketTotal,
  checkBudgetStatus
};