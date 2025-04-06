import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { media } from '../components/mediaData';
import { motion, AnimatePresence } from 'framer-motion';
import { getRandomizedQuestions } from '../components/getRandomizedQuestions';
import api from "../api";
import { ACCESS_TOKEN } from "../constants";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { FiChevronRight, FiCheck, FiX } from "react-icons/fi";
import VideoGraphs from "../components/VideoGraphs";
import Loading from "../components/Loading";


// Constants
const DURATION = 5; // seconds per slide
const fadeVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const slideVariants = {
  hidden: { opacity: 0, x: -100 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
  exit: { opacity: 0, x: 100, transition: { duration: 0.3, ease: "easeIn" } },
};

const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: { duration: 2, repeat: Infinity },
};

// Separate SpeechToText hook
const useSpeechToText = ({ currentIndex, setResponses }) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Initialize speech recognition only once
    if (!recognitionRef.current) {
      recognitionRef.current = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognitionRef.current.lang = "en-US";
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
    }

    const recognition = recognitionRef.current;

    recognition.onresult = (event) => {
      let finalTranscript = "";
      let interimTranscript = "";
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript + " ";
        } else {
          interimTranscript += result[0].transcript;
        }
      }
      setResponses((prevResponses) => ({
        ...prevResponses,
        [currentIndex]: finalTranscript + interimTranscript,
      }));
    };

    recognition.onerror = (event) => {
      console.error("Speech Recognition Error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      if (isListening) {
        try {
          recognition.start();
        } catch (error) {
          console.error("Error restarting recognition:", error);
          setIsListening(false);
        }
      } else {
        setIsListening(false);
      }
    };

    return () => {
      if (isListening) {
        recognition.stop();
      }
    };
  }, [currentIndex, setResponses, isListening]);

  const startListening = useCallback(() => {
    setIsListening(true);
    recognitionRef.current.start();
  }, []);

  const stopListening = useCallback(() => {
    setIsListening(false);
    recognitionRef.current.stop();
  }, []);

  return { isListening, startListening, stopListening };
};

// Separate video recording hook
const useVideoRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const recordedChunksRef = useRef([]);

  const startRecording = useCallback(async () => {
    try {
      // Clean up previous recording if exists
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
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
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    
    // Ensure we always clean up the stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log("Track stopped:", track.kind);
      });
      streamRef.current = null;
    }
    
    setIsRecording(false);
  }, []);

  return { 
    isRecording, 
    videoBlob, 
    videoRef, 
    startRecording, 
    stopRecording 
  };
};

