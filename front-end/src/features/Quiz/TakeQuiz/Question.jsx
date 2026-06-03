import { useNavigate } from 'react-router-dom';
import { useRef, useEffect } from 'react';
import tw from "tailwind-styled-components";
import Button from "../../../ui/Button";
import { Container, Header, Content, QuestionText, Options, Option, Footer } from '../QuestionComponent';
import { useDispatch, useSelector } from "react-redux";
import { previousQuestion, nextQuestion, selectAnswer, completeQuiz, tick } from '../QuizSlice';
import axiosPrivate from '../../../utils/axiosPrivate';

function Question() {
  const navigate = useNavigate();
  const { questions, currentQuestionIndex, answers, quizId, timeRemaining, timerActive,status,startTime } = useSelector((store) => store.quizz);
  const dispatch = useDispatch();
  const currentQuestion = questions[currentQuestionIndex];
  const hasUnsavedChanges = useRef(false);
  useEffect(() => {
    let interval;
    if (timerActive && timeRemaining > 0 && status === 'active') {
      interval = setInterval(() => {
        dispatch(tick());
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timeRemaining, status, dispatch]);
  useEffect(() => {
    if (status === 'timeout') {
      handleAutoSubmit();
    }
  }, [status]);

  const handleAutoSubmit = async () => {
    try {
      const startResponse = await axiosPrivate.post('/attempts', {
        quizId
      });
      const attemptId = startResponse.data.data.attempt._id;
      
  
      const formattedAnswers = Object.entries(answers).map(([index, selectedOption]) => {
        const question = questions[parseInt(index)];
        return {
          questionId: question?._id,  
          selectedOption
        };
      }).filter(item => item.questionId);
      
      const timeTaken = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
      
      await axiosPrivate.patch(`/attempts/${attemptId}/submit`, {
        answers: formattedAnswers,
        timeTaken
      });
      
      dispatch(completeQuiz());
      navigate(`/result/${quizId}`);
    } catch (error) {
      console.error('Error auto-submitting quiz:', error);
      dispatch(completeQuiz());
      navigate(`/result/${quizId}`);
    }
  };

  const saveProgressToBackend = async () => {
    try {
      await axiosPrivate.post('/attempts/save-progress', {
        quizId,
        answers,
        currentQuestionIndex
      });
      console.log('Progress saved');
      hasUnsavedChanges.current = false;
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };


  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      hasUnsavedChanges.current = true;
    }
  }, [answers]);

  // Save every 5 minutes ONLY if there are changes
  useEffect(() => {
    const interval = setInterval(() => {
      if (hasUnsavedChanges.current) {
        saveProgressToBackend();
      }
    }, 300000); 

    return () => clearInterval(interval);
  }, [answers, quizId, currentQuestionIndex]);


  useEffect(() => {
    const handleBeforeUnload = () => {
      if (hasUnsavedChanges.current) {
        navigator.sendBeacon('/attempts/save-progress', JSON.stringify({
          quizId,
          answers,
          currentQuestionIndex
        }));
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [answers, quizId, currentQuestionIndex]);

  const handleOptionSelect = (optionIndex) => {
    const isCorrect = optionIndex === currentQuestion.correctAnswer;
    dispatch(selectAnswer({
      questionId: currentQuestionIndex,
      optionIndex,
      isCorrect,
      points: currentQuestion.points
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex === questions.length - 1) {
      navigate(`/confirmation/${quizId}`);
    } else {
      dispatch(nextQuestion());
    }
  };



  return (
    <Container>

      {/* HEADER */}
      <Header>
        <div className="flex flex-col gap-1">
          <h3 className="text-sm text-gray-500">
            Question {currentQuestionIndex + 1}
          </h3>
          <p className="text-xs text-gray-400">
            Choose the correct answer
          </p>
        </div>

        <span className="text-xs bg-primary-100 text-primary-700 px-3 py-1 rounded-full font-medium">
          {questions[currentQuestionIndex]?.points} pts
        </span>
      </Header>

      {/* CONTENT */}
      <Content>

        {/* Question */}
        <QuestionText>
          {questions[currentQuestionIndex]?.text}
        </QuestionText>

        {/* Options */}
        <Options>
          {questions[currentQuestionIndex]?.options?.map((optn, index) => {
            const isSelected = answers[currentQuestionIndex] === index;

            return (
              <Option
                key={index}
                $selected={isSelected}
              >
                <input
                  type="radio"
                  name={`answer-${currentQuestionIndex}`}
                  checked={isSelected}
                  onChange={() => handleOptionSelect(index)}
                  className="hidden"
                />

                {/* Custom circle */}
                <span
                  className={`
                    w-5 h-5 rounded-full border flex items-center justify-center
                    ${isSelected ? "border-primary-600" : "border-gray-300"}
                  `}
                >
                  {isSelected && (
                    <span className="w-2.5 h-2.5 bg-primary-600 rounded-full" />
                  )}
                </span>

                {/* Text */}
                <span className="flex-1">{optn}</span>

              </Option>
            );
          })}
        </Options>

      </Content>

      {/* FOOTER */}
      <Footer>
        <Button
          $size="small"
          $variation="secondary"
          onClick={() => dispatch(previousQuestion())}
          disabled={currentQuestionIndex === 0}
          className="w-full sm:w-auto"
        >
          Previous
        </Button>

        <Button
          $size="small"
          $variation="primary"
          onClick={handleNext}
          className="w-full sm:w-auto"
        >
          {currentQuestionIndex === questions.length - 1 ? 'Review' : 'Next'}
        </Button>
      </Footer>

      </Container>
  );
}

export default Question;