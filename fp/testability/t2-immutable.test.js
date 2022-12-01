const { inspect } = require('util')

// immutable
const rectangle = (length, width) => {
  const area = length * width
  const toString = () => `Rectangle(${length || 0}, ${width || 0})`
  return Object.freeze({
    length,
    width,
    area,
    volume: (height) => area * height,
    toString,
    [inspect.custom]: toString,
  })
}

describe('Rectangle', () => {
  it('should print a default string', () => {
    const r = rectangle()
    expect(r + '').toBe('Rectangle(0, 0)')
  })

  it('should get a default area', () => {
    const r = rectangle()
    console.log('testing default area of', r)
    expect(r.area).toBe(0)
  })

  it('should get the cube volume', () => {
    const r = rectangle(2, 3)
    const heights = [2, 3]
    const volumes = heights.map(r.volume)
    expect(volumes).toEqual([12, 18])
  })
})

const square = (length) => rectangle(length, length)

describe('Square', () => {
  it('should create a rectangle of same length and width', () => {
    const s = square(3)
    expect(s.area).toBe(9)
  })

  it('should not allow changes to length or width', () => {
    const s = square(3)
    s.width = 2
    expect(s.area).toBe(9)
  })
})
