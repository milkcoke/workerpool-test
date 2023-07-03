type Task = {
  from: string
  to: string
}
export function oneSecond(map: Task) {
  const secondAfter = Date.now() + 1_000
  while (Date.now() < secondAfter) {}
  console.log(`${map.to} is done!`)
}
