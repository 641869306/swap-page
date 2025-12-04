/**
 * debounce
 * @param {Function} func - the function to debounce
 * @param {number} wait - the wait time (milliseconds)
 * @returns {Function} - the debounced function
 */
export function debounce(func, wait) {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}
