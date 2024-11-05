export const formatTime = (date: Date): string => {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthsOfYear = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const dayOfWeek = daysOfWeek[date.getUTCDay()];

  let hours = date.getUTCHours() + 3;
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;

  return `${dayOfWeek} ${displayHours}:${minutes}${period}`;
};

export const getLastSeen = (
  updated: Date | string | undefined
): boolean | string | undefined => {
  // const date = updated ? new Date(updated) : new Date();
  if (!updated) {
    return;
  }
  const date = updated ? new Date(updated) : new Date();
  const now = new Date();
  const timeDifference = now.getTime() - date.getTime();
  // Define time intervals in milliseconds
  const minute = 60 * 1000;
  const hour = minute * 60;
  const day = hour * 24;
  const week = day * 7;
  const month = day * 30;
  const year = day * 365;

  if (timeDifference < minute) {
    const secondsAgo = Math.floor(timeDifference / 1000);
    return `${secondsAgo} ${secondsAgo === 1 ? "secs" : "secs"} ago`;
  } else if (timeDifference < hour) {
    const minutesAgo = Math.floor(timeDifference / minute);
    return `${minutesAgo} ${minutesAgo === 1 ? "min" : "mins"} ago`;
  } else if (timeDifference < day) {
    const hoursAgo = Math.floor(timeDifference / hour);
    return `${hoursAgo} ${hoursAgo === 1 ? "hrs" : "hrs"} ago`;
  } else if (timeDifference < week) {
    const daysAgo = Math.floor(timeDifference / day);
    return `${daysAgo} ${daysAgo === 1 ? "day" : "days"} ago`;
  } else if (timeDifference < month) {
    const weeksAgo = Math.floor(timeDifference / week);
    return `${weeksAgo} ${weeksAgo === 1 ? "week" : "weeks"} ago`;
  } else if (timeDifference < year) {
    const monthsAgo = Math.floor(timeDifference / month);
    return `${monthsAgo} ${monthsAgo === 1 ? "month" : "months"} ago`;
  } else if (timeDifference > year) {
    const yearsAgo = Math.floor(timeDifference / year);
    return `${yearsAgo} ${yearsAgo === 1 ? "year" : "years"} ago`;
  } else {
    return false;
  }
};

type Time = {
  duration: number;
  type: string;
};

export const convertDays = (days: number): Time => {
  if (days < 0) {
    const r: Time = { duration: 0, type: "Hours" };
    return r;
  }

  if (days > 1 && days < 7) {
    const r: Time = { duration: days, type: `Day${days !== 1 ? "s" : ""}` };
    return r;
  }

  if (days < 1) {
    const hours = days * 24;
    const r: Time = { duration: hours, type: `Hour${hours !== 1 ? "s" : ""}` };
    return r;
  }

  if (days >= 90 && days < 365) {
    const months = Math.floor(days / 30);
    // const remainingDays = days % 30;
    const r: Time = {
      duration: months,
      type: `Month${months !== 1 ? "s" : ""}`,
    };
    return r;
  }

  if (days >= 365) {
    let years = Math.floor(days / 365);

    if (years > 1) {
      years = 1;
    }

    // const remainingDays = days % 30;
    const r: Time = {
      duration: years,
      type: `Year${years !== 1 ? "s" : ""}`,
    };
    return r;
  }

  if (days >= 7 && days < 90) {
    const weeks = Math.floor(days / 7);
    const r: Time = { duration: weeks, type: `Week${weeks !== 1 ? "s" : ""}` };

    return r;
  }

  return {
    duration: 1,
    type: "",
  };
};

export const formatDateToISO = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const offsetMinutes = date.getTimezoneOffset();
  const offsetHours = Math.abs(offsetMinutes / 60);
  const offsetSign = offsetMinutes < 0 ? "+" : "-";

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${offsetSign}${String(
    offsetHours
  ).padStart(2, "0")}:${String(Math.abs(offsetMinutes % 60)).padStart(2, "0")}`;
};

export const dayTimeFormat = (timestamp: string | Date): string => {
  // Create a Date object from the input string
  const date = new Date(timestamp);

  // Calculate the difference in years between now and the timestamp
  const now = new Date();
  const yearDifference = now.getFullYear() - date.getFullYear();
  const shouldIncludeYear =
    yearDifference > 1 ||
    (yearDifference === 1 &&
      (now.getMonth() > date.getMonth() ||
        (now.getMonth() === date.getMonth() &&
          now.getDate() >= date.getDate())));

  // Define options for the date part
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "short",
    day: "numeric",
    month: "short", // Using short month format (e.g., Aug)
  };

  // Get the time in 12-hour format with AM/PM
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12; // Convert to 12-hour format
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  // Format the date part without the year
  const formattedDate = date.toLocaleDateString("en-US", dateOptions);

  // Append the year if required
  const year = shouldIncludeYear ? ` ${date.getFullYear()}` : "";

  // Combine time and date parts
  return `${formattedDate}, ${formattedHours}:${formattedMinutes}${ampm}${year}`;
};

// Example usage:
const formattedDate = dayTimeFormat("2024-08-15T09:00:00.000Z");
console.log(formattedDate); // Output: "Thu 15 Aug, 09:00AM 2024"
