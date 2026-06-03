import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { startTimer, setTimeRemaining } from './features/Quiz/QuizSlice';


import Routing from './Routing';

function App() {
  const { totalQuestions } = useSelector((store) => store.quizz);
  const dispatch = useDispatch();

  useEffect(() => {
    if (totalQuestions) {
      const timeInSeconds = totalQuestions * 10;
      dispatch(setTimeRemaining(timeInSeconds));
      dispatch(startTimer());
    }
  }, [totalQuestions, dispatch]);

  return (
    <BrowserRouter>
          <Routing/>
    </BrowserRouter>
  );
}

export default App;