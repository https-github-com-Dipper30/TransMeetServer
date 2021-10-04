const express = require('express')
const app = express()
const router = require('./router/index.ts')

// import config from './config'
import { enumIncludes } from './utils/tools'

// const { gender } = config
// console.log(enumIncludes(gender, 1)) // true
// for (let i in gender) {
//   console.log(i)
// }

console.log(process.env.BASE_URL)

router(app)

app.listen(3000, '0.0.0.0', () => {
  console.log('hello TransMeet')
})