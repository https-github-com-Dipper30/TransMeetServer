import BaseException from './BaseException'

class DatabaseException extends BaseException {

  constructor (message: string = 'Database Failure', code: number = 40005) {
    super(message, code)
  }
}

export default DatabaseException