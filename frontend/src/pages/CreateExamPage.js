import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext'
import axios from 'axios';

const CreateExamPage = () => {
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
        
    }

  }

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/questions/1/',
        {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + String(authTokens.access),
            },
          }
        );
        setQuestions(response.data);
      } catch (error) {
        console.error(error);
        alert('Something went wrong');
      }
    };


    // const fetchUsers = async () => {
    //   try {
    //     const response = await axios.get('http://localhost:8000/api/questions/1/',
    //     {
    //         headers: {
    //           'Content-Type': 'application/json',
    //           'Authorization': 'Bearer ' + String(authTokens.access),
    //         },
    //       }
    //     );
    //     setQuestions(response.data);
    //   } catch (error) {
    //     console.error(error);
    //     alert('Something went wrong');
    //   }
    // };
    fetchQuestions();
    getStudentsGroups();
    //fetchUsers();
  }, []);



  const handleCreateExam = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/create_exam/', 
      {
        name,
        description,
        start,
        end,
        time_to_solve: timeToSolve,
        show_results: showResults,
        block_site: blockSite,
        mix_questions: mixQuestions,
        teacher: user.id,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + String(authTokens.access),
        },
      }
    );
      const examId = response.data.id;
      console.log(selectedQuestion)
      console.log(selectedQuestions)
      await axios.patch(`http://localhost:8000/api/exams/${examId}/add_questions/`, 
      {
        questions: selectedQuestions.map((q) => q.id),
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + String(authTokens.access),
        },
      }
    );
    
    
      await axios.patch(`http://localhost:8000/api/exams/${examId}/add_users/`, 
      {
        users: selectedUsers.map((u) => u.users.id),
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

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    setQuestions((prevQuestions) =>
      prevQuestions.filter((q) => q.id !== selectedQuestion.id)
    );
    setSelectedQuestions((prevSelectedQuestions) => [
      ...prevSelectedQuestions,
      selectedQuestion,
    ]);
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
  };

  return (
    <div>
      <form onSubmit={handleCreateExam}>
        <div>
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div>
          <label htmlFor="start">Start:</label>
          <input type="datetime-local" id="start" value={start} onChange={(e) => setStart(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="end">End:</label>
          <input type="datetime-local" id="end" value={end} onChange={(e) => setEnd(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="timeToSolve">Time to Solve (minutes):</label>
          <input type="number" id="timeToSolve" value={timeToSolve} onChange={(e) => setTimeToSolve(e.target.value)} required />
        </div>
        <div>
<label htmlFor="showResults">Show Results:</label>
<input type="checkbox" id="showResults" checked={showResults} onChange={(e) => setShowResults(e.target.checked)} />
</div>
<div>
<label htmlFor="blockSite">Block Site:</label>
<input type="checkbox" id="blockSite" checked={blockSite} onChange={(e) => setBlockSite(e.target.checked)} />
</div>
<div>
<label htmlFor="mixQuestions">Mix Questions:</label>
<input type="checkbox" id="mixQuestions" checked={mixQuestions} onChange={(e) => setMixQuestions(e.target.checked)} />
</div>
<div>
    <label htmlFor="questionSelect">Select Question:</label>
    <select
      id="questionSelect"
      value={selectedQuestion.id}
      onChange={(e) => {
        const questionId = parseInt(e.target.value);
        const question = questions.find((q) => q.id === questionId);
        console.log(question)
        setSelectedQuestion(question);
      }}
    >
      <option value="">--Select a question--</option>
      {questions.map((q) => (
        <option key={q.id} value={q.id}>
          {q.text}
        </option>
      ))}
    </select>
    <button onClick={handleAddQuestion}>Add</button>
  </div>

  <div>
    <label>Selected Questions:</label>
    <ul>
      {selectedQuestions.map((q) => (
        <li key={q.id}>{q.text}</li>
      ))}
    </ul>
  </div>
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
      console.log(user) //tu jest grupa a nie user, trzeba to naprawić
      setSelectedUser(user);
    }}
  >
    <option value="">--Select a User--</option>
    {studentsGroups.map((group) => (
      <optgroup key={group.id} label={group.name}>
        {group.students &&
          group.students.map((student) => (
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
        <li key={u.id}>{u.email}</li>
      ))}
    </ul>
  </div>

<button type="submit">Create Exam</button>
</form>
</div>
);
};

export default CreateExamPage;
