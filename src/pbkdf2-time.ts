import express from 'express'
import {pbkdf2} from 'crypto'
import * as process from 'process'

console.log('worker thread number is : ' + process.env.UV_THREADPOOL_SIZE)

console.time('Hashing1')
pbkdf2('a', 'b', 100_000, 512, 'sha512', ()=>{
  console.timeEnd('Hashing1')
})

console.time('Hashing2')
pbkdf2('a', 'b', 100_000, 512, 'sha512', ()=>{
  console.timeEnd('Hashing2')
})

console.time('Hashing3')
pbkdf2('a', 'b', 100_000, 512, 'sha512', ()=>{
  console.timeEnd('Hashing3')
})

console.time('Hashing4')
pbkdf2('a', 'b', 100_000, 512, 'sha512', ()=>{
  console.timeEnd('Hashing4')
})

console.time('Hashing5')
pbkdf2('a', 'b', 100_000, 512, 'sha512', ()=>{
  console.timeEnd('Hashing5')
})


const pbkdf2Time = express()
pbkdf2Time.listen(40400, '0.0.0.0', async ()=>{
  console.log('server is loaded on : ', 40400)
})
