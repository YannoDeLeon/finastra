import { createContext, ReactNode, useState, useEffect } from 'react'
import API, { URLs } from '../utils/api'

export type TStudent = {
  email: string,
  id: number,
  name: string,
  nickname ?: string,
  phone: string,
}

export type TProfile = {
  id: number,
  user_id: string,
  user_img: string,
  major: string,
  year: string,
  status?: TStatus[]
}

export type TCourse = {
  id: number,
  user_id: string,
  course_name: string,
  course_selection: string,
  semester_code: string,
  course_fee: string
}

export type TStatus = {
  date: string,
  type: number
}

export type TStudentProfile = {
  id: number,
  name: string,
  nickname: string,
  email: string,
  phone: string,
  image: string,
  major: string,
  year: string,
  status: string,
  courses: TCourse[]
}

export type TSort = {
  column: string,
  type: string
}

type TAppContext = {
  students?: TStudent[]
  courses?: TCourse[],
  profiles?: TProfile[],
  studentProfiles?: TStudentProfile[],
  isLoading: boolean,
  sortData: Function,
  getStudentStatus: Function
}

type PropsType = {
  children: ReactNode
}

export const statusChart = {
  0: "Withdrawn",
  1: "Good",
  2: "Probation",
  3: "Inactive",
}

const AppContext = createContext<TAppContext>({
  students: [],
  courses: [],
  profiles: [],
  studentProfiles: [],
  isLoading: true,
  sortData: (order: TSort) => {},
  getStudentStatus: (statusList: TStatus) => {}
})

export const AppContextProvider = ({children}: PropsType) => {

  const [ studentList, setStudentList ] = useState<TStudent[]>()
  const [ courseList, setCourseList ] = useState<TCourse[]>()
  const [ profilesList, setProfilesList ] = useState<TProfile[]>()
  const [ studentProfiles, setStudentProfiles ] = useState<TStudentProfile[]>()
  const [ isLoading, setIsLoading ] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const result = await API.batchGet([URLs.STUDENTS, URLs.COURSES, URLs.PROFILE])
      setStudentList(result[0])
      setCourseList(result[1])
      setProfilesList(result[2])
    }

    fetchData()
    setIsLoading(false)
  }, [])

  useEffect(() => {
    const createProfile = (student: TStudent): TStudentProfile => {
      const userId = `user_${student.id}`
      const courses = courseList?.filter(course => course.user_id === userId)
      const profile = profilesList?.filter(profile => profile.user_id === userId)

      const compiledData = {
        id: student.id,
        name: student.name,
        nickname: student.nickname || "",
        email: student.email,
        phone: student.phone,
        image: profile?.[0].user_img || "",
        major: profile?.[0].major || "N/A",
        year: profile?.[0].year || "N/A",
        status: profile?.[0].status ? getStatus(profile?.[0].status) : "",
        courses: courses || []
      }
      return compiledData
    }

    if(studentList?.length && courseList?.length && profilesList?.length) {
      const profiles = studentList.map((student => createProfile(student)))
      setStudentProfiles(profiles)
    }

  }, [studentList, courseList, profilesList])

  const getStatus = (status: TStatus[]) : string => {
    let statusType = ''
    console.log(status)
    if(status?.length) {
      const latestStatus = status.reduce(
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


  const ascendingOrder = (column: string) => {
    const sorted = studentProfiles?.sort((a, b) => {
      if(a[column as keyof TStudentProfile] < b[column as keyof TStudentProfile]) {
        return -1
      }
      if(a[column as keyof TStudentProfile] > b[column as keyof TStudentProfile]) {
        return 1
      }
      return 0
    })
    setStudentList(sorted)
  }

  const descendingOrder = (column: string) => {
    const sorted = studentProfiles?.sort((a, b) => {
      if(a[column as keyof TStudentProfile] > b[column as keyof TStudentProfile]) {
        return -1
      }
      if(a[column as keyof TStudentProfile] < b[column as keyof TStudentProfile]) {
        return 1
      }
      return 0
    })
    setStudentList(sorted)
  }

  const sortDataHandler = (order: TSort) => {
    if(order.column && order.type && studentProfiles && studentProfiles.length) {
      order.type === 'asc' ? ascendingOrder(order.column) : descendingOrder(order.column)
    }
  }


  const context: TAppContext = {
    students: studentList,
    courses: courseList,
    profiles: profilesList,
    studentProfiles: studentProfiles,
    isLoading: isLoading,
    sortData: sortDataHandler,
    getStudentStatus: getStatus
  }

  return <AppContext.Provider value={context}>
    {children}
  </AppContext.Provider>
}

export default AppContext