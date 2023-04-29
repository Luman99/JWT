import React, {useState, useEffect, useContext} from 'react'
import { useFetcher } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

const HomePage = () => {

  let {authTokens, logoutUser} = useContext(AuthContext)

  return (
  <div>
    <p> You are logged to the home page!</p>
  </div>
  )
}

export default HomePage