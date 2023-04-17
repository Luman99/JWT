import React, {useState, useEffect, useContext} from 'react'
import { useFetcher } from 'react-router-dom'
import AuthContext from '../../context/AuthContext'


// export const Modal = ({ open, onClose, children }) => {
//   return open ? (
//     <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.3)" }}>
//       <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", backgroundColor: "white", padding: 20 }}>
//         {children}
//         <button onClick={onClose}>Zamknij</button>
//       </div>
//     </div>
//   ) : null;
// };


export const EditStudent = ({ student, onClose, onEdit, onDelete }) => {
  const [studentName, setStudentName] = useState(student.username || '');
  const [studentSurname, setStudentSurname] = useState(student.surname || '');
  const [studentEmail, setStudentEmail] = useState(student.email || '');
  // const [username, setUsername] = useState('');
  // const [surname, setSurname] = useState('');
  // const [password, setPassword] = useState('');
  // useEffect(() => {
  //   setGroupName(group.name);
  // }, [group]);
  let {authTokens, logoutUser} = useContext(AuthContext)
  const handleSubmit = async (event) => {
    console.log(student.email);
    event.preventDefault();
    const response = await fetch(`http://http://ec2-18-159-196-177.eu-central-1.compute.amazonaws.com:8000/api/edit_user/${student.email}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + String(authTokens.access),
      },
      body: JSON.stringify({ is_active: true, username: studentName, surname: studentSurname, email: studentEmail }),
    });
    console.log(studentName)
    const data = await response.json();
    console.log(response)
    console.log(data)
    if (response.status === 200) {
      onEdit(student.id, data);
      onClose();
    } else if (response.statusText === 'Unauthorized') {
      logoutUser();
    }
  };


  const handleDelete = async () => {
      const response = await fetch(`http://http://ec2-18-159-196-177.eu-central-1.compute.amazonaws.com:8000/api/edit_user/${student.email}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + String(authTokens.access),
      },
    });
    if (response.status === 204) {
      onDelete();
      onClose();
    } else if (response.statusText === 'Unauthorized') {
      logoutUser();
    } else {
      alert('Something went wrong!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="imię" value={studentName} onChange={(e) => setStudentName(e.target.value)} />
      <input type="text" placeholder="nazwisko" value={studentSurname} onChange={(e) => setStudentSurname(e.target.value)} />
      <input type="text" placeholder="email" value={studentEmail} onChange={(e) => setStudentEmail(e.target.value)} />
      <button type="submit">Zapisz</button>
      <button type="button" onClick={handleDelete}>Usuń studenta</button>
    </form>
  );
};
