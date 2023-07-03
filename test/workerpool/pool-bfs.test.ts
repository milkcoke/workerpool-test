import workerpool, {WorkerPool} from 'workerpool'
import {oneSecond} from './oneSecond'

type Task = {
  from: string
  to: string
}

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


function getNext(map: Task) : string[] | undefined {
  return maps.get(map.from)
}
describe('BFS logic', ()=>{
  let pool: WorkerPool


  afterEach(async ()=>{
    await pool?.terminate(true)
  })

  test('bfs test', async ()=>{
    pool = workerpool.pool({
      minWorkers: 0,
      maxWorkers: 5
    })

    const taskQueue : Task[] = [
      {from: 'A', to: 'A'},
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
  })
})
