// extension
const Shapes = (logger) => {
  class Logged {
    constructor (name, props = []) {
      this.name = name
      this.props = props
      this.loggedProps = props
    }

    logToOutput () {
      const self = this
      const text = self.props
        .map((prop) => `  ${prop}: ${self[prop]}`)
        .join('\n')
      logger(self.name, '::\n', text)
    }
  }

  class Rectangle extends Logged {
    constructor (length, width) {
      super('rect', ['length', 'width', 'area'], logger)
      this.length = length
      this.width = width
    }

    get area () {
      return this.length * this.width
    }
  }

  class Square extends Rectangle {
    constructor (length) {
      super(length, length)
    }
  }

  return { Rectangle, Square }
}

describe('Logged', () => {
  it('should log a rectangle', () => {
    const log = jest.fn()
    const { Rectangle } = Shapes(log)
    const r = new Rectangle(2, 3)
    r.logToOutput()
    expect(log.mock.calls).toEqual([
      ['rect', '::\n', '  length: 2\n  width: 3\n  area: 6'],
    ])
  })

  it('should log a square', () => {
    const log = jest.fn()
    const { Square } = Shapes(log)
    const s = new Square(2)
    s.logToOutput()
    expect(log.mock.calls).toEqual([
      ['rect', '::\n', '  length: 2\n  width: 2\n  area: 4'],
    ])
  })

  it.skip('should _actually_ log a square', () => {
    const log = jest.fn()
    const { Square } = Shapes(log)
    const s = new Square(2)
    s.logToOutput()
    expect(log.mock.calls).toEqual([
      ['sqr', '::\n', '  length: 2\n  area: 4'],
    ])
  })
})
