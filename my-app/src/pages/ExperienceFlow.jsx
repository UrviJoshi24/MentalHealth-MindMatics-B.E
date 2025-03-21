import React, { useState, useEffect, useRef} from 'react';
import { media } from '../components/mediaData';
import { motion } from 'framer-motion';
import {getRandomizedQuestions} from '../components/getRandomizedQuestions';
import api from "../api";
import { ACCESS_TOKEN } from "../constants";

const ExperienceFlow = () => {
  const [userType, setUserType] = useState(null);
  const [mediaList, setMediaList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showQuestion, setShowQuestion] = useState(false);
  const [responses, setResponses] = useState([]);
  const [started, setStarted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Video Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const recordedChunksRef = useRef([]);

  const DURATION = 1; // 10 seconds max per slide

  const startRecordingForQuestion = async () => {
    try {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
        }
        if(mediaRecorderRef.current){
            mediaRecorderRef.current.stop();
        }

        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        });
        streamRef.current = stream;
        videoRef.current.srcObject = stream;
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        recordedChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                recordedChunksRef.current.push(event.data);
            }
        };

        mediaRecorder.onstop = () => {
            const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
            setVideoBlob(blob);
        };

        mediaRecorder.start();
        setIsRecording(true);
    } catch (error) {
        console.error('Error accessing webcam:', error);
    }
};

const handlePredict = async (videoBlob) => {
  if (!videoBlob) {
      setMessage({ type: "error", text: "Recording failed!" });
      return;
  }

  setLoading(true);
  setMessage(null);
  setResults(null);

  const formData = new FormData();
  formData.append("video", videoBlob, "video.webm");

  try {
      const response = await api.post("/video/predict_emotion/", formData, {
          headers: {
              Authorization: `Bearer ${ACCESS_TOKEN}`,
              "Content-Type": "multipart/form-data",
          },
      });

      setResults(response.data);
      setMessage({ type: "success", text: "Prediction successful!" });
  } catch {
      setMessage({ type: "error", text: "Something went wrong!" });
  } finally {
      setLoading(false);
  }
};


  const handleStart = async () => {
    if (userType) {
      const selectedMedia = media;
    

      const randomizedQuestions = getRandomizedQuestions(selectedMedia);
      
      setMediaList(randomizedQuestions);
      setStarted(true);
      setCurrentIndex(0);
      setShowQuestion(false);
      startRecordingForQuestion();
    }
};

useEffect(() => {
  let timer;
  let progressTimer;

  if (started && currentIndex < mediaList.length) {
      setShowQuestion(false);
      setProgress(0);
      startRecordingForQuestion(); // start recording for each new question

      progressTimer = setInterval(() => {
          setProgress((prev) => (prev < 100 ? prev + 100 / (DURATION * 10) : 100));
      }, 100);

      timer = setTimeout(() => {
          clearInterval(progressTimer);
          setShowQuestion(true);
      }, DURATION * 1000);
  }

  return () => {
      clearTimeout(timer);
      clearInterval(progressTimer);
      if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if(mediaRecorderRef.current){
          mediaRecorderRef.current.stop();
      }
  };
}, [started, currentIndex, mediaList]);

const stopRecording = () => {
  if (mediaRecorderRef.current) {
    mediaRecorderRef.current.stop();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsRecording(false);
  }
};


const handleNext = () => {
if (!responses[currentIndex] || responses[currentIndex].trim() === '') {
  alert('Please enter a response before proceeding!');
  return;
}

if (currentIndex < mediaList.length - 1) {
  setCurrentIndex(currentIndex + 1);
  setShowQuestion(false);
} else {
  alert('End of the experience. Thanks for sharing!');
  
  handleEnd();
}
};

const handleResponseChange = (e) => {
  const newResponses = [...responses];
  newResponses[currentIndex] = e.target.value || "";
  setResponses(newResponses);
};


const handleEnd = () => {
console.log('User Responses:', responses);
alert('Thank you for your time!');
setStarted(false);
setUserType(null);
setCurrentIndex(0);
setResponses([]);
setIsRecording(false);
setProgress(0);
stopRecording(); // Stop recording when experience ends
handlePredict(videoBlob); 
};


  const fadeVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-300 to-blue-300 p-4">
      {!userType && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeVariant}
          className="text-center space-y-6"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
  Do you want to start to feel the experiences?
</h2>
<div className="flex justify-center">
  <button
    onClick={() => {
      setUserType('user');
      handleStart();
    }}
   // or whatever function you want to trigger
    className="px-8 py-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 shadow-md transition focus:outline-none focus:ring-2 focus:ring-blue-300 mb-12"
  >
    Start
  </button>
</div>
        </motion.div>
      )}

