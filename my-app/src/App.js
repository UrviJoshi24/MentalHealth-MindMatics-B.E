import React from "react";
import { Routes, Route ,Navigate} from "react-router-dom";
import './App.css';
import Landing from "./pages/Landing";
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ForgotPassword from "./pages/ForgetPassword";
import Home from './pages/Home'
import Questionnaire from "./pages/Questionnnaire";
import Audio from "./pages/Audio";
import VideoDetection from "./pages/ExperienceFlow";
import Result from "./pages/Result";
import Cumulative_Report from "./components/Cumulative_Report";
import Diary from "./pages/Diary";
import FoldersPage from "./pages/FoldersPage";
import PersonalizedRecommendation from "./pages/PersonalizedRecommendation";
import StressReliefRecommendations from "./components/StressReliefRecommendations";
import DiaryReport from "./components/DiaryReport";


function Logout(){
  localStorage.clear()
  return <Navigate to="/login" />
}

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/logout" element={<Logout />} />
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/forgotpassword' element={<ForgotPassword/>}/>
        <Route path="/home" element={<Home/>}/>
        <Route path="/questionnaire" element={<Questionnaire/>}/>
        <Route path="/audio-testing" element={<Audio/>}/>
        <Route path="/video-based-detection" element={<VideoDetection />} />
        <Route path='/result' element={<Result />} />
        <Route path="/report" element={<Cumulative_Report />} />
        <Route path="/diary/folders" element={<FoldersPage />} />
        <Route path="diary/folders/diaryentries/:folderId" element={<Diary />} /> 
        <Route path="/personalizedrecommendation" element={<PersonalizedRecommendation />} />  
        <Route path="/stressreliefRecommendations" element={<StressReliefRecommendations />} /> 
        <Route path="/diaryreport" element={<DiaryReport />} />
      </Routes>
    </div>
  );
}

export default App;