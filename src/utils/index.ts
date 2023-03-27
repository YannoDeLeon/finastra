const Utils = {
  uniqueObjArr: (arrayToFilter: any[], keys: string[]) => {
    const filtered = arrayToFilter.filter((value, idx, arr) => {
      const foundIndex = arr.findIndex((value2) => {
        return keys.every( key => {
          return value[key] === value2[key]
        })
      })
      return foundIndex === idx
    })
    return filtered;
  },
  sortAscending: (arrayToSort: any[], sortBy: string) => {
    const sorted = arrayToSort?.sort((a, b) => {
      if(a[sortBy] < b[sortBy]) {
        return -1
      }
      if(a[sortBy] > b[sortBy]) {
        return 1
      }
      return 0
    })
    return sorted
  },
  sortDescending: (arrayToSort: any[], sortBy: string) => {
    const sorted = arrayToSort?.sort((a, b) => {
      if(a[sortBy] > b[sortBy]) {
        return -1
      }
      if(a[sortBy] < b[sortBy]) {
        return 1
      }
      return 0
    })
    return sorted
  },
  fuzzySearch: (pattern: string, haystack: string) => {
    const track = Array(haystack.length + 1)
      .fill(null)
      .map(() => Array(pattern.length + 1).fill(null));
    for (let i = 0; i <= pattern.length; i += 1) {
      track[0][i] = i;
    }
    for (let j = 0; j <= haystack.length; j += 1) {
      track[j][0] = j;
    }
    for (let j = 1; j <= haystack.length; j += 1) {
      for (let i = 1; i <= pattern.length; i += 1) {
        const indicator = pattern[i - 1] === haystack[j - 1] ? 0 : 1;
        track[j][i] = Math.min(
          track[j][i - 1] + 1, // deletion
          track[j - 1][i] + 1, // insertion
          track[j - 1][i - 1] + indicator // substitution
        );
      }
    }
    return track[haystack.length][pattern.length];
  },
}

export default Utils