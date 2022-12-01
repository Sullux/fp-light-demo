const { inspect } = require('util')

// mutable
class Rectangle {
  constructor (length, width) {
    this.length = length
    this.width = width
  }

  get area () {
    return this.length * this.width
  }

  volume (height) { return this.area * height }

  toString () {
    const length = this.length || (this.length = 0)
    const width = this.width || (this.width = 0)
    return `Rectangle(${length}, ${width})`
  }

  [inspect.custom] () { return this.toString() }
}

describe('Rectangle', () => {
  it('should print a default string', () => {
    const r = new Rectangle()
    expect(r + '').toBe('Rectangle(0, 0)')
  })

  it('should get a default area', () => {
    const r = new Rectangle()
    console.log('testing default area of', r)
    expect(r.area).toBe(0)
  })

  it.skip('should get the cube volume', () => {
    const r = new Rectangle(2, 3)
    const heights = [2, 3]
    const volumes = heights.map(r.volume)
    expect(volumes).toEqual([12, 18])
  })
})

class Square extends Rectangle {
  constructor (length) {
    super(length, length)
  }

  get width () { return super.width }

  set width (width) {
    super.width = width
    super.length = width
  }

  get length () { return super.length }

  set length (length) {
    super.width = length
    super.length = length
  }
}

describe('Square', () => {
  it('should create a rectangle of same length and width', () => {
    const s = new Square(3)
    expect(s.area).toBe(9)
  })

  it('should respect changes to length or width', () => {
    const s = new Square(3)
    s.width = 2
    expect(s.area).toBe(6)
  })
})