{!userType && !started && (
      <div className="mb-12 flex flex-col justify-center items-center text-white">
    <div className="text-center mb-12">
      <p className="text-xl text-gray-800">
        For Better{" "}
        <span className="text-green-600 font-semibold">
          Experience
        </span>
        , please make sure that:
      </p>
    </div>

    <div className="flex flex-col md:flex-row gap-6">
      {/* Box 1 */}
      <div className="bg-white bg-opacity-30 backdrop-blur-md border border-purple-400 rounded-lg p-6 w-64 text-center hover:scale-105 transition-transform duration-300">
        <div className="mb-4">
          <svg
            className="mx-auto h-12 w-12 text-green-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 14l9-5-9-5-9 5 9 5z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 14l6.16-3.422A12.083 12.083 0 0112 21.5a12.083 12.083 0 01-6.16-10.922L12 14z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className="text-gray-800">
          Your camera is located{" "}
          <span className="text-green-600 font-semibold">
            on the top of your screen
          </span>
        </p>
      </div>

      {/* Box 2 */}
      <div className="bg-white bg-opacity-30 backdrop-blur-md border border-purple-400 rounded-lg p-6 w-64 text-center hover:scale-105 transition-transform duration-300">
        <div className="mb-4">
          <svg
            className="mx-auto h-12 w-12 text-green-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              d="M15 10l4.553-2.276a1 1 0 000-1.788L15 3.66a1 1 0 00-1 0l-4.553 2.276a1 1 0 000 1.788L14 10l-4.553 2.276a1 1 0 000 1.788L14 20.34a1 1 0 001 0l4.553-2.276a1 1 0 000-1.788L15 14"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className="text-gray-800">
          You are{" "}
          <span className="text-green-600 font-semibold">facing</span> the camera
        </p>
      </div>

      {/* Box 3 */}
      <div className="bg-white bg-opacity-30 backdrop-blur-md border border-purple-400 rounded-lg p-6 w-64 text-center hover:scale-105 transition-transform duration-300">
        <div className="mb-4">
          <svg
            className="mx-auto h-12 w-12 text-green-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 8v4l3 3m9-3a9 9 0 11-18 0 9 9 0 0118 0z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className="text-gray-800">
          You are in a{" "}
          <span className="text-green-600 font-semibold">well-lit room</span>
        </p>
      </div>
      {/* Box 4 */}
      <div className="bg-white bg-opacity-30 backdrop-blur-md border border-purple-400 rounded-lg p-6 w-64 text-center hover:scale-105 transition-transform duration-300">
        <div className="mb-4">
        <svg
  className="mx-auto h-12 w-12 text-green-500"
  fill="none"
  stroke="currentColor"
  strokeWidth="2"
  viewBox="0 0 24 24"
>
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z"
  />
</svg>
        </div>
        <p className="text-gray-800">
          Be {" "}
          <span className="text-green-600 font-semibold">Genuine</span> {" "} to yourself
        </p>
      </div>
      {/* Box 5 */}
      <div className="bg-white bg-opacity-30 backdrop-blur-md border border-purple-400 rounded-lg p-6 w-64 text-center hover:scale-105 transition-transform duration-300">
        <div className="mb-4">
        <svg
  className="mx-auto h-12 w-12 text-green-500"
  fill="none"
  stroke="currentColor"
  strokeWidth="2"
  viewBox="0 0 24 24"
>
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
  />
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M9 12l2 2 4-4"
  />
</svg>
        </div>
        <p className="text-gray-800">
          Images and Videos used {" "}
          <span className="text-green-600 font-semibold">are not for</span> {" "} harming your feeling
        </p>
      </div>
    </div>
  </div>
  )}

      {userType && !started && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeVariant}
          className="text-center mt-8 space-y-4"
        >
          <h3 className="text-2xl text-gray-700 font-semibold">
            You selected: <span className="capitalize">{userType}</span>
          </h3>
          <button
            onClick={handleStart}
            className="px-8 py-3 bg-purple-500 text-white rounded-2xl hover:bg-purple-600 shadow-lg transition focus:outline-none focus:ring-2 focus:ring-purple-300"
          >
            Start
          </button>
        </motion.div>
      )}

      {started && mediaList.length > 0 && (
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="w-full max-w-3xl mt-10 space-y-6"
        >
          <h3 className="text-lg text-gray-600 text-center">
            Experience {currentIndex + 1} of {mediaList.length}
          </h3>

          {/* Progress Bar */}
          <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-100"
              style={{ width: `${progress}%` }}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
            />
          </div>

          <div className="rounded-xl overflow-hidden shadow-lg bg-white p-4 flex flex-col items-center justify-center">
            
            {mediaList[currentIndex].type === 'image' ? (
              <img
                src={mediaList[currentIndex].src}
                alt={`Media ${currentIndex + 1}`}
                className="w-full h-64 object-cover rounded-lg"
              />
            ) : (
              <video
                width="100%"
                height="300"
                controls
                autoPlay
                muted
                className="rounded-lg"
                aria-label={`Video ${currentIndex + 1}`}
              > 
                <source src={mediaList[currentIndex].src} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
          
          {started && (
        <div className="flex flex-col items-center mt-6">
          <div className="flex-1">         
   <video
            ref={videoRef}
            autoPlay
            playsInline
            className="fixed top-4 right-4 w-56 h-40 rounded-lg shadow-lg border border-gray-300 border rounded-lg w-[320px] h-[240px]"
          />
          </div>
          

          <div className="mt-4">
            {isRecording ? (
              <button
                onClick={stopRecording}
                className="fixed top-15 right-4 px-4 py-2 bg-red-500 text-white rounded"
              >
                Stop Recording
              </button>
            ) : (
              <button
                onClick={handleStart}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Start Recording
              </button>
            )}
          </div>

          
    
          {showQuestion && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeVariant}
              className="bg-white p-6 rounded-xl shadow-md w-full"
            >
              <label htmlFor="user-response" className="text-lg font-medium text-gray-700 mb-4 block">
                {mediaList[currentIndex].question}
              </label>
              <textarea
                id="user-response"
                rows="4"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Your response..."
                value={responses[currentIndex] || ''}
                onChange={handleResponseChange}
                required
                aria-required="true"
              />
              <div className="flex justify-between mt-4">
                <button
                  onClick={handleNext}
                  className="px-6 py-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition focus:outline-none focus:ring-2 focus:ring-indigo-300"
                >
                  {currentIndex === mediaList.length - 1 ? 'Finish' : 'Next'}
                </button>
                <button
                  onClick={handleEnd}
                  className="px-6 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition focus:outline-none focus:ring-2 focus:ring-red-300"
                >
                  End
                </button>
              </div>
              </motion.div> 
        )}
</div>
)}
</motion.div>
)};
</div>
  )}
export default ExperienceFlow;