import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

const EditExamPage = () => {
  const { id } = useParams();
  const { authTokens } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [timeToSolve, setTimeToSolve] = useState(30);
  const [showResults, setShowResults] = useState(true);
  const [blockSite, setBlockSite] = useState(true);
  const [mixQuestions, setMixQuestions] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const history = useNavigate();

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const response = await axios.get(`http://ec2-3-127-214-188.eu-central-1.compute.amazonaws.com:8000/api/exams/${id}/`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + String(authTokens.access),
          },
        });
        console.log(response);
        console.log(1);
        const { name, description, start, end, time_to_solve, show_results, block_site, mix_questions } = response.data;
        setName(name);
        setDescription(description);
        setStart(start);
        setEnd(end);
        setTimeToSolve(time_to_solve);
        setShowResults(show_results);
        setBlockSite(block_site);
        setMixQuestions(mix_questions);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchExam();
  }, [authTokens.access, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const startDate = new Date(start);
      const endDate = new Date(end);
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new Error('Invalid date format');
      }
  
      await axios.patch(
        `http://ec2-3-127-214-188.eu-central-1.compute.amazonaws.com:8000/api/update_exam/${id}/`,
        {
          name,
          description,
          start: startDate.toISOString(),
          end: endDate.toISOString(),
          time_to_solve: timeToSolve,
          show_results: showResults,
          block_site: blockSite,
          mix_questions: mixQuestions,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + String(authTokens.access),
          },
        }
      );
  
      alert('Exam updated successfully');
      history(`/teacherexams`);
    } catch (error) {
      console.error(error);
      alert('Something went wrong');
    }
  };

  return (
    <div>
      <h2>Edit Exam</h2>
      <form onSubmit={handleSubmit}>
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
            <input type="datetime-local" id="start" value={start ? start.slice(0, -1) : ''} onChange={(e) => setStart(e.target.value + ':00Z')} required />
        </div>
        <div>
            <label htmlFor="end">End:</label>
            <input type="datetime-local" id="start" value={end ? end.slice(0, -1) : ''} onChange={(e) => setEnd(e.target.value + ':00Z')} required />
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
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditExamPage;
