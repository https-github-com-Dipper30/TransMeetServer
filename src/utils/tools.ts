import BaseException from '../exception/BaseException'

const crypto = require('crypto')
const { MD5_PRIVATE_KEY } = require('../config/key')

const attrs: string[] = [
  'createdAt',
  'updatedAt',
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

/**
 * check if the parameter is an instance of Error
 * @param {any} p  
 * @returns 
 */
export const isError = (p: any) => {
  return p instanceof BaseException || p instanceof Error
}

/**
 * create an object including all criteria for dynamic searching
 * @param {object} o
 * @returns {object} criteria for where matching
 */

export const createCriteria = (o: any, attrs?: string[]|null) => {
  if (!(o instanceof Object)) return {}
  let criteria = {}
  // if attrs is provided, iterate the array
  // if the attribute does not exist in object, ignore it
  if (attrs) {
    for (let attribute of attrs) {
      if (o.hasOwnProperty(attribute) && !criteria.hasOwnProperty(attribute)) {
        Object.defineProperty(criteria, attribute, {
          value: o[attribute],
          enumerable: true,
          writable: true,
        })
      }
    }
  } else {
    for (let attribute in o) {
      if (!criteria.hasOwnProperty(attribute)) {
        Object.defineProperty(criteria, attribute, {
          value: o[attribute],
          enumerable: true,
          writable: true,
        })
      }
    }
  }
  return criteria
}