// Welcome screen component
const WelcomeScreen = ({ onStart }) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={fadeVariant}
    className="text-center space-y-6"
  >
    <motion.h2 
      className="text-3xl font-bold text-gray-800 mb-8 text-center"
      animate={{ scale: [1, 1.05, 1], opacity: [0.9, 1, 0.9] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      Do you want to start to feel the experiences?
    </motion.h2>
    <motion.div 
      className="flex justify-center"
      whileHover={{ scale: 1.05 }}
    >
      <motion.button
        onClick={onStart}
        className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-xl transition focus:outline-none focus:ring-2 focus:ring-blue-300 mb-12"
        whileTap={{ scale: 0.95 }}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        Start Your Journey
      </motion.button>
    </motion.div>
  </motion.div>
);

// Instructions component
const Instructions = () => (
  <motion.div 
    className="mb-12 flex flex-col justify-center items-center text-white"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, delay: 0.2 }}
  >
    <motion.div className="text-center mb-12">
      <motion.p 
        className="text-xl text-gray-800"
        animate={{ 
          textShadow: ["0px 0px 0px rgba(0,0,0,0)", "0px 0px 5px rgba(72,187,120,0.5)", "0px 0px 0px rgba(0,0,0,0)"]
        }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        For Better{" "}
        <span className="text-green-600 font-semibold">
          Experience
        </span>
        , please make sure that:
      </motion.p>
    </motion.div>

    <div className="flex flex-col md:flex-row gap-6 flex-wrap justify-center">
      {/* Box 1 */}
      <motion.div 
        className="bg-white bg-opacity-30 backdrop-blur-md border border-purple-400 rounded-lg p-6 w-64 text-center hover:scale-105 transition-transform duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        whileHover={{ 
          boxShadow: "0px 10px 20px rgba(120, 58, 180, 0.3)",
          borderColor: "#a78bfa"
        }}
      >
        <motion.div 
          className="mb-4"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
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
        </motion.div>
        <p className="text-gray-800">
          Your camera is located{" "}
          <span className="text-green-600 font-semibold">
            on the top of your screen
          </span>
        </p>
      </motion.div>

      {/* Box 2 */}
      <motion.div 
        className="bg-white bg-opacity-30 backdrop-blur-md border border-purple-400 rounded-lg p-6 w-64 text-center hover:scale-105 transition-transform duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        whileHover={{ 
          boxShadow: "0px 10px 20px rgba(120, 58, 180, 0.3)",
          borderColor: "#a78bfa"
        }}
      >
        <motion.div 
          className="mb-4"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
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
        </motion.div>
        <p className="text-gray-800">
          You are{" "}
          <span className="text-green-600 font-semibold">facing</span> the camera
        </p>
      </motion.div>

      {/* Box 3 */}
      <motion.div 
        className="bg-white bg-opacity-30 backdrop-blur-md border border-purple-400 rounded-lg p-6 w-64 text-center hover:scale-105 transition-transform duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        whileHover={{ 
          boxShadow: "0px 10px 20px rgba(120, 58, 180, 0.3)",
          borderColor: "#a78bfa"
        }}
      >
        <motion.div 
          className="mb-4"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
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
        </motion.div>
        <p className="text-gray-800">
          You are in a{" "}
          <span className="text-green-600 font-semibold">well-lit room</span>
        </p>
      </motion.div>
      
      {/* Box 4 */}
      <motion.div 
        className="bg-white bg-opacity-30 backdrop-blur-md border border-purple-400 rounded-lg p-6 w-64 text-center hover:scale-105 transition-transform duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
        whileHover={{ 
          boxShadow: "0px 10px 20px rgba(120, 58, 180, 0.3)",
          borderColor: "#a78bfa"
        }}
      >
        <motion.div 
          className="mb-4"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
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
        </motion.div>
        <p className="text-gray-800">
          Be {" "}
          <span className="text-green-600 font-semibold">Genuine</span> {" "} to yourself
        </p>
      </motion.div>
      
      {/* Box 5 */}
      <motion.div 
        className="bg-white bg-opacity-30 backdrop-blur-md border border-purple-400 rounded-lg p-6 w-64 text-center hover:scale-105 transition-transform duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.1 }}
        whileHover={{ 
          boxShadow: "0px 10px 20px rgba(120, 58, 180, 0.3)",
          borderColor: "#a78bfa"
        }}
      >
        <motion.div 
          className="mb-4"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
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
        </motion.div>
        <p className="text-gray-800">
          Images and Videos used {" "}
          <span className="text-green-600 font-semibold">are not for</span> {" "} harming your feeling
        </p>
      </motion.div>
    </div>
  </motion.div>
);


