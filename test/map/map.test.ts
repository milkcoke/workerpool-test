
function print(num: number): Promise<number> {
  return new Promise((resolve,reject)=>{
    setTimeout(()=>{
      resolve(num)
    }, 1000)
  })
}

describe('Map test',()=>{
  test('Promise all with amp trigger before await', async ()=>{
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

    console.time('timer')

    const result = await Promise.all(numbers.map(num=>{
      return print(num)
    }))

    // const result = await Promise.all(numbers.map(async num=>{
    //   return print(num)
    // }))

    console.timeEnd('timer')
  })
})
