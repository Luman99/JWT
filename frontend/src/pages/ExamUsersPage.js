import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ExamUsersPage = () => {
  const { id } = useParams();
  let { authTokens, user } = useContext(AuthContext);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  let [studentsGroups, setStudentsGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get(`http://127.0.0.1:8000/api/exams/${id}/users/`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + String(authTokens.access),
        },
      });
      return response.data;
    };
  
    const getStudentsGroups = async () => {
      const response = await fetch('http://127.0.0.1:8000/api/students_group/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + String(authTokens.access),
        },
      });
      const data = await response.json();
      return data;
    };
  
    Promise.all([fetchUsers(), getStudentsGroups()])
      .then(([users, groups]) => {
        setStudentsGroups(groups);
        const usersWithGroupNames = users.map((user) => {
          const group = groups.find((group) =>
            group.students.find((student) => student.id === user.id)
          );
          return group ? { ...user, groupName: group.name } : user;
        });
        setSelectedUsers(usersWithGroupNames);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);
  


  const handleCreateExam = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/exams/${id}/users/`,
        {
          users: selectedUsers.map((u) => u.id),
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + String(authTokens.access),
          },
        },
      );
      alert('Exam created successfully');
    } catch (error) {
      console.error(error);
      alert('Something went wrong');
    }
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    setSelectedUsers((prevSelectedUsers) => [...prevSelectedUsers, selectedUser]);
    setSelectedUser(null);
  };

  const handleDeleteUser = (userId) => {
    setSelectedUsers((prevSelectedUsers) => prevSelectedUsers.filter((u) => u.id !== userId));
  };

  return (
    <div>
      <form onSubmit={handleCreateExam}>
        <div>
          <label htmlFor="userSelect">Select User:</label>
          <select
            id="userSelect"
            value={selectedUser ? selectedUser.id : ''}

            onChange={(e) => {
              const userId = parseInt(e.target.value);
              if (isNaN(userId)) {
                setSelectedUser(null);
              } else {
                const group = studentsGroups.find((group) =>
                  group.students.find((student) => student.id === userId),
                );
                const user = group.students.find((student) => student.id === userId);
                setSelectedUser({ ...user, groupName: group.name });
              }
            }}
            
          >
            <option value="">--Select a User--</option>
            {studentsGroups.map((group) => (
              <optgroup key={group.id} label={group.name}>
                {group.students
                  .filter((student) => !selectedUsers.some((u) => u.id === student.id))
                  .map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.email} ({group.name})
                    </option>
                  ))}
              </optgroup>
            ))}
          </select>
          <button onClick={handleAddUser} disabled={!selectedUser}>
            Add User
          </button>

        </div>

        <div>
          <label>Selected Users:</label>
          <ul>
            {selectedUsers.map((u) => (
              <li key={u.id}>
                {u.email} ({u.groupName})
                <button onClick={() => handleDeleteUser(u.id)}>Usuń</button>
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