// Main component
const ExperienceFlow = () => {
  const [userType, setUserType] = useState(null);
  const [mediaList, setMediaList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showQuestion, setShowQuestion] = useState(false);
  const [responses, setResponses] = useState({});
  const [started, setStarted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [testCompleted, setTestCompleted] = useState(false);
        const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const fromComponent = searchParams.get('fromComponent');
    const [isLoading, setIsLoading] = useState(false);
  


  const streamRef = useRef(null);

  const { isListening, startListening, stopListening } = useSpeechToText({ 
    currentIndex, 
    responses, 
    setResponses 
  });
  
  const { 
    isRecording, 
    videoBlob, 
    videoRef, 
    startRecording, 
    stopRecording 
  } = useVideoRecording();

  // Handle prediction API call
  const handlePredict = useCallback(async (videoBlob, responses) => {
    if (!videoBlob) {
      setMessage({ type: "error", text: "Recording failed!" });
      return;
    }

    setLoading(true);
    setMessage(null);
    setResults(null);

    if(!responses){
      alert(responses);
      return;
    }
    setIsLoading(true); // Set loading to true when submitting


    const formData = new FormData();
    formData.append("video", videoBlob, "video.webm");
    formData.append("responses", JSON.stringify(responses));
    formData.append('email', email);

    try {
      const response = await api.post("/video/predict_emotion/", formData, {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setResults(response.data);
      setMessage({ type: "success", text: "Prediction successful!" });
    } catch (error) {
      console.error("Prediction error:", error);
      setMessage({ type: "error", text: "Something went wrong!" });
      setIsLoading(false); // Reset loading state on error
    } finally {
      setLoading(false);
    }
  }, []);

  // Start the experience
  const handleStart = useCallback(() => {
    const randomizedQuestions = getRandomizedQuestions(media);
    setUserType('user');
    setMediaList(randomizedQuestions);
    setStarted(true);
    setCurrentIndex(0);
    setShowQuestion(false);
    startRecording();
  }, [startRecording]);

   // End the experience
   const handleEnd = useCallback(() => {
    console.log('User Responses:', responses);
    
    if (isListening) {
      stopListening();
    }
    
    stopRecording();
    setStarted(false);
    setTestCompleted(true);
    
    if (videoBlob && responses) {
      handlePredict(videoBlob, responses);
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setTimeout(() => {
      setStarted(false);
      setTestCompleted(true);
    }, 1000);
  }, [responses, stopListening, stopRecording, videoBlob, handlePredict]);

  // Handle next question
  const handleNext = useCallback(() => {
    if (!responses[currentIndex] || responses[currentIndex].trim() === '') {
      alert('Please enter a response before proceeding!');
      return;
    }
  
    if (isListening) {
      stopListening();
    }
  
    if (currentIndex < mediaList.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowQuestion(false);
    } else {
      handleEnd();
    }
  }, [currentIndex, mediaList.length, responses, isListening, stopListening, handleEnd]);

  // Progress timer effect
  useEffect(() => {
    let timer;
    let progressTimer;

    if (started && currentIndex < mediaList.length) {
      setShowQuestion(false);
      setProgress(0);
      startRecording();

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
    };
  }, [started, currentIndex, mediaList.length, startRecording]);

  // Clean up effect
  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, [stopRecording]);

  // Component unmount cleanup
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => {
          track.stop();
          console.log("Component unmount: Track stopped:", track.kind);
        });
        streamRef.current = null;
      }
      
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  // Test completion cleanup
  useEffect(() => {
    if (testCompleted) {
      stopRecording();
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  }, [testCompleted, stopRecording]);

    // If results exist, render the Graphs component instead of the recording UI.
    if (results) {
      return <VideoGraphs results={results}  email={email} fromComponent={fromComponent}/>;
    }
            // Add this right after the above if statement
if (isLoading) {
  return <Loading />;
}

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-300 via-indigo-200 to-blue-300 p-4 overflow-hidden">
      {/* Animated background elements */}
      <motion.div 
        className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 1.5 }}
      >
        <motion.div 
          className="absolute top-20 left-20 w-32 h-32 rounded-full bg-pink-300 filter blur-xl"
          animate={{ 
            x: [0, 100, 0],
            y: [0, 50, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-20 right-20 w-40 h-40 rounded-full bg-blue-300 filter blur-xl"
          animate={{ 
            x: [0, -80, 0],
            y: [0, 40, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 w-48 h-48 rounded-full bg-purple-200 filter blur-xl"
          animate={{ 
            x: [0, -40, 0],
            y: [0, -60, 0]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

            {/* Welcome Screen */}
            {!userType && !started && (
        <>
          <WelcomeScreen onStart={handleStart} />
          <Instructions />
        </>
      )}

      {/* Experience Flow */}
      {started && mediaList.length > 0 && (
        <motion.div
          key={currentIndex}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={slideVariants}
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

          {/* Media Display */}
          <div className="rounded-xl overflow-hidden shadow-lg bg-white p-4 flex flex-col items-center justify-center">
            {mediaList[currentIndex].type === "image" ? (
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

          {/* Webcam and Response Section */}
          <div className="flex flex-col items-center mt-6">
            <div className="flex-1">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="fixed top-4 right-4 w-56 h-40 rounded-lg shadow-lg border border-gray-300"
              />
            </div>

            {/* Record Control */}
            <div className="mt-4">
              {isRecording ? (
                <button
                  onClick={stopRecording}
                  className="fixed top-44 right-4 px-4 py-2 bg-red-500 text-white rounded"
                >
                  Stop Recording
                </button>
              ) : (
                <button
                  onClick={startRecording}
                  className="fixed top-44 right-4 px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Start Recording
                </button>
              )}
            </div>

            {/* Response Input */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
              className="bg-white p-6 rounded-xl shadow-md w-full"
            >
              <label
                htmlFor="user-response"
                className="text-lg font-medium text-gray-700 mb-4 block"
              >
                {mediaList[currentIndex].question}
              </label>
              <div className="relative">
                <textarea
                  id="user-response"
                  rows="4"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  placeholder="Your response..."
                  value={responses[currentIndex] || ""}
                  onChange={(e) =>
                    setResponses((prevResponses) => ({
                      ...prevResponses,
                      [currentIndex]: e.target.value,
                    }))
                  }
                  required
                />
                {/* Microphone Button */}
                <button
                  type="button"
                  onClick={isListening ? stopListening : startListening}
                  className="absolute top-2 right-2 p-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 transition"
                >
                  {isListening ? <FaMicrophoneSlash size={20} /> : <FaMicrophone size={20} />}
                </button>
              </div>

              <div className="flex justify-between mt-4">
                <button
                  onClick={handleNext}
                  className="px-6 py-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition focus:ring-2 focus:ring-indigo-300"
                >
                  {currentIndex === mediaList.length - 1 ? "Finish" : "Next"}
                </button>
                <button
                  onClick={handleEnd}
                  className="px-6 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition focus:ring-2 focus:ring-red-300"
                >
                  End
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Results Display */}
      {testCompleted && results && Object.keys(results).length > 0 && (
        <VideoGraphs results={results} email={email} />
      )}
    </div>
  );
};

export default ExperienceFlow;