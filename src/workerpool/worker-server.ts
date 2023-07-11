import workerpool from 'workerpool'
import {join} from 'path'
import express from 'express'
const workerPath = join(__dirname, "worker.helper.js");


const pool = workerpool.pool(workerPath, {
  minWorkers: 0,
  maxWorkers: 4,
  workerType: "thread",
});

const app = express()

app.get('/status', (req, res)=>{
  const poolStatus = pool.stats()
  console.dir(poolStatus)
  return res.json(poolStatus)
})

app.get('/gc', (req,res)=>{
  if (global.gc) {
    console.log('GC done!')
    global.gc()
    return res.json("Garbage collection done")
  }

  return res.json("No GC")
})

app.listen(3000, async ()=>{
  console.log('Global Pool is created!')

  const promiseQueue = []
  for (let i = 0; i < 4; i++) {
    promiseQueue.push(pool.exec('oneSecond', []))
  }
  await Promise.allSettled(promiseQueue)
})

