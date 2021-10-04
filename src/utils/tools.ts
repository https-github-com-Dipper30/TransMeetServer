
/**
 * check if the element is contained in Enum's value
 * @param {any} enumType Enum
 * @param {any} el element to check
 * @returns {Boolean}
 */
export function enumIncludes(enumType: any, el: any): Boolean {
  return Object.values(enumType).includes(el)
} 