import { Duration } from "luxon";

const parseDuration = (isoDuration) => {
  const parsedDuration = Duration.fromISO(isoDuration);
  let value;
  let unit;

  const totalMinutes = parsedDuration.as("minutes");
  const totalHours = parsedDuration.as("hours");
  const totalDays = parsedDuration.as("days");
  const totalMonths = totalDays / 30;

  if (totalMinutes % 60 !== 0) {
    value = totalMinutes;
    unit = "minutes";
  } else if (totalHours % 24 !== 0) {
    value = totalHours;
    unit = "hours";
  } else if (totalDays % 30 !== 0) {
    value = totalDays;
    unit = "days";
  } else {
    value = totalMonths;
    unit = "months";
  }

  return { value: value, unit: unit };
};

/*const durationToISO = (value, unit) => {
  if (unit === "months") {
    value *= 30;
    unit = "days";
  }

  let duration = {};
  duration[unit] = value;
  return Duration.fromObject(duration).toISO();
};*/

const durationToISO = (value, unit) => {
  let wholeValue = Math.floor(value);
  let fractionalValue = value % 1;

  let duration = {};

  switch (unit) {
    case "months":
      //duration = { months: wholeValue };
      //addFractionalDays(duration, fractionalValue);
      duration = { days: wholeValue * 30 };
      duration.hours = fractionalValue * 24 * 30;
      break;
    case "days":
      duration = { days: wholeValue };
      duration.hours = fractionalValue * 24;
      break;
    case "hours":
      duration = { hours: wholeValue, minutes: fractionalValue * 60 };
      break;
    case "minutes":
      duration = { minutes: wholeValue, seconds: fractionalValue * 60 };
      break;
    default:
      throw new Error(`Unsupported unit: ${unit}`);
  }

  return Duration.fromObject(duration).toISO();
};

const addFractionalDays = (duration, fractionalValue) => {
  const daysInMonth = 30; // Assuming each month has 30 days
  let daysToAdd = Math.floor(fractionalValue * daysInMonth);

  if (daysToAdd > 0) {
    if (!duration.days) {
      duration.days = daysToAdd;
    } else {
      duration.days += daysToAdd;
    }
  }

  const remainingFraction = fractionalValue - daysToAdd / daysInMonth;
  duration.hours = remainingFraction * 24;
};

export { parseDuration, durationToISO };
