// composition
const logged = (factory, name, props, output) =>
  (...args) => {
    const obj = factory(...args)
    const logToOutput = () => output(
      name,
      '::\n',
      props
        .map((prop) => `  ${prop}: ${obj[prop]}`)
        .join('\n'),
    )
    return Object.freeze({
      ...obj,
      logToOutput,
    })
  }

const shapes = (logger) => {
  const rectangle = logged(
    (length, width) => Object.freeze({
      length,
      width,
      area: length * width,
    }),
    'rect',
    ['length', 'width', 'area'],
    logger,
  )

  const square = logged(
    (length) => rectangle(length, length),
    'sqr',
    ['length', 'area'],
    logger,
  )

  return { rectangle, square }
}

module.exports = { shapes }

describe('logged', () => {
  it('should log a rectangle', () => {
    const log = jest.fn()
    const { rectangle } = shapes(log)
    const r = rectangle(2, 3)
    r.logToOutput()
    expect(log.mock.calls).toEqual([
      ['rect', '::\n', '  length: 2\n  width: 3\n  area: 6'],
    ])
  })

  it('should _actually_ log a square', () => {
    const log = jest.fn()
    const { square } = shapes(log)
    const s = square(2)
    s.logToOutput()
    expect(log.mock.calls).toEqual([
      ['sqr', '::\n', '  length: 2\n  area: 4'],
    ])
  })
})
