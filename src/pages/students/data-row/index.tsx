import { useContext, useEffect, useState } from 'react'
import { TCourse, TStudent, statusChart, TProfile } from "../../../store"
import AppContext from '../../../store'

const DataRow = ({student}: {student: TStudent}) => {
  const { courses, isLoading, profiles } = useContext(AppContext)

  const [ studentCourses, setStudentCourses ] = useState<TCourse[] | null>()
  const [ studentProfile, setStudentProfile ] = useState<TProfile | null>()

  useEffect(() => {
    if(!isLoading && courses?.length) {
      const filtered_courses = courses?.filter(course => course.user_id === `user_${student.id}`)
      setStudentCourses(filtered_courses.length ? filtered_courses : null)
    }
  }, [isLoading, courses])

  useEffect(() => {
    if(!isLoading && profiles?.length) {
      const profile = profiles?.filter(profile => profile.user_id === `user_${student.id}`)
      console.log(profile)
      setStudentProfile(profile.length ? profile[0] : null)
    }
  }, [isLoading, profiles])

  const getStatus = () : string => {
    let statusType = ''
    if(studentProfile?.status?.length) {
      const latestStatus = studentProfile?.status.reduce(
        (prev, cv) => {
          const date1 = Date.parse(prev.date)
          const date2 = Date.parse(cv.date)
        return date1 > date2 ? prev : cv
      })

      type chartType = typeof statusChart
      statusType = statusChart[latestStatus.type as keyof chartType]
    }

    return statusType || statusChart[0]
  }

  const getTotalCourse = () : number => {
    return studentCourses?.length || 0
  }

  return <tr key={student.id}>
    <td><img alt='student_pic'
      src={`/assets/user_${student.id}.jpg`}
      onError={({currentTarget}) => {
        currentTarget.onerror = null
        currentTarget.src = `/assets/default.jpg`
      }}/>
    </td>
    <td>{student.name}{student.nickname ? ` (${student.nickname})` : ''}</td>
    <td>{student.phone}</td>
    <td>{student.email}</td>
    <td>{studentProfile?.major}</td>
    <td>{getStatus()}</td>
    <td>{getTotalCourse()}</td>
  </tr>
}

export default DataRow