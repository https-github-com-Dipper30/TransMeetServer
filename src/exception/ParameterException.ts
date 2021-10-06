import BaseException from './BaseException'

class ParameterException extends BaseException {
  
  constructor (message: string = 'Invalid Parameters!', code: number = 40003) {
    super(message, code)
  }
}

export default ParameterException