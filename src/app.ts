const express = require('express')
const app = express()
const router = require('./router/index.ts')
const fs = require('fs')

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

app.use(express.static('dist'))

app.get('*', async (req: any, res: any, next: any) => {
  // if (req.url)
  
  if(req.url.substr(0, 4) != '/api') {
    // res.writeHead(200, {
    //   'Content-Type': 'text/html',
    // })
    
    // res.end('dist/index.html')
    fs.readFile('dist/index.html', function (err: any, data: any) {
      if (err) {
        res.writeHead(404)
        res.end(JSON.stringify(err))
        return
      }
      res.writeHead(200)
      res.end(data)
    })
  }
  else next()
})

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

// check token
// app.use('/', async (req: any, res: any, next: any) => {
//   console.log(req.url)
//   // if ( tokenFreeUrls.includes(req.url) ) {
//   //   next()
//   //   return
//   // }
//   const token = String(req.headers.token)
//   if ( !token || token == 'undefined' ) {
//     res.status(200).json({
//       code: 10002,
//       msg: 'Token Failure',
//     })
//   } else {
//     next()
//   }
// })

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
