import BaseException from './BaseException'

class ConfigException extends BaseException {

  constructor (message: string = 'Auth Failure', code: number = 6000) {
    super(message, code)
  }
}

export default ConfigException