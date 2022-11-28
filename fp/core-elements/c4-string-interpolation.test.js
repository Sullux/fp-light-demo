Object.assign(globalThis, require('@sullux/fp-light'))

// the string interpolation function is a
//     *Javascript String Literal Tagged Template* ™
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates

// it takes the parts of the string and puts them through the resolve function
// this lets us intersperse functions in our strings

;(async () => {
  // this is a classic js string literal:
  const x = 42
  console.log(`the number ${x} is the answer`)
  // prints 'the number 42 is the answer'

  // this is a compilable string literal:
  const doubleAnswer = $`the number ${mul(2)} is the answer`
  console.log(doubleAnswer(21))
  // prints 'the number 42 is the answer'

  // and here it is with our old friend map
  const numbers = [{ x: 5 }, { x: 6 }, { x: 7 }]
  const ordinals = numbers.map($`${_.x}th`)
  console.log(ordinals) // prints ['5th', '6th', '7th']
})()

describe('$', () => {
  it('should interpolate', () => {
    // todo
  })
})
