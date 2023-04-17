import React, {useState, useEffect, useContext} from 'react'
import { useFetcher } from 'react-router-dom'
import AuthContext from '../../context/AuthContext'


export const Modal = ({ open, onClose, children }) => {
  return open ? (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.3)" }}>
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", backgroundColor: "white", padding: 20 }}>
        {children}
        <button onClick={onClose}>Zamknij</button>
      </div>
    </div>
  ) : null;
};


export const EditModal = ({ group, onClose, onEdit, onDelete, onDelete2 }) => {
  const [groupName, setGroupName] = useState(group.name || '');
  // useEffect(() => {
  //   setGroupName(group.name);
  // }, [group]);
  let {authTokens, logoutUser} = useContext(AuthContext)
  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch(`http://localhost:8000/api/students_group/${group.id}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + String(authTokens.access),
      },
      body: JSON.stringify({ name: groupName }),
    });
    const data = await response.json();
    if (response.status === 200) {
      onEdit(group.id, data);
      onClose();
    } else if (response.statusText === 'Unauthorized') {
      logoutUser();
    }
  };

  const handleDelete = async () => {
    const response = await fetch(`http://localhost:8000/api/students_group/${group.id}/`, {
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
      <input type="text" value={groupName} onChange={(e) => setGroupName(e.target.value)} />
      <button type="submit">Zapisz</button>
      <button type="button" onClick={handleDelete}>Usuń grupę</button>
    </form>
  );
};
