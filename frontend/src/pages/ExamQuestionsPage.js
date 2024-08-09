import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ExamQuestionsPage = () => {
  const { id } = useParams();
  let { authTokens, user } = useContext(AuthContext);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState(1);
  const categoryChoices = [
    { id: 1, name: 'przepisy_ogolne' },
    { id: 2, name: 'znaki_drogowe' },
    { id: 3, name: 'zasady_pierwszenstwa' },
    { id: 4, name: 'obsluga_roweru' },
    { id: 5, name: 'pierwsza_pomoc' },
  ];

  const getAllQuestions = async (category_id) => {
    const response = await axios.get(`http://127.0.0.1:8000/api/questions/${category_id}/`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + String(authTokens.access),
      },
    });
    console.log(response.data)
    return response.data;
  };
  
  useEffect(() => {
    const fetchQuestions = async () => {
      const response = await axios.get(`http://127.0.0.1:8000/api/exams/${id}/questions/`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + String(authTokens.access),
        },
      });
      return response.data;
    };
  
    Promise.all([fetchQuestions(), getAllQuestions(selectedCategory)])
      .then(([examQuestions, allQuestions]) => {
        setSelectedQuestions(examQuestions);
        setQuestions(allQuestions.filter(q => !examQuestions.some(eq => eq.id === q.id)));
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);
  
  useEffect(() => {
    const fetchQuestionsForCategory = async () => {
      const allQuestions = await getAllQuestions(selectedCategory);
      setQuestions(allQuestions.filter(q => !selectedQuestions.some(eq => eq.id === q.id)));
    };
  
    console.log(selectedCategory)
    if (selectedCategory) {
      fetchQuestionsForCategory();
    }
  }, [selectedCategory]);
  
  

  const handleUpdateQuestions = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/exams/${id}/questions/`,
        {
          questions: selectedQuestions.map((q) => q.id),
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + String(authTokens.access),
          },
        },
      );
      alert('Questions updated successfully');
    } catch (error) {
      console.error(error);
      alert('Something went wrong');
    }
  };

  const handleAddQuestion = (e) => {
    e.preventDefault();
    setSelectedQuestions((prevSelectedQuestions) => [...prevSelectedQuestions, selectedQuestion]);
    setQuestions((prevQuestions) => prevQuestions.filter((q) => q.id !== selectedQuestion.id));
    setSelectedQuestion(null);
  };

  const handleDeleteQuestion = (questionId) => {
    setSelectedQuestions((prevSelectedQuestions) => prevSelectedQuestions.filter((q) => q.id !== questionId));
    const deletedQuestion = selectedQuestions.find((q) => q.id === questionId);
    setQuestions((prevQuestions) => [...prevQuestions, deletedQuestion]);
  };

  return (
    <div>
      <form onSubmit={handleUpdateQuestions}>
        <div>
          <label htmlFor="categorySelect">Select Category:</label>
          <select
            id="categorySelect"
            value={selectedCategory}
            onChange={(e) => {
                setSelectedCategory(parseInt(e.target.value));
                setSelectedQuestion(null);
              }}
              
          >
            {categoryChoices.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="questionSelect">Select Question:</label>
          <select
            id="questionSelect"
            value={selectedQuestion?.id || ''}
            onChange={(e) => {
                const questionId = parseInt(e.target.value);
                if (isNaN(questionId)) {
                  setSelectedQuestion(null);
                } else {
                  const question = questions.find((q) => q.id === questionId);
                  setSelectedQuestion(question);
                }
              }}
              
            >
            <option value="">--Select a question--</option>
            {questions.map((q) => (
                <option key={`${selectedCategory}-${q.id}`} value={q.id}>
                {q.text}
                </option>
            ))}
            </select>


            <button onClick={handleAddQuestion} type="button" disabled={!selectedQuestion}>
                Add Question
            </button>

        </div>
        <ul>
            {selectedQuestions.map((q) => (
                <li key={`${selectedCategory}-${q.id}`}>
                {q.text}{' '}
                <button onClick={() => handleDeleteQuestion(q.id)} type="button">
                    Delete
                </button>
                </li>
            ))}
        </ul>

        <button type="submit">Update Questions</button>
      </form>
    </div>
  );
          }
export default ExamQuestionsPage;

