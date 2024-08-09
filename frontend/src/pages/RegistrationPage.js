import React, {useContext, useEffect} from 'react'
import AuthContext from '../context/AuthContext'

const RegistrationPage = () => {
    let { errorMessage, setErrorMessage, registrationUser, registrationSuccess, setRegistrationSuccess } = useContext(AuthContext);

    // Resetuj wartość przy montowaniu komponentu (np. po odświeżeniu strony)
    useEffect(() => {
        setRegistrationSuccess(false);
        setErrorMessage(false);
    }, [setRegistrationSuccess, setErrorMessage]);

  return (
      <div>
          <form onSubmit={registrationUser}>
              <input type='text' name='email' placeholder='Enter Email' />
              <input type='password' name='password' placeholder='Enter Password' />
              <input type='submit' value='Zarejestruj się'/>
          </form>
          {errorMessage && <p style={{color: "red"}}>{errorMessage}</p>}


          {registrationSuccess && ( // Warunkowe renderowanie wiadomości
              <p>Dziękujemy za dołączenie do nas, na podany przez Ciebie adres e-mail zostanie wysłany link aktywacyjny Twojego konta</p>
          )}
      </div>
  )
}

export default RegistrationPage;
