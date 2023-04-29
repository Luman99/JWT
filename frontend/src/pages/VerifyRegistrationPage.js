import React, {useState, useEffect, useContext} from 'react'
import { useParams } from 'react-router-dom';
import AuthContext from '../context/AuthContext'


const VerifyRegistrationPage = () => {
  let { token } = useParams();
  let { logoutUserVerify } = useContext(AuthContext)
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    //logoutUserVerify()
    verifyToken(token);
    console.log(email)
    
  }, []);

  const verifyToken = async (token) => {
    const response = await fetch(`http://127.0.0.1:8000/api/verify-token/${token}`);
    const data = await response.json();
    if (data.error) {
      setError(data.error);
    } else {
      setEmail(data.email);
      updateUser(data.email)
    }
  };
  
  const updateUser = async (email) => {
    // e.preventDefault();
    // const { email } = data;
    // if (!email) {
    //   console.error("Email is not set");
    //   return;
    // }
  
    let response = await fetch(`http://127.0.0.1:8000/api/users/${email}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ is_active: true })
    });
    console.log(response)
    // let data = await response.json();
  
    if (response.status === 200) {
      console.log("User updated successfully");
    } else {
      console.error("Something went wrong");
    }
  };

  return (
    <div>
      {error && <div>{error}</div>}
      {email && <div>Email został pomyślnie zweryfikowany: {email}</div>}
    </div>
  );
};

export default VerifyRegistrationPage;