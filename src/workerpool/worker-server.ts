import workerpool, {WorkerPool} from 'workerpool'
import bytes from 'bytes'
import {join} from 'path'
import express from 'express'
import * as process from 'process'
const workerPath = join(__dirname, "worker.helper.js");
const workerPrintPath = join(__dirname, 'worker-id.helper.js')

console.log('process id : ', process.pid)

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

// --v8-pool-size : nodejs 쓰레드수 최대값
// process.env.UV_THREADPOOL_SIZE 워커 쓰레드 수 최대값
let id = 1
let localPool : WorkerPool
app.get('/status/local', async (req, res)=>{
  console.time('local workerpool')
  localPool = workerpool.pool(workerPrintPath, {
    minWorkers: 50,
    maxWorkers: 50,
    workerType: "thread"
  })

  await localPool.exec('oneSecondAndPrint', [id++])
  const poolStatus = localPool.stats()
  console.dir(poolStatus)
  console.log('========memory usage========')
  const memory = process.memoryUsage()
  console.log(`heap Total : ${bytes(memory.heapTotal)}`)
  console.log(`heap Used : ${bytes(memory.heapUsed)}`)
  console.timeEnd('local workerpool')
  return res.json(process.memoryUsage())
})

app.get('/thread/terminate', async (req, res)=>{

  await localPool.terminate(true)
  return res.json("terminated local pool")
})

app.get('/gc', (req,res)=>{
  if (global.gc) {
    console.time('gc task')
    global.gc()
    console.timeEnd('gc task')
    console.log('GC done!')
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

