import { useContext } from 'react'
import classes from './students.module.css'
import AppContext, { TStudent} from '../../store'

import DataRow from './data-row'

const StudentsPage = () => {
  const { students, isLoading } = useContext(AppContext)

  const Loading = () => {
    return <tr style={{textAlign: 'center'}}><td colSpan={7}><h1>LOADING...</h1></td></tr>
  }

  return(
    <div className={classes.container}>
      {/* <input className={classes.search} type='text' name="search" /> */}
        <table className={classes.table}>
          <thead className={classes.header}>
            <tr>
              <th>{''}</th>
              <th>Name <span></span></th>
              <th>Phone</th>
              <th>Email</th>
              <th>Major <span></span></th>
              <th>Status <span></span></th>
              <th>Total Course</th>
            </tr>
          </thead>
        <tbody>
          { !isLoading && students ?
            students.map((student: TStudent) =>
              <DataRow key={student.id} student={student}  />)
              : <Loading />
          }
        </tbody>
      </table>
    </div>
  )
}

export default StudentsPage;