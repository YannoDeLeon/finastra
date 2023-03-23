import { useContext, useState } from 'react'
import classes from './students.module.css'
import AppContext, { TStudentProfile } from '../../store'

import StudentTableRow from './table-row'

const StudentsPage = () => {
  const { studentProfiles, isLoading, sortData } = useContext(AppContext)
  const [ order, setOrder ] = useState({column: '', type: ''})

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



  return(
    <div className={classes.container}>
      {/* <input className={classes.search} type='text' name="search" /> */}
        <table>
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