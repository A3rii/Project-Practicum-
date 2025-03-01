import moment from "moment";
const currencyChange = (currency, price) => {
  if (currency == "khr") return price * 4000;
  return price;
};

const totalHourPrice = (start, end, pricePerHour) => {
  const startTime = moment(start, ["h:mm a", "hh:mm a"]);
  const endTime = moment(end, ["h:mm a", "hh:mm a"]);

  const duration = moment.duration(endTime.diff(startTime));
  const hours = duration.hours();
  const minutes = duration.minutes();

  // Convert the duration to decimal hours
  const totalHours = hours + minutes / 60;

  // Calculate the total price
  const totalPrice = parseFloat(totalHours * pricePerHour).toFixed(2);

  return totalPrice;
};

export { currencyChange, totalHourPrice };
