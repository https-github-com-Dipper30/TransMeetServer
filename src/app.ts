const express = require('express')
const app = express()
const router = require('./router/index.ts')

import { Exception } from './types/common'
// import config from './config'
// import { enumIncludes } from './utils/tools'

// const { gender } = config
// console.log(enumIncludes(gender, 1)) // true
// for (let i in gender) {
//   console.log(i)
// }

app.use(express.json({ limit: '20mb' }))
app.use(express.urlencoded({ extended: true }))

app.all('*', async (req: any, res: any, next: any) => {
  const { origin, Origin, referer, Referer } = req.headers
  const allowOrigin = origin || Origin || referer || Referer || '*'
	res.header('Access-Control-Allow-Origin', allowOrigin)
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, token') // with token
	res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Credentials', true) // with cookies
	res.header('X-Powered-By', 'Express')
	if (req.method == 'OPTIONS') {
  	res.sendStatus(200)
	} else {
    next()
	}
})

console.log(process.env.BASE_URL)

router(app)

// catch exception and log out error message
app.use((err: Exception, req: any, res: any, next: any)=>{
  if (err) {
    let status = err.code ? 200 : 500
    res.status(status).json({
      code: err.code || 500,
      msg: err.message || 'Bad Request',
    })
  }
})

app.listen(3000, '0.0.0.0', () => {
  console.log('hello TransMeet')
})
