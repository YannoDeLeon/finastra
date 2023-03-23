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

type TStudentProfile = {
  id: number,
  name: string,
  nickname: string,
  email: string,
  phone: string,
  image: string,
  major: string,
  year: string,
  status: TStatus[]
}

type TAppContext = {
  students?: TStudent[]
  courses?: TCourse[],
  profiles?: TProfile[],
  studentProfile?: TStudentProfile,
  isLoading: boolean,
  // getStudentProfile: Function
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
  studentProfile: {
    id: -1,
    name: "",
    nickname: "",
    email: "",
    phone: "",
    image: "",
    major: "",
    year: "",
    status: []
  },
  isLoading: true,
  // getStudentProfile: (id: string) => {}
})

export const AppContextProvider = ({children}: PropsType) => {

  const [ studentList, setStudentList ] = useState<TStudent[]>()
  const [ courseList, setCourseList ] = useState<TCourse[]>()
  const [ profileData, setProfileData ] = useState<TProfile[]>()
  const [ studentProfile, setStudentProfile ] = useState<TStudentProfile>()
  const [ isLoading, setIsLoading ] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const result = await API.batchGet([URLs.STUDENTS, URLs.COURSES, URLs.PROFILE])
      setStudentList(result[0])
      setCourseList(result[1])
      setProfileData(result[2])
    }

    fetchData()
    setIsLoading(false)
  }, [])

  const createProfile = (id: string) => {}


  const context: TAppContext = {
    students: studentList,
    courses: courseList,
    profiles: profileData,
    studentProfile: studentProfile,
    isLoading: isLoading,
    // getStudentProfile: createProfile
  }

  return <AppContext.Provider value={context}>
    {children}
  </AppContext.Provider>
}

export default AppContext