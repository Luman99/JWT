import React, {useContext, useEffect} from 'react'
import AuthContext from '../context/AuthContext'

const LoginPage = () => {
    let {loginUser, errorMessage, setErrorMessage} = useContext(AuthContext)

      // Resetuj wartość przy montowaniu komponentu (np. po odświeżeniu strony)
      useEffect(() => {
        setErrorMessage(false);
    }, [setErrorMessage]);

  return (
    <div>
        <form onSubmit={loginUser}>
            <input type='text' name='email' placeholder='Enter Email' />
            <input type='password' name='password' placeholder='Enter Password' />
            <input type='submit' value='Zaloguj się'/>
        </form>
        {errorMessage && <p style={{color: "red"}}>{errorMessage}</p>}

    </div>
  )
}

export default LoginPage