describe('toBe vs toEqaul', ()=>{
  test('NaN', ()=>{
    const nanValue = NaN
    expect(NaN).toBe(NaN)
    // always to be 'false']
    // @ts-ignore
    expect(NaN === NaN).toBeFalsy()
  })

  test('Compare +0 -0', ()=>{
    expect(+0).not.toBe(-0)
    expect(+0 === -0).toBeTruthy()
  })
})
