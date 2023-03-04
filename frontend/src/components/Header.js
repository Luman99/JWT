import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'react-bootstrap';
import AuthContext from '../context/AuthContext'
import './Header.css';

const Header = () => {
  const [isTrainingOpen, setIsTrainingOpen] = useState(false);
  let {user, logoutUser} = useContext(AuthContext);

  const handleTrainingClick = () => {
    setIsTrainingOpen(!isTrainingOpen);
  }

  return (
    <div className="header">
      <Button onClick={() => {window.location.href='/'}} className="btn-block">Home</Button>


      {user && <Button onClick={() => {window.location.href='/grupy'}} className="btn-block">Grupy</Button>}
      <Button onClick={() => {window.location.href='/createexam'}} className="btn-block">Utwórz egzamin</Button>
      <div className="dropdown">
      {user && <Button className="training-btn dropdown-toggle" onClick={handleTrainingClick} type="button">
          Trening
        </Button>}
        <div className={`dropdown-menu ${isTrainingOpen ? 'show' : ''}`}>
          <Link className="dropdown-item" to='/questions/1'>Przepisy ogólne</Link>
          <Link className="dropdown-item" to='/questions/2'>Znaki drogowe</Link>
          <Link className="dropdown-item" to='/questions/3'>Zasady pierwszeństwa</Link>
          <Link className="dropdown-item" to='/questions/4'>Obsługa roweru</Link>
          <Link className="dropdown-item" to='/questions/5'>Pierwsza pomoc</Link>
        </div>
      </div>
      <Button onClick={() => {window.location.href='/profile'}} className="btn-block">Mój Profil</Button>
      <Button onClick={() => {window.location.href='/registration'}} className="btn-block">Registration</Button>
      {user ? (
          <Button onClick={logoutUser} className="btn-block">Logout</Button>
      ): (
          <Button onClick={() => {window.location.href='/login'}} className="btn-block">Login</Button>
      )}
      {/* {user && <p>Hello {user.username}</p>} */}
    </div>
  )
}

export default Header
