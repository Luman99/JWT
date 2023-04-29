import React, { useState, useEffect, useContext } from 'react';
import { useFetcher } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const ProfilePage = () => {
  let { authTokens, user } = useContext(AuthContext);
  const [name, setName] = useState(localStorage.getItem('name') || user.username || '');
  const [surname, setSurname] = useState(localStorage.getItem('surname') || user.surname || '');
  const [email, setEmail] = useState(localStorage.getItem('email') || user.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    localStorage.setItem('name', name); // zapisz wartość do localStorage
    localStorage.setItem('surname', surname);
    localStorage.setItem('email', email);
    const response = await fetch(`http://127.0.0.1:8000/api/edit_user/${user.email}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + String(authTokens.access),
      },
      body: JSON.stringify({ is_active: true, username: name, surname: surname, email: email }),
    });
    const data = await response.json();
    if (response.status === 200) {
      setSuccessMessage('Profile updated successfully!');
    } else {
      alert('Something went wrong!');
    }
  };

  const handlePasswordChange = async (event) => {
    event.preventDefault();
    setPasswordError('');
    setSuccessMessage('');

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirm password do not match.');
      return;
    }

    const response = await fetch('http://127.0.0.1:8000/api/change_password/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + String(authTokens.access),
      },
      body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
    });

    if (response.status === 200) {
      setSuccessMessage('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else if (response.status === 401) {
      setPasswordError('Incorrect current password.');
    } else {
      setPasswordError('Something went wrong!');
    }
  };

  return (
    <div>
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label htmlFor="surname">Surname:</label>
          <input type="text" id="surname" value={surname} onChange={(e) => setSurname(e.target.value)} />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <button type="submit">Save</button>
      </form>

      <h2>Change Password</h2>
      <form onSubmit={handlePasswordChange}>
      <div>
          <label htmlFor="currentPassword">Current Password:</label>
          <input type="password" id="currentPassword" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="newPassword">New Password:</label>
          <input type="password" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        </div>
        {passwordError && <p>{passwordError}</p>}
        {successMessage && <p>{successMessage}</p>}
        <button type="submit">Change Password</button>
      </form>
    </div>
  );
};

export default ProfilePage;
