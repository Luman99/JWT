import React, {useState, useEffect, useContext} from 'react'
import { useFetcher } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

const HomePage = () => {
  let [studentsGroups, setStudentsGroups] = useState([])
  let {authTokens, logoutUser} = useContext(AuthContext)

  useEffect(()=> {
      getStudentsGroups()
  }, [])

  let getStudentsGroups = async()=>{
    let response = await fetch('http://127.0.0.1:8000/api/students_group/', {
      method:'GET',
      headers:{

        'Content-Type':'application/json',
        'Authorization':'Bearer ' + String(authTokens.access)
      }
    })
    let data = await response.json()

    if(response.status === 200){
        setStudentsGroups(data)
    }else if(response.statusText === 'Unauthorized'){
        logoutUser()
    }

  }
  return (
  <div>
    <p> You are logged to the home page!</p>
  </div>
  )
}

export default HomePage