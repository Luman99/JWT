import React, {useContext} from 'react'
import AuthContext from '../context/AuthContext'

const RegistrationPage = () => {
    let {registrationUser} = useContext(AuthContext)
  return (
    <div>
        <form onSubmit={registrationUser}>
            <input type='text' name='email' placeholder='Enter Email' />
            <input type='text' name='username' placeholder='Enter Username' />
            <input type='password' name='password' placeholder='Enter Password' />
            <input type='submit' />
        </form>
    </div>
  )
}

export default RegistrationPage
