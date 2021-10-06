import BaseException from './BaseException'

class AuthException extends BaseException {

  constructor (message: string = 'Auth Failure', code: number = 10004) {
    super(message, code)
  }
}

export default AuthException