import workerpool from 'workerpool'

const pool = workerpool.pool({
  minWorkers: 0,
  maxWorkers: 6,
  workerType: 'thread',
});

function sleep(taskName: number | string) {
  console.time(taskName.toString())

  const wakeUpTime = Date.now() + 1_000;
  while (Date.now() < wakeUpTime) {}

  console.timeEnd(taskName.toString())
}


async function run(): Promise<void> {
  const promises = []
  const tasks = ['one', 'two', 'three', 'four', 'five', 'six']
  console.time('All Tasks')
  await Promise.allSettled(tasks.map(task=>{
    console.log(`======${task}====`)
    console.dir(pool.stats())
    return pool.exec(sleep, ['task'])
  }))
  console.timeEnd('All Tasks')
}

run()
  .then(()=>console.log('Done'))
  .then(async ()=>{
    // how to remove idle workers
    await pool.terminate()
    console.dir(await pool.stats())
  })

