const parseQueryString1 = (url) => {
  const [, queryString] = url.split('?')
  const pairs = queryString.split('&')
  const result = {}
  for (const pair of pairs) {
    const [key, value] = pair.split('=')
    result[key] = value
  }
  return result
}

const parseQueryString2 = (url) => Object.fromEntries(
  url.split('?')[1]
    .split('&')
    .map((pair) => pair.split('='))
)

test('should parse query string params into an object', () => {
  const url = 'https://example.com?foo=bar&baz=biz'
  const result = parseQueryString1(url)
  assert.deepStrictEqual(
    result,
    { foo: 'bar', baz: 'biz' },
  )
  assert.deepStrictEqual(result, parseQueryString2(url))
})
