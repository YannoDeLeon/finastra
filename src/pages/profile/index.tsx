import { useContext, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import classes from './profile.module.css'
import AppContext, { TCourse, TCurrency } from '../../store'
import Utils from '../../utils'
import API from '../../utils/api'

const Profile = () => {
  let { id } = useParams()
  const { isLoading, getStudentCourses, courses, currencies } = useContext(AppContext)

  const [ courseList, setCourseList] = useState<TCourse[]>()
  const [ currency, setCurrency ] = useState<keyof TCurrency>()
  const [ prevCurrency, setPrevCurrency ] = useState<keyof TCurrency>()
  const [ exchangeRate, setExchangeRate ] = useState()
  const [ order, setOrder ] = useState('asc')

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

  const toggleCurrency = async (value: string) => {
    let prevCurrency = "USD"
    setCurrency((prev) => {
      console.log("[prev]", prev)
      // exchange rate
      prevCurrency = prev?.toString() || "USD"
      setPrevCurrency(prevCurrency)
      return value
    })

    if(prevCurrency !== "USD") {
      // const result = await API.getExchangeRate(prevCurrency, value)
      // console.log('[result]]', result)
    } else {
      console.log("NOTHING TO EXCHANGE")
    }
  }

  useEffect(() => {
    if(currencies) {
      toggleCurrency("USD")
    }
  }, [currencies])

  useEffect(() => {
    if(courses?.length) {
      const newList = [...getStudentCourses(id)]
      const unique = Utils.uniqueObjArr([...newList], ['course_selection', 'semester_code'])
      const sorted = Utils.sortAscending([...unique], 'semester_code')
      setCourseList(sorted)
    }
  }, [getStudentCourses, id, courses])

  return (
    <div className={classes.profileContainer}>
      <table>
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
              <td><>{currencies[currency as keyof TCurrency].symbol} {course.course_fee}</></td>
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