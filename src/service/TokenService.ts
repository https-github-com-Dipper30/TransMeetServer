const jwt = require('jsonwebtoken')
const { TOKEN_PRIVATE_KEY, TOKEN_PUBLIC_KEY, TOKEN_EXPIRE_IN } = require('../config/key')

class Token {

  data: object

  constructor (data: object) {
    this.data = data
  }

  generateToken () {
    const data = this.data
    const created = Math.floor(Date.now() / 1000)
    let token = jwt.sign({ ...data }, TOKEN_PRIVATE_KEY, { expiresIn: created + TOKEN_EXPIRE_IN })
    return token
  }

  verifyToken () {
    const token = this.data
    try {
      const res = jwt.verify(token, TOKEN_PRIVATE_KEY) || {}
      const { data, exp = 0 } = res, current = Math.floor(Date.now() / 1000)
      // somehow the timestamp of exp is twice the actual time, so we will use a exp/2 here
      // if current timestamp is larger than the expire time, return false
      if (current > exp/2) return false
      return data
    } catch (error) {
      return false
    }
  }
}

export default Token