import { createSlice } from '@reduxjs/toolkit';

/* ================= INITIAL STATE ================= */
const initialState = {
  quizId: null,
  quizTitle: "",
  category: "all",
  filter: "all", 
  resultFilter: "all", 
  questions: [],
  totalQuestions: 0,

  currentQuestionIndex: 0,
  currentQuestionAnswered: false,
  selectedOption: null,

  answers: {}, // { questionIndex: selectedOption }
  answeredQuestions: [],

  score: 0,
  totalPoints: 0,
  correctAnswers: 0,
  incorrectAnswers: 0,
  skippedQuestions: 0,

  status: "idle",


  timeRemaining: 0,
  timerActive: false,
  startTime: null,
  endTime: null,
  timeTaken: 0,


  showExplanation: false,
  autoAdvance: true,

  isLoading: false,
  error: null
};

/* ================= SLICE ================= */
const quizSlice = createSlice({
  name: "quizz",
  initialState,
  reducers: {

    /* ---------- QUIZ SETUP ---------- */
    setQuizData(state, action) {
      const { quizId, quizTitle, questions } = action.payload;

      state.quizId = quizId;
      state.quizTitle = quizTitle;
      state.questions = questions;

      state.totalQuestions = questions.length;
      state.totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

      state.startTime = Date.now();
      state.status = "active";
    },

    /* ---------- FILTER ---------- */
    setFilter(state, action) {
      state.filter = action.payload; // all | answered | unanswered
    },

    setCurrentCategory(state, action) {
      state.category = action.payload;
    },

    /* ---------- NAVIGATION ---------- */
    setCurrentQuestion(state, action) {
      const index = action.payload;

      state.currentQuestionIndex = index;
      state.currentQuestionAnswered = !!state.answers[index];
      state.selectedOption = state.answers[index] ?? null;
    },

    nextQuestion(state) {
      if (state.currentQuestionIndex < state.totalQuestions - 1) {
        state.currentQuestionIndex++;

        const idx = state.currentQuestionIndex;
        state.currentQuestionAnswered = !!state.answers[idx];
        state.selectedOption = state.answers[idx] ?? null;
      }
    },

    previousQuestion(state) {
      if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex--;

        const idx = state.currentQuestionIndex;
        state.currentQuestionAnswered = !!state.answers[idx];
        state.selectedOption = state.answers[idx] ?? null;
      }
    },

    /* ---------- ANSWERS ---------- */
    selectAnswer(state, action) {
      const { questionId, optionIndex, isCorrect, points } = action.payload;

      const alreadyAnswered = state.answeredQuestions.includes(questionId);
      const prevOption = state.answers[questionId];

      state.answers[questionId] = optionIndex;

      if (!alreadyAnswered) {
        state.answeredQuestions.push(questionId);

        if (isCorrect) {
          state.score += points;
          state.correctAnswers++;
        } else {
          state.incorrectAnswers++;
        }
      } else {
        const question = state.questions[questionId];
        const wasCorrect = prevOption === question?.correctAnswer;

        if (wasCorrect && !isCorrect) {
          state.score -= points;
          state.correctAnswers--;
          state.incorrectAnswers++;
        } else if (!wasCorrect && isCorrect) {
          state.score += points;
          state.correctAnswers++;
          state.incorrectAnswers--;
        }
      }

      state.currentQuestionAnswered = true;
      state.selectedOption = optionIndex;
    },

    skipQuestion(state) {
      state.skippedQuestions++;
    },

    /* ---------- TIMER ---------- */
    startTimer(state) {
      state.timerActive = true;
    },

    pauseTimer(state) {
      state.timerActive = false;
    },

    tick(state) {
      if (state.timerActive && state.timeRemaining > 0) {
        state.timeRemaining--;
      }

      if (state.timeRemaining === 0) {
        state.status = "timeout";
        state.timerActive = false;
      }
    },

    setTimeRemaining(state, action) {
      state.timeRemaining = action.payload;
    },

    /* ---------- QUIZ END ---------- */
    completeQuiz(state) {
      state.status = "completed";
      state.timerActive = false;

      state.endTime = Date.now();
      state.timeTaken = Math.floor(
        (state.endTime - state.startTime) / 1000
      );
    },

    /* ---------- UI ---------- */
    toggleExplanation(state) {
      state.showExplanation = !state.showExplanation;
    },

    toggleAutoAdvance(state) {
      state.autoAdvance = !state.autoAdvance;
    },

    /* ---------- SYSTEM ---------- */
    setLoading(state, action) {
      state.isLoading = action.payload;
    },

    setError(state, action) {
      state.error = action.payload;
    },

    resetQuiz() {
      return initialState;
    },
    setResultFilter(state, action) {
      state.resultFilter = action.payload;
    },
  }
});

export const selectFilteredQuestions = (state) => {
  const { questions, answeredQuestions, filter } = state.quizz;

  return questions
    .map((q, index) => ({ ...q, originalIndex: index }))
    .filter((q) => {
      if (filter === "answered") {
        return answeredQuestions.includes(q.originalIndex);
      }

      if (filter === "unanswered") {
        return !answeredQuestions.includes(q.originalIndex);
      }

      return true;
    });
};
export const selectResultFilteredQuestions = (state) => {
  const { questions, answers, resultFilter } = state.quizz;

  return questions
    .map((q, index) => ({ ...q, originalIndex: index }))
    .filter((q) => {
      const selected = answers[q.originalIndex];

      if (resultFilter === "correct") {
        return selected === q.correctAnswer;
      }

      if (resultFilter === "incorrect") {
        return selected !== undefined && selected !== q.correctAnswer;
      }

      if (resultFilter === "skipped") {
        return selected === undefined;
      }

      return true;
    });
};

export const {
  setQuizData,
  setFilter,
  setResultFilter,  
  setCurrentCategory,
  setCurrentQuestion,
  nextQuestion,
  previousQuestion,
  selectAnswer,
  skipQuestion,
  startTimer,
  pauseTimer,
  tick,
  setTimeRemaining,
  completeQuiz,
  toggleExplanation,
  toggleAutoAdvance,
  setLoading,
  setError,

  resetQuiz
} = quizSlice.actions;

export default quizSlice.reducer;