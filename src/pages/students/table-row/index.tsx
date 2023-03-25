import { useNavigate } from 'react-router-dom'
import classes from "./table-row.module.css"
import{ TStudentProfile } from "../../../store"

const StudentTableRow = ({student}: {student: TStudentProfile}) => {
  const navigate = useNavigate()

  return <tr key={student.id}>
    <td><img onClick={() => navigate(`/user/${student.id}`)} alt='student_pic'
      className={classes.img}
      src={`/assets/user_${student.id}.jpg`}
      onError={({currentTarget}) => {
        currentTarget.onerror = null
        currentTarget.src = `/assets/default.jpg`
      }}/>
    </td>
    <td>{student.name}{student.nickname ? ` (${student.nickname})` : ''}</td>
    <td>{student.phone}</td>
    <td>{student.email}</td>
    <td>{student.major}</td>
    <td>{student.status}</td>
    <td>{student.courseCount}</td>
  </tr>
}

export default StudentTableRow