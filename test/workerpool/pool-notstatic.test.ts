import workerpool from 'workerpool'
import {join} from 'path'
import Task from '../../src/workerpool/task'
import {oneSecond} from '../../src/workerpool/worker.helper2'


const maps = new Map<string, string[]>()
// 먼저 이렇게 map 정보를 가지지 않음.
// 동적으로 가져와야함..

// 1depth
maps.set('A', ['B', 'C', 'D'])
// 2depth
maps.set('B', ['E'])
maps.set('D', ['F'])
// 3depth
maps.set('F', ['G'])

describe('pool-nonstatic', ()=>{

  test('fail - nonstatic test', async ()=> {
    const pool = workerpool.pool({
      minWorkers: 0,
      maxWorkers: 5,
    })

    const task = new Task('A', 'A')
    const taskQueue : Task[] = [
      task
    ]

    const poolPromiseQueue = []

    console.time('tasks')

    // task 개수만큼 끊기 == depth 별로 진행
    while(taskQueue.length !== 0) {

      const currentDepthSize = taskQueue.length

      // 해당 depth 개수만큼 진행
      for (let i = 0; i < currentDepthSize; i++) {
        const task = taskQueue.pop()
        poolPromiseQueue.push(pool.exec(oneSecond, [task]))

        // 매핑후 테스크 추가
        if (maps.has(task.to)) {
          // 실전 코드에선 여기서 매핑정보를 불러와서 동적으로 다음 테스크 추가
          const nexts = maps.get(task.to)
          for (const next of nexts) {
            taskQueue.push({
              from: task.to,
              to: next
            })
          }
        }
      }

      await Promise.all(poolPromiseQueue)
    }

    await pool.terminate(true)

    console.timeEnd('tasks')
    }
  )

  test('success - dedicated workerpool', async ()=>{
    const pool = workerpool.pool(join(__dirname, '../../dist/src', 'workerpool', 'wait-worker.js'), {
      minWorkers: 0,
      maxWorkers: 5,
      workerType: 'thread',
      //@ts-ignore
      maxQueueSize: 30
    })

    console.dir(pool)

    const task = new Task('A', 'A')
    const taskQueue : Task[] = [
      task
    ]

    const poolPromiseQueue = []

    console.time('tasks')

    while(taskQueue.length !== 0) {

      const currentDepthSize = taskQueue.length

      for (let i = 0; i < currentDepthSize; i++) {
        const task = taskQueue.pop()
        poolPromiseQueue.push(pool.exec('oneSecond', [task]))

        if (maps.has(task.to)) {
          // 실전 코드에선 여기서 매핑정보를 불러와서 동적으로 다음 테스크 추가
          const nexts = maps.get(task.to)
          for (const next of nexts) {
            taskQueue.push({
              from: task.to,
              to: next
            })
          }
        }
      }

      console.dir(pool.stats())
      await Promise.all(poolPromiseQueue)
    }

    console.dir(pool.stats())
    console.timeEnd('tasks')
  })
})
