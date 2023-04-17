import React, {useState, useEffect, useContext} from 'react'
import { useFetcher } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

const ProfilePage = () => {
    let {authTokens, user} = useContext(AuthContext)
    const [Name, setName] = useState(localStorage.getItem("name") || user.username || '');
    const [Surname, setSurname] = useState(localStorage.getItem("surname") || user.surname || '');
    const [Email, setEmail] = useState(localStorage.getItem("email") || user.email || '');
 

    //// Czasami po kilku zmianach profilu przestaje zmieniać dane w bazie danych, nie wiem czemu (może przez dokonywanie zmian w kodzie)
    const handleSubmit = async (event) => {
        event.preventDefault();
        localStorage.setItem("name", Name); // zapisz wartość do localStorage
        localStorage.setItem("surname", Surname);
        localStorage.setItem("email", Email);
        const response = await fetch(`http://localhost:8000/api/edit_user/${user.email}/`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + String(authTokens.access),
          },
          body: JSON.stringify({ is_active: true, username: Name, surname: Surname, email: Email }),
        });
        console.log(Name)
        const data = await response.json();
        console.log(response)
        console.log(data)
        if (response.status === 200) {

        } else {
            alert('Something went wrong!');
          }
      };

    return (
    <form onSubmit={handleSubmit}>
        <input type="text" placeholder="imię" value={Name} onChange={(e) => setName(e.target.value)} />
        <input type="text" placeholder="nazwisko" value={Surname} onChange={(e) => setSurname(e.target.value)} />
        <input type="text" placeholder="email" value={Email} onChange={(e) => setEmail(e.target.value)} />
        <button type="submit">Zapisz</button>
    </form>
    );
}

export default ProfilePage