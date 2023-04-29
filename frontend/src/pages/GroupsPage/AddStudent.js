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


export const CreateUserModal = ({ group, onClose, onCreate, onEdit }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [surname, setSurname] = useState('');
  const [password, setPassword] = useState('');
  let {user} = useContext(AuthContext)
  
  const handleSubmit = async (event) => {
  event.preventDefault();
  console.log(user.id);
  const response = await fetch('http://127.0.0.1:8000/api/users/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, username, surname, password, students_group: group.id, teacher: user.id, is_teacher: false, is_active: true }), //is_teacher na false
});
  const data = await response.json();
  // console.log(response);
  // console.log(data);
  if (response.status === 201) {
    onEdit();
    onCreate(data);
    onClose();
  } else {
    alert('Something went wrong!');
  }
  };
  
  return (
  <form onSubmit={handleSubmit}>
    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
    <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
    <input type="text" placeholder="Surname" value={surname} onChange={(e) => setSurname(e.target.value)} />
    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
    <button type="submit">Create User</button>
  </form>
  );
  };
