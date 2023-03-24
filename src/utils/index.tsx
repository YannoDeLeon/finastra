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

}

export default Utils