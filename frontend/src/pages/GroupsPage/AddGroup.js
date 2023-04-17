import React, {useState, useContext} from 'react'
import AuthContext from '../../context/AuthContext'

export const CreateStudentsGroupModal = ({ onClose, onCreate, onEdit }) => {
const [name, setName] = useState('');
let {authTokens, user} = useContext(AuthContext)

const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(user.id);
    const response = await fetch('http://ec2-18-159-196-177.eu-central-1.compute.amazonaws.com:8000/api/create_students_group/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + String(authTokens.access),
    },
    body: JSON.stringify({ name, teacher: user.id }),
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
    <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
    <button type="submit">Create Group</button>
  </form>
  );
  };