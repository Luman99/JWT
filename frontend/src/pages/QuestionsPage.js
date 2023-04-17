import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

function shuffle(array) {
    let currentIndex = array.length;
    let temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }
  
  function getCategory(id) {
    if(id==1) {
      return "Przepisy ogólne"
    } else if(id==2){
      return "Znaki drogowe"
    } else if(id==3){
      return "Zasady pierwszeństwa"
    } else if(id==4){
      return "Obsługa roweru"
    } else {
      return "Pierwsza pomoc"
    }

  }

const CategoryQuestions = () => {
  const { category_id } = useParams();
  const [globalData, setGLobalData] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAnswerStatus, setShowAnswerStatus] = useState(false);
  const [answerStatus, setAnswerStatus] = useState('');
  const [questionOrder, setQuestionOrder] = useState([]);
  let { authTokens, logoutUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchQuestions = async () => {
      const response = await fetch(
        `http://localhost:8000/api/questions/${category_id}/`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + String(authTokens.access),
          },
        }
      );
      const data = await response.json();
      setGLobalData(data);
    // Losowa kolejność pytań
    const shuffledQuestions = shuffle(data);
    setQuestions(shuffledQuestions);
    // Ustawiamy kolejność pytań na permutację indeksów pytań
    setQuestionOrder([...Array(data.length).keys()].sort(() => Math.random() - 0.5));
  };
    fetchQuestions();
  }, [category_id, authTokens.access]);

  const handleAnswerClick = (answer) => {
    if (answer.correct) {
      setAnswerStatus('Dobra odpowiedź!');
    } else {
      setAnswerStatus('Zła odpowiedź.');
    }
    setShowAnswerStatus(true);
  };

  const handleNextQuestionClick = () => {
    if (currentQuestionIndex === questionOrder.length - 1) {
      // Gdy dojdziemy do końca permutacji, ustawiamy stan kolejności pytań na nową losową permutację i ustawiamy indeks na 0
      const shuffledQuestions = shuffle(globalData);
      setQuestions(shuffledQuestions);
      setQuestionOrder([...Array(questions.length).keys()].sort(() => Math.random() - 0.5));
      setCurrentQuestionIndex(0);
    }
    else {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
    setShowAnswerStatus(false);
    setAnswerStatus('');
  };
  
  

  const handlePreviousQuestionClick = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    setShowAnswerStatus(false);
    setAnswerStatus('');
  };

  return (
    <div>
      {questions.length > 0 && (
        <>
          <h1>Pytania z kategorii {getCategory(category_id)}</h1>
          <h3>
            Pytanie {currentQuestionIndex + 1}/{questions.length}
          </h3>
          <h4>{questions[currentQuestionIndex].text}</h4>
          <ul>
            {questions[currentQuestionIndex].answer_set.map((answer) => (
              <li key={answer.id}>
                <button
                  onClick={() => handleAnswerClick(answer)}
                  disabled={showAnswerStatus}
                >
                  {answer.text}
                </button>
              </li>
            ))}
          </ul>
          {showAnswerStatus && <p>{answerStatus}</p>}
          <div>
            {/* <button
              onClick={handlePreviousQuestionClick}
              disabled={currentQuestionIndex === 0}
            >
              Poprzednie
            </button> */}
        <button
        onClick={handleNextQuestionClick}
        //disabled={currentQuestionIndex === questions.length - 1 && !showAnswerStatus}
        >
        Następne
        </button>

          </div>
        </>
      )}
    </div>
  );
};

export default CategoryQuestions;
