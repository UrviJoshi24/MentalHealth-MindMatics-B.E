import React from "react";
import { Routes, Route ,Navigate} from "react-router-dom";
import './App.css';
import Landing from "./pages/Landing";
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ForgotPassword from "./pages/ForgetPassword";
import Home from './pages/Home';
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import Questionnaire from "./pages/Questionnnaire";
import VideoDetection from "./pages/VideoDetection";

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
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>}/>
        <Route path="/questionnaire" element={<Questionnaire/>}/>
        <Route path="/video-based-detection" element={<VideoDetection />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
