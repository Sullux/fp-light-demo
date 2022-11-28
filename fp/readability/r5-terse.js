// soupy
const longestWord1 = (words) => {
  let longest = ''
  for (let i = 0, { length } = words; i < length; i++) {
    const word = words[i]
    if (word.length > longest.length) {
      longest = word
    }
  }
  return longest
}

// terse
const longerWord = (word1, word2) =>
  word1.length > word2.length ? word1 : word2

const longestWord2 = (words) => words.reduce(longerWord, '')

module.exports = {
  longestWord1,
  longestWord2,
}
