import React, {useContext} from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'react-bootstrap';
import AuthContext from '../context/AuthContext'

const Header = () => {
    let {user, logoutUser} = useContext(AuthContext)
  return (
<div>
    <Button onClick={() => {window.location.href='/'}}>Home</Button>
    <span>  |  </span>
    <Button onClick={() => {window.location.href='/registration'}}>Registration</Button>
    <span>  |  </span>
    {user ? (
        <Button onClick={logoutUser}>Logout</Button>
    ): (
        <Button onClick={() => {window.location.href='/login'}}>Login</Button>
    )}
    <span>  |  </span>
    <Button onClick={() => {window.location.href='/grupy'}}>Grupy</Button>
    <span>  |  </span>

    {user &&   <p>Hello {user.username}</p>}
</div>

  )
}

export default Header