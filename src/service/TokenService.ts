const jwt = require('jsonwebtoken')
const { TOKEN_PRIVATE_KEY, TOKEN_PUBLIC_KEY, TOKEN_EXPIRE_IN } = require('../config/key')

class Token {

  data: any

  constructor (data: any) {
    this.data = data
  }

  generateToken () {
    const data: {userID: number, auth: number[] } = this.data
    // const created = Math.floor(Date.now() / 1000)
    
    let token = jwt.sign({ ...data }, TOKEN_PRIVATE_KEY, { expiresIn: TOKEN_EXPIRE_IN })
    return token
  }

  verifyToken (requiredAuth?: number) {
    const token = this.data
    try {
      const res: { userID: Number, auth: Number[], iat: Number, exp: Number } = jwt.verify(token, TOKEN_PRIVATE_KEY) || {}
      const { userID, auth, iat, exp = 0 } = res
      const current = Math.floor(Date.now() / 1000)
      // if current timestamp is larger than the expire time, return false
      if (current > exp) return false
      if (requiredAuth && !auth.includes(requiredAuth)) return false
      return res
    } catch (error) {
      return false
    }
  }
}

export default Token