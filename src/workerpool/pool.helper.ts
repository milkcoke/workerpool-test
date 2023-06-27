import workerpool from 'workerpool'
import {add} from './add'
// const pool = workerpool.pool({
//   minWorkers: 0,
//   maxWorkers: 10,
// })

const pool = workerpool.pool({
  minWorkers: 1,
  maxWorkers: 3,
  workerType: 'thread',
  workerThreadOpts: {
    workerData: {
      name: 'metadata-test'
    }
  }
});

(async ()=>{
  await pool.exec(add, [0, 5], {
    on: payload => {
      console.log('payload!!!')
      console.dir(payload)
    }
  })

  await pool.terminate()
})()



// pool 내에 하나의 worker 에 일 위임
// method 를 'string' 으로 등록한 경우 해당 문자열이 사전 등록되어 있어야함.
// Otherwise, "Error: Unknown method "add"" print (Message Port 로 주고받는건 마찬가진가보네)
