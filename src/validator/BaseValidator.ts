const validator = require('validator')
import { type } from 'os'
import { RegularExpressionLiteral } from 'typescript'
import { Validator } from '../types/common'

class BaseValidator implements Validator {

  params: any
  stringIsDigit: RegExp = /^\d+$/ // check if the string consists of numbers

  constructor (params: any) {
    this.params = params
  }

  checkParams (params: any, rules: string[]): Boolean {
    // 遍历每一个属性名的规则
    for ( let single_rule of rules ) {
      // 将rule字符串转成数组
      let single_rule_arr: string[] = single_rule.split('|')
      const key = single_rule_arr[0]
      const type = single_rule_arr[1]
      // 当指定参数名不存在时，优先校验required属性
      if ( !params.hasOwnProperty(key) ) {
        if ( single_rule_arr.includes('required') ) return false
        else continue
      } else {
        // 此时请求参数中存在规则内的属性名
        // 判断是否可以为空值
        if ( single_rule_arr.includes('allowNull') && params[key] == null ) {
          continue
        }
        switch (type) {
          case 'number': 
            if ( typeof params[key] != 'number' ) return false
            break
          case 'string': 
            if ( typeof params[key] != 'string' ) return false
            break;
          case 'boolean': 
            if ( !validator.isBoolean(params[key]) ) return false
            break
          case 'date':
            if ( !validator.isDate(params[key]) ) return false
            break
          case 'timestamp':
            if ( !this.isTimeStamp(params[key]) ) return false
            break
          case 'unixTimestamp':
            if ( !this.isUnixTimeStamp(params[key]) ) return false
            break
          default:
            break
        }
      }
    }
    return true
  }

  // check for queries where all values are string
  checkQuery (params: any, rules: string[]): Boolean {
      // 遍历每一个属性名的规则
    for ( let single_rule of rules ) {
      // 将rule字符串转成数组
      let single_rule_arr: string[] = single_rule.split('|')
      const key = single_rule_arr[0]
      const type = single_rule_arr[1]
      // 当指定参数名不存在时，优先校验required属性
      if ( !params.hasOwnProperty(key) ) {
        if ( single_rule_arr.includes('required') ) return false
        else continue
      } else {
        // 此时请求参数中存在规则内的属性名
        // 判断是否可以为空值
        if ( single_rule_arr.includes('allowNull') && params[key] == null ) {
          continue
        }
        switch (type) {
          case 'number': 
            if ( typeof params[key] != 'number' && !this.stringConsistsOfDigits(params[key]) ) return false
            params[key] = Number(params[key])
            break
          case 'string': 
            if ( typeof params[key] != 'string' ) return false
            break
          case 'boolean': 
            if ( !validator.isBoolean(params[key]) && this.stringIsBoolean(params[key]) ) return false
            params[key] = Boolean(params[key])
            break
          case 'timestamp':
            if ( !this.stringConsistsOfDigits(params[key]) ) return false
            params[key] = Number(params[key])
            if ( !this.isTimeStamp(params[key]) ) return false
            break
          case 'unixTimestamp':
            if ( !this.stringConsistsOfDigits(params[key]) ) return false
            params[key] = Number(params[key])
            if ( !this.isUnixTimeStamp(params[key]) ) return false
            break
          default:
            break
        }
      }
    }
    return params
  }

  isPositiveInteger (n: any): Boolean {
    return Boolean(n) && typeof n == 'number'
  }

  // unix timestamp must be 13 digits
  isTimeStamp (ts: number): Boolean {
    return Boolean(ts) && typeof ts == 'number' && ts.toString().length === 13
  }

  // unix timestamp must be 10 digits
  isUnixTimeStamp (ts: number): Boolean {
    return Boolean(ts) && typeof ts == 'number' && ts.toString().length === 10
  }

  // check zip code, 5-digit long
  isZipCode (code: any): Boolean {
    return Boolean(code) && typeof code == 'number' && code.toString.length == 5
  }

  // check if the number is between min and max
  // or check if the length of string is between min and max
  isBetween (p: any, min: number, max: number): Boolean {
    return Boolean(p) 
    && (typeof p == 'number' && p >= min && p <= max)
    || (typeof p == 'string' && p.length >= min && p.length <=max)
  }

  // check if the length of name is between [3, 15]
  // you can use function isBetween of course, but this is more convenient in particular cases
  isShortName (p: any): Boolean {
    return this.isBetween(p, 3, 15)
  }

  isLongName (p: any): Boolean {
    return this.isBetween(p, 5, 30)
  }

  stringConsistsOfDigits (s: string): Boolean {
    return this.stringIsDigit.test(s)
  }

  stringIsBoolean (s: string): Boolean {
    return s == 'false' || s == 'true'
  }

}

module.exports = BaseValidator