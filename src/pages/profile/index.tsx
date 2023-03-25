import { useContext, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import classes from './profile.module.css'
import AppContext, { TCourse, TCurrency, TStudentProfile } from '../../store'
import Utils from '../../utils'
import API from '../../utils/api'

const Profile = () => {
  let { id } = useParams()
  const { isLoading,
    getStudentCourses,
    courses,
    currencies,
    getStudentProfile,
    studentProfiles,
  } = useContext(AppContext)

  const [ courseList, setCourseList] = useState<TCourse[]>()
  const [ currency, setCurrency ] = useState({prev: "", value: "USD"})
  const [ exchangeRate, setExchangeRate ] = useState(1)
  const [ order, setOrder ] = useState('asc')
  const [ profile, setProfile ] = useState<TStudentProfile>()

  const toggleOrder = () => {
    let sorted: TCourse[] = [];
    let newOrder = order === 'asc' ? 'desc' : 'asc'

    if(newOrder === 'desc' && courseList) {
      sorted = Utils.sortDescending([...courseList], 'semester_code')
      setCourseList([...sorted])
    }
    if(newOrder === 'asc' && courseList) {
      sorted = Utils.sortAscending([...courseList], 'semester_code')
    }

    setCourseList([...sorted])
    setOrder(newOrder)
  }

  const toggleCurrency = async (newValue: string) => {
    setCurrency((prevState: {prev: string, value: string}) => {
      return {
        prev: prevState.value,
        value: newValue
      }
    })
  }

  useEffect(() => {
    const checkRates = async () => {
      // CALL API
      if(currency.prev && currency.value) {
        const ERApi = await API.getExchangeRate(currency.prev, currency.value)
        if(ERApi.result === "success") {
          if(ERApi.conversion_rate) {
            setExchangeRate(ERApi.conversion_rate)
          } else {
          }
        } else {
          alert(`Unexpected Error "${ERApi["error-type"]}"`)
          setCurrency({prev: '', value: 'USD'})
        }
      }
    }

    checkRates()
  }, [currency])

  useEffect(() => {
    const computeFee = () => {
      if(courseList && courseList.length) {
        const newCourseList = courseList.map(course => {
          const computedFee = parseInt(course.course_fee) * exchangeRate
          course.course_fee = computedFee.toString()
          return course
        })
        setCourseList([...newCourseList])
      }
    }
    computeFee()

  }, [exchangeRate])

  useEffect(() => {
    if(courses?.length) {
      const newList = [...getStudentCourses(id)]
      const unique = Utils.uniqueObjArr([...newList], ['course_selection', 'semester_code'])
      const sorted = Utils.sortAscending([...unique], 'semester_code')
      setCourseList(sorted)
    }
  }, [getStudentCourses, id, courses])

  useEffect(() => {
    if(studentProfiles && studentProfiles.length && id) {
      const profileById = getStudentProfile(parseInt(id))
      setProfile(profileById)
    }
  }, [studentProfiles, getStudentProfile, id])

  return (
    <div className={classes.profileContainer}>
      <div className={classes.banner}>
        <div className={classes.infoContainer}>
          <div className={classes.profileImage}>
            <img alt='profile' src={`/assets/user_${profile?.id}.jpg`}
            onError={({currentTarget}) => {
              currentTarget.onerror = null
              currentTarget.src = `/assets/default.jpg`
            }}/>
          </div>
          <div className={classes.infos}>
            <span>{profile?.nickname ? `${profile.name} (${profile.nickname})` : profile?.name}</span>
            <span>{profile?.major}</span>
            <span>{profile?.year}</span>
            <span>{profile?.status}</span>
          </div>
        </div>
      </div>
      <table className={classes.coursesTable}>
        <thead>
          <tr>
            <th className={classes.sortable} onClick={toggleOrder}>
              Semester Code{ <img
                  className={order === "desc" ? classes.desc : ""}
                  src="/assets/arrow-down.svg" alt="sort-icon"
                />
              }</th>
            <th>Course Name</th>
            <th>Course Selection</th>
            <th><label htmlFor='currency'>Course Fee </label>[<select
                className={classes.currencySelect}
                id='currency'
                value={currency.value}
                onChange={(e) => toggleCurrency(e.target.value)}
              >
                { Object.keys(currencies).map((item) =>
                  <option key={item} value={item}>{item}</option>
                )
                }
              </select>]
            </th>
          </tr>
        </thead>
        <tbody>
          { !isLoading && courseList ? courseList?.length ? courseList.map((course, idx) =>
            <tr key={course.id}>
              <td>{ courseList[idx - 1]?.semester_code === course.semester_code
                ? '' : course.semester_code}
              </td>
              <td>{course.course_name}</td>
              <td>{course.course_selection}</td>
              <td>
                {currencies[currency.value as keyof TCurrency].symbol}{" "}
                {parseInt(course.course_fee).toFixed(currencies[currency.value.toString() as keyof TCurrency].decimal_digits)}
              </td>
            </tr>)
            : <tr style={{textAlign: 'center'}}><td colSpan={7}><h1>No Data Found.</h1></td></tr>
            : <tr style={{textAlign: 'center'}}><td colSpan={7}><h1>LOADING...</h1></td></tr>
          }
        </tbody>
      </table>
    </div>
  )
}

export default Profile