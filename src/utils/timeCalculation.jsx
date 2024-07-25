import moment from "moment";
import dayjs from "dayjs";

export const formatDate = (date) => {
  return dayjs(date).format("MMMM DD, YYYY");
};

// Calculate the total hours
export const totalHour = (start, end) => {
  const startTime = moment(start, ["h:mm a", "hh:mm a"]);
  const endTime = moment(end, ["h:mm a", "hh:mm a"]);

  const duration = moment.duration(endTime.diff(startTime));
  const hours = duration.hours();
  const minutes = duration.minutes();

  return `${hours}h ${minutes}m`;
};
