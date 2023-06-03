/**
 * Returns a 3-character weekday string based on the provided weekday number.
 * @param {number} weekdayNumber - The weekday number (0 to 6).
 * @returns {string} The 3-character weekday string.
 * @throws {Error} If the weekday number is invalid.
 */

function getWeekdayString(weekdayNumber: number) {
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  if (weekdayNumber >= 0 && weekdayNumber <= 6) {
    return weekdays[weekdayNumber];
  } else {
    throw new Error("Invalid weekday number. It should be between 0 and 6.");
  }
}

export default getWeekdayString;
