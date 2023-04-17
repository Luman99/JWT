import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';

const TeacherExams = () => {
  let { authTokens, user } = useContext(AuthContext);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await axios.get(`http://ec2-18-159-196-177.eu-central-1.compute.amazonaws.com:8000/api/exams/`, {
          headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + String(authTokens.access),
          },
          params: {
              teacher: user.id,
          },
      });
      
        setExams(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchExams();
  }, [authTokens.access, user.id]);

  return (
    <div>
      <h2>Twoje egzaminy:</h2>
      {loading && <p>Loading exams...</p>}
      {error && <p>There was an error loading your exams.</p>}
      {!loading && !error && (
        <>
          {exams.length === 0 && <p>You have no exams yet.</p>}
          <ul>
            {exams.map((exam) => (
              <li key={exam.id}>
                <React.Fragment>
                <Link to={`/edit-exam/${exam.id}`}>{exam.name}</Link>
                <span>    </span>
                <Link to={`/exam_users/${exam.id}`}>Edytuj uczniów</Link>
                </React.Fragment>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default TeacherExams;
