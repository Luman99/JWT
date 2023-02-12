import React, {useState, useEffect, useContext} from 'react'
import { useFetcher } from 'react-router-dom'
import AuthContext from '../../context/AuthContext'
import { EditModal, Modal } from './EditGroupName';
import { CreateUserModal } from './AddStudent';


const GroupsPage = () => {
  let [studentsGroups, setStudentsGroups] = useState([])
  let [modalOpen, setModalOpen] = useState(false);
  let [modalOpen2, setModalOpen2] = useState(false);
  let [selectedGroup, setSelectedGroup] = useState({})
  let {authTokens, logoutUser} = useContext(AuthContext)

  useEffect(()=> {
      getStudentsGroups()
  }, [])

  let getStudentsGroups = async()=>{
    let response = await fetch('http://127.0.0.1:8000/api/students_group/', {
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
        logoutUser()
    }

  }

  let handleEdit = (groupId, newGroup) => {
    getStudentsGroups()
    setStudentsGroups(
      studentsGroups.map(group =>
      group.id === groupId ? newGroup : group
      )
    );
  };

  let handleCreateUser = () => {
    getStudentsGroups()
  };


    return (
      <div>
        <h1>Groups</h1>
        <ul>
          {studentsGroups.map(group => (
          <li key={group.id}>
            {group.name}
            <span>    </span>
            <button onClick={() => {
              setSelectedGroup({...group, pk: group.id});
              setModalOpen(true);
            }}>Edit</button>
            
            <ul>
              {group.students ? group.students.map(student => (
                <li key={student.id}>{student.username}</li>
              )) : []}
            </ul>
            <button onClick={() => {
              setSelectedGroup({...group, pk: group.id});
              setModalOpen2(true);
            }}>Dodaj ucznia</button>
          </li>
          ))}
        </ul>
        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <EditModal group={selectedGroup} onClose={() => setModalOpen(false)} onEdit={handleEdit} />
        </Modal>
        <Modal open={modalOpen2} onClose={() => setModalOpen2(false)}>
        <CreateUserModal group={selectedGroup} onClose={() => setModalOpen2(false)} onCreate={(data) => { console.log(data)  }} onEdit={handleCreateUser} />
        </Modal>
        </div>
      );
};

export default GroupsPage