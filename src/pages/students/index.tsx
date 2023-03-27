import { useContext, useState, useRef, SyntheticEvent, useEffect } from 'react'
import classes from './students.module.css'
import AppContext, { TStudentProfile } from '../../store'
import StudentTableRow from './table-row'
import Utils from '../../utils'

const StudentsPage = () => {
  const { studentProfiles, isLoading } = useContext(AppContext)

  const searchRef = useRef<HTMLInputElement>(null);
  const [ order, setOrder ] = useState({column: '', type: ''})
  // move displayed data to State
  const [ studentList, setStudentList ] = useState<TStudentProfile[]>()

  const sortHandler = (col: string) => {
    if(studentList) {
      let sorted
      if(order.column === col) {
        const newOrder = order.type === "asc" ? "desc" : "asc"
        if (newOrder === 'asc') {
          sorted = Utils.sortAscending([...studentList], order.column)
        } else {
          sorted = Utils.sortDescending([...studentList], order.column)
        }
        setOrder({...order, type: newOrder})
      } else {
        sorted = Utils.sortAscending([...studentList], col)
        setOrder({column: col, type: "asc"})
      }
      setStudentList(sorted)
    }
  }

  const handleSearch = (e: SyntheticEvent) => {
    e.preventDefault()
    const term = searchRef.current?.value
    if(studentProfiles && studentProfiles.length && term) {
      const objectsArray = [...studentProfiles]

      const searchResult = objectsArray.map((obj) => {
        let bestScore: number = -1
        Object.keys(obj).forEach((key) => {
          if(key !== 'id') {
            const score = Utils.fuzzySearch(term, obj[key as keyof TStudentProfile].toString())
            if(bestScore === -1) {
              bestScore = score
            } else {
              bestScore = bestScore < score ? bestScore : score
            }
          }
          return obj[key as keyof TStudentProfile]
        })
        return { ...obj, score: bestScore }
      })

      const sorted = Utils.sortAscending(searchResult, 'score')
      const filtered = sorted.filter((obj) => obj.score <= 3)
      setStudentList([...filtered])
    } else {
      studentProfiles && setStudentList([...studentProfiles])
    }
    setOrder({column: '', type: ''})
  }

  useEffect(() => {
    if(!isLoading && studentProfiles && studentProfiles.length) {
      setStudentList([...studentProfiles])
    }
  }, [isLoading, studentProfiles])

  return(
    <div className={classes.container}>
      <form onSubmit={(e) => handleSearch(e)} className={classes.form}>
        <input type='text' name="search" ref={searchRef} />
        <button>Search</button>
      </form>
        <table className={classes.studentTable}>
          <thead className={classes.header}>
            <tr>
              <th>{''}</th>
              <th className={classes.sortable}
                onClick={() => sortHandler('name')}>
                  Name { order.column === 'name' &&
                  <img
                    className={order.type === "desc" ? classes.desc : ""}
                    src="/assets/arrow-down.svg" alt="sort-icon"
                  />
                }
              </th>
              <th>Phone</th>
              <th>Email</th>
              <th className={classes.sortable}
                onClick={() => sortHandler('major')}>
                  Major { order.column === 'major' &&
                    <img
                      onClick={() => sortHandler('major')}
                      className={order.type === "desc" ? classes.desc : ""}
                      src="/assets/arrow-down.svg" alt="sort-icon"
                    />
                }
              </th>
              <th className={classes.sortable}
                onClick={() => sortHandler('status')}>
                  Status { order.column === 'status' &&
                    <img
                      onClick={() => sortHandler('status')}
                      className={order.type === "desc" ? classes.desc : ""}
                      src="/assets/arrow-down.svg" alt="sort-icon"
                    />
                }
              </th>
              <th>Total Course</th>
            </tr>
          </thead>
        <tbody>
          { !isLoading && studentList ? studentList?.length ?
              studentList?.map((student: TStudentProfile) =>
                <StudentTableRow key={student.id} student={student}  />)
                : <tr style={{textAlign: 'center'}}><td colSpan={7}><h1>No Data Found.</h1></td></tr>
                : <tr style={{textAlign: 'center'}}><td colSpan={7}><h1>LOADING...</h1></td></tr>
          }
        </tbody>
      </table>
    </div>
  )
}

export default StudentsPage;