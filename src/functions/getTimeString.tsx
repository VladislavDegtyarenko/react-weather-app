/**
 * Get a formatted time string based on the provided date or timestamp.
 * @param {GetTimeStringProps} props - The properties object.
 * @param {Date} props.date - The optional date object.
 * @param {number} props.timestamp - The optional timestamp value.
 * @returns {string | undefined} - The formatted time string or undefined if no valid input is provided.
 */

const getTimeString = (time: Date | number) => {
  if (time instanceof Date) {
    return time.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  }

  return new Date(time).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};

export default getTimeString;
