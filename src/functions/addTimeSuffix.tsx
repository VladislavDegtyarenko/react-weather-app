/**
 * Adds a time suffix to a timestamp value.
 *
 * @param {number} timestamp - The timestamp value (milliseconds from 1970).
 * @param {string} [suffix="h"] - The time suffix to append (default: "h").
 * @returns {string} - The timestamp with the appended time suffix.
 */

const addTimeSuffix = (timestamp: number, suffix = "h") => {
  const date = new Date(timestamp * 1000);
  const hours = date.getHours();
  const str = hours + suffix;

  return str;
};

export default addTimeSuffix;
