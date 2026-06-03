import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {tick} from '../QuizSlice'



function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
  
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
  
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }
  

function Timer() {
   const dispatch = useDispatch()
   const {timeRemaining}=useSelector((store)=>store.quizz) 

  
 useEffect(()=>{

  const intervalId=setInterval(()=>{
       dispatch(tick())
        
  },1000)
    
  return () => clearInterval(intervalId);
 },[dispatch])


  return (
    <div>
         <p>{formatTime(timeRemaining)}</p>
    </div>
  )
}

export default Timer
