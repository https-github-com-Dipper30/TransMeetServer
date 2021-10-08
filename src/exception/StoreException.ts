import BaseException from './BaseException'

class StoreException extends BaseException {

  constructor (message: string = 'Store Failure', code: number = 70000) {
    super(message, code)
  }
}

export default StoreException