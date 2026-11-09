export const cart = [
  { title: "Наушники", price: 12990, qty: 1 },
  { title: "Чехол для телефона", price: 3490, qty: 2 },
  { title: "Зарядное устройство", price: 5990, qty: 1 },
];

const PROMO_CODES = {
  STEP10: 10,
  SHYMKENT15: 15,
};

export function getCartTotal(items) {
  let total = 0;

  for (const item of items) {
    total += item.price * item.qty;
  }

  return total;
}

export function applyPromo(total, code) {
  const normalizedCode = code.replace(/\s/g, "").toUpperCase();
  const discount = PROMO_CODES[normalizedCode];

  if (discount === undefined) {
    return total;
  }

  return Math.round(total * (1 - discount / 100));
}

export function getDeliveryCost(total, city) {
  if (total >= 20000) {
    return 0;
  }

  if (city === "Шымкент") {
    return 1000;
  }

  return 2500;
}
