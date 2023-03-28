const SEQUENTIAL_BONUS = 15;
const SEPARATOR_BONUS = 30;
const FIRST_LETTER_BONUS = 15;

const LEADING_LETTER_PENALTY = -5;
const MAX_LEADING_LETTER_PENALTY = -15;
const UNMATCHED_LETTER_PENALTY = -1;

const fuzzyMatching = (pattern: string, str: string) : number => {
  let totalScore = 0

  const currentMatches: {pid: number, sid: number, char: string}[] = []
  let pIdx = 0, sIdx = 0

  while(pIdx < pattern.length && sIdx < str.length) {
    const isMatched = pattern[pIdx] === str[sIdx]

    if(isMatched) {
      currentMatches.push({pid: pIdx, sid: sIdx, char: str[sIdx]})
      sIdx += 1
      pIdx += 1
    } else {
      sIdx += 1
      if(sIdx === str.length) {
        pIdx += 1
        sIdx = 0
      }
    }
  }

  // SCORING
  currentMatches.forEach((match, idx, arr) => {
    if(idx > 0) {
      // adjacent matches bonus
      const prevChar = str.charAt(match?.sid - 1)
      if(prevChar === arr[idx - 1].char) {
        totalScore += SEQUENTIAL_BONUS
      }

      // after separator bonus
      if(prevChar === " " || prevChar === "@" || prevChar === "-") {
        totalScore += SEPARATOR_BONUS
      }

    } else {
      // FIRST LETTER BONUS
      if(currentMatches[0]?.pid === 0 && currentMatches[0]?.sid === 0) {
        totalScore += FIRST_LETTER_BONUS
      }
    }
  })


  // leading letter penalty
  if(currentMatches.length > 0 && str.charAt(0) !== currentMatches[0].char) {
    const computedPenalty = currentMatches[0].sid * LEADING_LETTER_PENALTY
    totalScore += (computedPenalty) > MAX_LEADING_LETTER_PENALTY ?
      MAX_LEADING_LETTER_PENALTY : computedPenalty
  }

  // not match penalty
  if(pattern.length !== str.length) {
    const patternIsLonger = (pattern.length - currentMatches.length) * UNMATCHED_LETTER_PENALTY
    const stringIsLonger = (str.length - currentMatches.length) * UNMATCHED_LETTER_PENALTY
    totalScore += str.length > pattern.length ? stringIsLonger : patternIsLonger
  }

  return totalScore
}

export default fuzzyMatching