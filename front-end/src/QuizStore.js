import {configureStore} from '@reduxjs/toolkit';
import quizReducer from './features/Quiz/QuizSlice'
import authReducer from './features/authenthication/authSlice';
const store = configureStore({
    reducer:{
    auth: authReducer,
     quizz:quizReducer,
  
    }
})



export default store

