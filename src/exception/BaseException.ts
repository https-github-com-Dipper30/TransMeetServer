import { Exception } from "../types/common"

class BaseException extends Error implements Exception {

  readonly code: number

  constructor (message: string, code: number = 400) {
    super(message)
    this.code = code
  }

}

export default BaseException