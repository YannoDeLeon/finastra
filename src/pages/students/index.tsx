import { useContext, useState, useRef, SyntheticEvent } from 'react'
import classes from './students.module.css'
import AppContext, { TStudentProfile } from '../../store'
import Utils from '../../utils'
import StudentTableRow from './table-row'

const StudentsPage = () => {
  const { studentProfiles, isLoading, sortData } = useContext(AppContext)

  const searchRef = useRef<HTMLInputElement>(null);
  const [ order, setOrder ] = useState({column: '', type: ''})
  // move displayed data to State
  // const [ studentList, setStudentList ] = useState<TStudentProfile>()

  const sortHandler = (col: string) => {
    if(order.column === col) {
      const newOrder = order.type === "asc" ? "desc" : "asc"
      sortData({...order, type: newOrder})
      setOrder({...order, type: newOrder})
    } else {
      sortData({column: col, type: "asc"})
      setOrder({column: col, type: "asc"})
    }
  }

  const handleSearch = (e: SyntheticEvent) => {
    e.preventDefault()
    const term = searchRef.current?.value.toLowerCase()
    if(studentProfiles && studentProfiles.length && term) {
      // const objectsArray = studentProfiles[0]

      // const searchResult = objectsArray.filter((obj) => {
        const rate = .5
        const obj = studentProfiles[0]
        const comparison = Object.keys(obj).map((key) => {
          const result = Utils.fuzzySearch(term, obj[key as keyof TStudentProfile].toString())
          return result
        })

        // return true for match word > 50%

        return rate
      // })



    }
  }


  return(
    <div className={classes.container}>
      <form onSubmit={(e) => handleSearch(e)}>
        <input className={classes.search} type='text' name="search" ref={searchRef} required />
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
          { !isLoading && studentProfiles ? studentProfiles?.length ?
              studentProfiles?.map((student: TStudentProfile) =>
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