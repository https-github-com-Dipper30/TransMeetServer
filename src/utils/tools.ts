const crypto = require('crypto')
const { MD5_PRIVATE_KEY } = require('../config/key')

const attrs: string[] = [
  'createdAt',
  'updatedAt'
]

/**
 * check if the element is contained in Enum's value
 * @param {any} enumType Enum
 * @param {any} el element to check
 * @returns {Boolean}
 */
export const enumIncludes = (enumType: any, el: any): Boolean => Object.values(enumType).includes(el)

/**
 * to filter unwanted fields in an array or an object
 * @param {object} rawData data that needs filtering
 * @param attrsToOmit attributes that are unwanted
 * @returns data after filtering
 */
export const omitFields = (rawData: any, attrsToOmit: string[] = attrs): ThisType<any> => {
  if (!rawData) return rawData
  rawData = JSON.parse(JSON.stringify(rawData))
  // check data type
  if (rawData instanceof Array) {
    return rawData.map(data => {
      Object.keys(data).forEach(attr => {
        if (attrsToOmit.includes(attr)) delete data[attr]
      })
      return data
    })
  } else {
    Object.keys(rawData).forEach(attr => {
      if (attrsToOmit.includes(attr)) delete rawData[attr]
    })
    return rawData
  }
}

export const encryptMD5 = (plainText: string) => {
  return crypto.createHash('md5').update(plainText).update(MD5_PRIVATE_KEY).digest('hex')
}
