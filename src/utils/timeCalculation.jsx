import moment from "moment";
import dayjs from "dayjs";
import { parseISO } from "date-fns";

// Date formation
const formatDate = (date) => {
  return dayjs(date).format("MMMM DD, YYYY");
};

// Calculate the total hours
const totalHour = (start, end) => {
  const startTime = moment(start, ["h:mm a", "hh:mm a"]);
  const endTime = moment(end, ["h:mm a", "hh:mm a"]);

  const duration = moment.duration(endTime.diff(startTime));
  const hours = duration.hours();
  const minutes = duration.minutes();

  return `${hours}h ${minutes}m`;
};

/**
 *
 * @param {Input start time from user *Fixed} inputStartTime
 * @param {Input end time for user *Fixed} inputEndTime
 * @param {Start time which is booked before} startTime
 * @param {End time which is booked before} endTime
 * @returns
 */
const timeOverlapping = (inputStartTime, inputEndTime, startTime, endTime) => {
  // Time format to 24hours and split by ":" only the first array
  const timeFormation = (time) => {
    return dayjs(time).format("HH:mm");
  };
  // Parse each  input and remaning times using dayjs to 24 hours
  const inputStart = timeFormation(inputStartTime);
  const inputEnd = timeFormation(inputEndTime);

  // Check if the time ranges overlap
  if (
    (inputStart >= startTime && inputStart < endTime) || // Case 1: Input starts inside the range
    (inputEnd > startTime && inputEnd <= endTime) || // Case 2: Input ends inside the range
    (inputStart < startTime && inputEnd > endTime) // Case 3: Input completely covers the range
  ) {
    return true; // Time ranges overlap
  }

  return false; // Time ranges do not overlap
};

// Calculating to indochina format
const parseTimeString = (dateString, timeString) => {
  const date = parseISO(dateString);
  const [time, modifier] = timeString.split(" ");
  let [hours, minutes] = time.split(":");
  if (modifier === "pm" && hours !== "12") {
    hours = parseInt(hours, 10) + 12;
  }
  if (modifier === "am" && hours === "12") {
    hours = 0;
  }
  date.setHours(hours, minutes, 0, 0);
  return date;
};

export { formatDate, totalHour, timeOverlapping, parseTimeString };
