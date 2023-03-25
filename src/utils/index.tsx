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

  fuzzySearch: (termToSearch: string, searchPool: string) => {
    const term = termToSearch.toLowerCase()
    const pool = searchPool.toLowerCase()
    let matches = ''
      if(term === pool) {
        matches = term
      } else {
        let idx = -1
        term.split('').forEach((letter) => {
          const foundIndex = pool.indexOf(letter, idx + 1)

          if(foundIndex > 0) {
            matches += letter
            idx = foundIndex
          }
        })
      }
    return matches || null
  }
}

export default Utils