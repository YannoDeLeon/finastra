
export const URLs = {
  STUDENTS: 'https://run.mocky.io/v3/79ebd782-efd6-469b-8dd5-663cf03406ad',
  COURSES: 'https://run.mocky.io/v3/34bdbb5f-70c0-41ce-aa0c-2bf46befa477',
  PROFILE: 'https://run.mocky.io/v3/214aef9d-b18a-4188-b55f-a25046408a7e',
  CURRENCY: 'https://gist.githubusercontent.com/JCGonzaga01/9f93162c5fb799b7c084bb28fc69a2f1/raw/94c55f89dc4c1e2e7ca49de5658c3441a2b348af/Updated-Common-Currency.json'
}

const API = {
  get: (url: string) => {
    return fetch(url)
      .then((res) => res.json()
        .then((response) => response)
      )
  },
  batchGet: (urls: string[]) => {
    return Promise.all(
      urls.map(url => {
        return API.get(url)
      })
    )
  }
}

export default API;