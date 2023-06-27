import workerpool, {Promise, WorkerPool, WorkerPoolStats} from 'workerpool'
import {add} from '../../src/workerpool/add'

function sleep(taskName: number | string) {
  console.time(taskName.toString())

  const wakeUpTime = Date.now() + 1_000;
  while (Date.now() < wakeUpTime) {}

  console.timeEnd(taskName.toString())
}

describe('WorkerPoolOptions', ()=>{
  let pool: WorkerPool

  afterEach(async ()=>{
    await pool?.terminate(true)
  })


  test('Total worker is 0 before task is dedicated', async ()=>{
    // Arrange
    pool = workerpool.pool({
      minWorkers: 0,
      maxWorkers: 10
    })

    // Action
    const poolStats = pool.stats()

    const expectedStats: WorkerPoolStats = {
      totalWorkers: 0,
      busyWorkers: 0,
      idleWorkers: 0,
      pendingTasks: 0,
      activeTasks: 0
    }

    // Assert
    expect(poolStats).toEqual(expectedStats)
  })


  test('Total worker follows min workers and they are idle state', async ()=>{
    // Arrange
    pool = workerpool.pool({
      minWorkers: 5,
      maxWorkers: 10,
    })

    // Action
    const poolStats = pool.stats()

    const expectedStats: WorkerPoolStats = {
      totalWorkers: 5,
      busyWorkers: 0,
      idleWorkers: 5,
      pendingTasks: 0,
      activeTasks: 0
    }

    // Assert
    expect(poolStats).toEqual(expectedStats)
  })

  test('Worker is busy while dedicating task', async ()=>{
    // Arrange
    pool = workerpool.pool({
      minWorkers: 5,
      maxWorkers: 10,
    })

    // Action
    const result = await pool.exec(add, [7, -14])
    expect(result).toBe(-7)
    const poolStats = pool.stats()

    const afterStats: WorkerPoolStats = {
      totalWorkers: 5,
      busyWorkers: 0,
      idleWorkers: 5,
      pendingTasks: 0,
      activeTasks: 0
    }

    // Assert
    expect(poolStats).toEqual(afterStats)
  })

  test('WorkerPool have no worker after terminate() to be called', async ()=>{

    // Arrange
    pool = workerpool.pool({
      minWorkers: 5,
      maxWorkers: 10,
    })

    // Action
    await pool.exec(add, [7, -14])
    await pool.terminate()

    const afterTerminateStats = pool.stats()
    const expectedTerminateStats = {
      totalWorkers: 0,
      busyWorkers: 0,
      idleWorkers: 0,
      pendingTasks: 0,
      activeTasks: 0
    }

    // Assert
    expect(afterTerminateStats).toEqual(expectedTerminateStats)
  })

  test('workerThreadOpts', async ()=>{
    // Arrange
    pool = workerpool.pool({
      minWorkers: 1,
      maxWorkers: 3,
      workerType: 'thread',
      workerThreadOpts: {
        workerData: {
          name: 'metadata-test'
        }
      }
    })

    // How to receive metadata from parent?
    const workerThreads = await import('worker_threads')
    const metadata = workerThreads.workerData

    console.dir(metadata)
    await pool.exec(add, [0, 5])
  })

  test('workerData', async ()=>{
    console.dir(workerpool.cpus)
  })

  test('min 2 max 4 with queue',async ()=>{
    // 끝나지 않은 일이 생겨서 maxPort issue 가 생겼던 것임.

    pool = workerpool.pool({
      minWorkers: 2,
      maxWorkers: 4,
      workerType: 'thread',
    })

    console.dir(pool.stats())
    await pool.exec(sleep,['one'])

    console.dir(pool.stats())
  })
})
