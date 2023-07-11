import workerpool from 'workerpool'
import Task from './task'

/**
 * Dedicated worker which have external function
 */
workerpool.worker({
  oneSecond: oneSecond,
})
/**
 * Note: Functions passed from the main process to a child process can't container
 * references to externally defined functions or variables
 * since the function is serialized and send to the worker
 * @param {Task} map
 * @returns {Promise<void>}
 */
export async function oneSecond(map: Task): Promise<void> {
  const secondAfter = Date.now() + 1
  wait(secondAfter)
  console.log(`${map.to} is done!`)
}



function wait(second: number): void {
  while (Date.now() < second) {}
}
