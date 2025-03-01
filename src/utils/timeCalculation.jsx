import moment from "moment";
import dayjs from "dayjs";
import { parseISO } from "date-fns";

// Date formation
const formatDate = (date) => {
  return dayjs(date).format("MMMM DD, YYYY");
};

// Time formatter
const formatTime = (time) => {
  return dayjs(time).format("hh:mm a");
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

const parseTimeToDate = (time) => {
  const [timePart, modifier] = time.split(" ");
  let [hours, minutes] = timePart.split(":");

  // Convert the hours to 24-hour format
  if (modifier.toLowerCase() === "pm" && hours !== "12") {
    hours = parseInt(hours, 10) + 12; // Add 12 to convert to 24-hour time
  } else if (modifier.toLowerCase() === "am" && hours === "12") {
    hours = 0; // Midnight case
  }

  // Create a new Date object with today's date and the parsed time
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
};

// Cambodian TimeZone formatation
const cambodianTimeZone = () => {
  const date = new Date();
  const cambodianHourMinute = date.toLocaleTimeString("en-US", {
    timeZone: "Asia/Phnom_Penh",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return cambodianHourMinute;
};

// In range time
const inRangeTime = (startTime, endTime) => {
  const currentTime = new Date();

  // Convert start and end times to Date objects for today
  const [startHours, startMinutes] = startTime.split(":").map(Number);
  const [endHours, endMinutes] = endTime.split(":").map(Number);

  const start = new Date(currentTime);
  start.setHours(startHours, startMinutes, 0, 0);

  const end = new Date(currentTime);
  end.setHours(endHours, endMinutes, 0, 0);

  // Check if the current time is within the range
  return currentTime >= start && currentTime <= end;
};

const convertTo24Hour = (time) => {
  const [hour, minute, period] = time.match(/(\d+):(\d+)\s*(AM|PM)/i).slice(1);
  let hours = parseInt(hour, 10);
  const minutes = parseInt(minute, 10);
  if (period.toUpperCase() === "PM" && hours !== 12) hours += 12;
  if (period.toUpperCase() === "AM" && hours === 12) hours = 0;
  return `${hours}:${minutes}`;
};

export {
  formatDate,
  formatTime,
  inRangeTime,
  totalHour,
  timeOverlapping,
  parseTimeString,
  parseTimeToDate,
  cambodianTimeZone,
  convertTo24Hour,
};
