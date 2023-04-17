import React, {useState, useEffect, useContext} from 'react'
import { useFetcher } from 'react-router-dom'
import AuthContext from '../../context/AuthContext'
import { EditModal, Modal } from './EditGroupName';
import { CreateUserModal } from './AddStudent';
import { CreateStudentsGroupModal } from './AddGroup';
import { EditStudent } from './EditStudent';


const GroupsPage = () => {
  let [studentsGroups, setStudentsGroups] = useState([])
  let [modalOpen, setModalOpen] = useState(false);
  let [modalOpen2, setModalOpen2] = useState(false);
  let [modalOpen3, setModalOpen3] = useState(false);
  let [modalOpen4, setModalOpen4] = useState(false);
  let [selectedGroup, setSelectedGroup] = useState({})
  let [selectedStudent, setSelectedStudent] = useState({})
  let {authTokens, logoutUser} = useContext(AuthContext)

  useEffect(()=> {
      getStudentsGroups()
  }, [])

  let getStudentsGroups = async()=>{
    let response = await fetch('http://http://ec2-18-159-196-177.eu-central-1.compute.amazonaws.com:8000/api/students_group/', {
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

  let handleEditStudent = (studentId, newStudent) => {
    getStudentsGroups();
    setStudentsGroups((prevGroups) =>
      prevGroups.map((group) => {
        if (group.id === selectedGroup.id) {
          return {
            ...group,
            students: group.students.map((student) =>
              student.id === studentId ? newStudent : student
            ),
          };
        }
        return group;
      })
    );
  };
  

  let handleCreateUser = () => {
    getStudentsGroups()
  };

  // let handleCreateGroup = (newGroup) => {
  //   //getStudentsGroups()
  //   setStudentsGroups([...studentsGroups, newGroup])
  //   };

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
                <li key={student.id}>
                  {student.username} {student.surname} {student.email}
                  <span>    </span>
                  <button onClick={() => {
                    setSelectedStudent({...student, pk: student.id});
                    setModalOpen4(true);
                  }}>Edit Student</button>
                </li>
              )) : []}


            </ul>
            <button onClick={() => {
              setSelectedGroup({...group, pk: group.id});
              setModalOpen2(true);
            }}>Dodaj ucznia</button>
          </li>
          ))}
          <br />
          <button onClick={() => setModalOpen3(true)}>Dodaj grupę</button>
        </ul>
        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <EditModal group={selectedGroup} onClose={() => setModalOpen(false)} onEdit={handleEdit} onDelete={handleCreateUser} />
        </Modal>
        <Modal open={modalOpen2} onClose={() => setModalOpen2(false)}>
        <CreateUserModal group={selectedGroup} onClose={() => setModalOpen2(false)} onCreate={(data) => { console.log(data)  }} onEdit={handleCreateUser} />
        </Modal>
        <Modal open={modalOpen3} onClose={() => setModalOpen3(false)}>
        <CreateStudentsGroupModal onClose={() => setModalOpen3(false)} onCreate={(data) => { console.log(data)  }} onEdit={handleCreateUser} />
        </Modal>
        <Modal open={modalOpen4} onClose={() => setModalOpen4(false)}>
        <EditStudent student={selectedStudent} onClose={() => setModalOpen4(false)} onDelete={handleCreateUser} onEdit={handleEditStudent}/>
        </Modal>
        </div>
      );
};

export default GroupsPage