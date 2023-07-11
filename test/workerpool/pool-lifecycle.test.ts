import workerpool from 'workerpool'
import {join} from 'path'


async function sleep2(ms: number): Promise<void> {
  return new Promise((resolve, reject): void => {
    setTimeout(resolve, ms);
  });
}

describe('Lifecycle',()=>{
  const pool1 = workerpool.pool(join(__dirname, "./sleep.worker.js"),{
    minWorkers: 1,
    maxWorkers: 4
  })


  test('Lifecycle',async (done)=>{
    console.time("sleep")
    await pool1.exec("sleep", [3000, 1])
    console.timeEnd("sleep")

    // await sleep2(3000)
    await pool1.terminate(false)
    // 2번째 풀이 실행 안되면 가설이 맞는거임.
  }, 30_000)
})
