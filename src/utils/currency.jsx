const currencyChange = (currency, price) => {
  if (currency == "khr") return price * 4000;
  return price;
};

export { currencyChange };
