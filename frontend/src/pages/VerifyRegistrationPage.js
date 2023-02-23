import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';


const VerifyRegistrationPage = () => {
  let { token } = useParams();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    verifyToken(token);
    updateUser()
  }, []);

  const verifyToken = async (token) => {
    const response = await fetch(`http://127.0.0.1:8000/api/verify-token/${token}`);
    const data = await response.json();
    if (data.error) {
      setError(data.error);
    } else {
      setEmail(data.email);
    }
  };
  
  const updateUser = async () => {
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