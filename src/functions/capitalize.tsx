/** Function that capitalizes the string, converting the first character to uppercase
 * @param {string} text - provided string
 * @returns {string} - Capitalized string
 */

const capitalize = (text: string) => {
  return text[0].toUpperCase() + text.slice(1);
};

export default capitalize;
