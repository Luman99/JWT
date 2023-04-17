import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ExamUsersPage = () => {
  const { id } = useParams();
  let {authTokens, user} = useContext(AuthContext)
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [timeToSolve, setTimeToSolve] = useState(30);
  const [showResults, setShowResults] = useState(true);
  const [blockSite, setBlockSite] = useState(true);
  const [mixQuestions, setMixQuestions] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  let [studentsGroups, setStudentsGroups] = useState([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/exams/${id}/users/`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + String(authTokens.access),
          },
        });
        setSelectedUsers(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    let getStudentsGroups = async()=>{
      let response = await fetch('http://localhost:8000/api/students_group/', {
        method:'GET',
        headers:{
  
          'Content-Type':'application/json',
          'Authorization':'Bearer ' + String(authTokens.access)
        }
      })
      let data = await response.json()
  
      if(response.status === 200){
          setStudentsGroups(data)
      }else if(response.statusText === 'Unauthorized'){
          
      }
  
    }


    fetchUsers();
    getStudentsGroups();

  }, []);



  const handleCreateExam = async (e) => {
    e.preventDefault();
    try {
    
      await axios.patch(`http://localhost:8000/api/exams/${id}/users/`, 
      {
        users: selectedUsers.map((u) => u.id),
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + String(authTokens.access),
        },
      }
      );
      alert('Exam created successfully');
    } catch (error) {
      console.error(error);
      alert('Something went wrong');
    }
  };


  const handleAddUser = async (e) => {
    e.preventDefault();
    setUsers((prevUsers) =>
      prevUsers.filter((u) => u.id !== selectedUser.id)
    );
    setSelectedUsers((prevSelectedUsers) => [
      ...prevSelectedUsers,
      selectedUser,
    ]);
    setStudentsGroups((prevGroups) =>
    prevGroups.map((group) => {
      if (group.students) {
        return {
          ...group,
          students: group.students.filter(
            (student) => student.id !== selectedUser.id
          ),
        };
      }
      return group;
    })
  );
  };

  const handleDeleteUser = async (e) => {
    e.preventDefault();
    setUsers((prevUsers) =>
      prevUsers.filter((u) => u.id !== selectedUser.id)
    );
    setSelectedUsers((prevSelectedUsers) => [
      ...prevSelectedUsers,
      selectedUser,
    ]);
    setStudentsGroups((prevGroups) =>
    prevGroups.map((group) => {
      if (group.students) {
        return {
          ...group,
          students: group.students.filter(
            (student) => student.id !== selectedUser.id
          ),
        };
      }
      return group;
    })
  );
  };

  return (
    <div>
      <form onSubmit={handleCreateExam}>
  <div>
  <label htmlFor="userSelect">Select User:</label>
  <select 
    id="userSelect" 
    value={selectedUser.id}
    onChange={(e) => {
      const userId = parseInt(e.target.value);
      const user = studentsGroups.find((group) =>
        group.students.find((student) => student.id === userId)
        ).students.find((student) => student.id === userId);
      console.log(user)
      setSelectedUser(user);
    }}
  >
    <option value="">--Select a User--</option>
    {studentsGroups.map((group) => (
      <optgroup key={group.id} label={group.name}>
        {group.students &&
           group.students
           .filter((student) => !selectedUsers.some((u) => u.id === student.id))
           .map((student) => (
             <option key={student.id} value={student.id}>
               {student.email}
              
             </option>
          ))}
           
      </optgroup>
    ))}
  </select>
  <button onClick={handleAddUser}>Add User</button>
</div>

<div>
    <label>Selected Users:</label>
    <ul>
      {selectedUsers.map((u) => (
        <li key={u.id}>{u.email}
        <button onClick={() => handleDeleteUser(user.id)}>Usuń</button>
        </li>
      ))}
    </ul>
  </div>

<button type="submit">Zapisz</button>
</form>
</div>
);
};

export default ExamUsersPage;
