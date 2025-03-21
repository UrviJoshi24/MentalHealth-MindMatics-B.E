import React, { useState, useEffect, useRef, useCallback } from 'react';
import { media } from '../components/mediaData';
import { motion } from 'framer-motion';
import { getRandomizedQuestions } from '../components/getRandomizedQuestions';
import api from "../api";
import { ACCESS_TOKEN } from "../constants";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";

// Constants
const DURATION = 1; // seconds per slide
const fadeVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Separate SpeechToText hook
const useSpeechToText = ({ currentIndex, setResponses }) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Initialize speech recognition only once
    if (!recognitionRef.current) {
      recognitionRef.current = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = "en-US";
      recognitionRef.current.interimResults = false;
    }

    const recognition = recognitionRef.current;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setResponses((prevResponses) => ({
        ...prevResponses,
        [currentIndex]: (prevResponses[currentIndex] || "") + " " + transcript,
      }));
    };

    recognition.onerror = (event) => {
      console.error("Speech Recognition Error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
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

  // In the useVideoRecording hook, modify the stopRecording function:
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
    <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
      Do you want to start to feel the experiences?
    </h2>
    <div className="flex justify-center">
      <button
        onClick={onStart}
        className="px-8 py-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 shadow-md transition focus:outline-none focus:ring-2 focus:ring-blue-300 mb-12"
      >
        Start
      </button>
    </div>
  </motion.div>
);

// Instructions component
const Instructions = () => (
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
);

// Results component
const Results = ({ results }) => (
  <div className="text-center mt-8 p-6 bg-white shadow-lg rounded-xl">
    <h2 className="text-2xl font-semibold text-gray-800">Test Results</h2>
    <p className="text-lg text-gray-600 mt-2">
      Congratulations! Your experience is complete.
    </p>

    {/* Video Predictions */}
    <div className="mt-4 p-4 bg-gray-100 rounded-lg">
      <p className="text-lg font-semibold text-gray-700">Video Analysis</p>
      {results.video_prediction && results.video_prediction.error ? (
        <p className="text-red-500">{results.video_prediction.error}</p>
      ) : (
        <ul>
          {results.video_prediction &&
            Object.entries(results.video_prediction).map(([key, value]) => (
              <li key={key} className="flex justify-between text-lg">
                <span className="capitalize font-medium text-gray-700">{key}:</span>
                <span className="font-bold text-blue-600">
                  {typeof value === "number" ? (value * 100).toFixed(1) + "%" : "N/A"}
                </span>
              </li>
            ))}
        </ul>
      )}
    </div>

    <div className="mt-4 p-4 bg-gray-100 rounded-lg">
  <p className="text-lg font-semibold text-gray-700">Text Analysis</p>
  {results.text_predictions && results.text_predictions.length > 0 ? (
    results.text_predictions.map((item) => (
      <div key={item.text_index} className="mt-2 p-2 bg-white shadow rounded-lg">
        <p className="text-gray-700">
          <strong>Transcript:</strong> {item.transcript}
        </p>
        {item.text_prediction ? (
          <ul className="mt-2">
            {Object.entries(item.text_prediction).map(([key, value]) => (
              <li key={key} className="flex justify-between text-lg">
                <span className="capitalize font-medium text-gray-700">{key}:</span>
                <span className="font-bold text-blue-600">
                  {typeof value === "number" ? value.toFixed(2) + "%" : "N/A"}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No mental health scores available.</p>
        )}
      </div>
    ))
  ) : (
    <p className="text-gray-500">No text predictions available.</p>
  )}
</div>


    {/* Final Scores */}
    <div className="mt-4 p-4 bg-gray-100 rounded-lg">
      <p className="text-lg font-semibold text-gray-700">Final Scores</p>
      <ul>
        {results.final_scores &&
          Object.entries(results.final_scores).map(([key, value]) => (
            <li key={key} className="flex justify-between text-lg">
              <span className="capitalize font-medium text-gray-700">{key}:</span>
              <span className="font-bold text-blue-600">
                {typeof value === "number" ? value.toFixed(2) + "%" : "N/A"}
              </span>
            </li>
          ))}
      </ul>
    </div>
  </div>
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

    const formData = new FormData();
    formData.append("video", videoBlob, "video.webm");
    formData.append("responses", JSON.stringify(responses));

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

  // Handle next question
  const handleNext = useCallback(() => {
    if (!responses[currentIndex] || responses[currentIndex].trim() === '') {
      alert('Please enter a response before proceeding!');
      return;
    }

    if (currentIndex < mediaList.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowQuestion(false);
    } else {
      handleEnd();
    }
  }, [currentIndex, mediaList.length, responses]);

  // End the experience
  const handleEnd = useCallback(() => {
    console.log('User Responses:', responses);
    alert('Thank you for your time!');
    
    // Ensure recording stops and tracks are cleaned up
    stopRecording();
    setStarted(false);
    setTestCompleted(true);
    
    // Process the video data
    if (videoBlob && responses) {
      handlePredict(videoBlob, responses);
    }
    
    // Reset video state
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setTimeout(() => {
      setStarted(false);
      setTestCompleted(true);
    }, 1000);
  }, [responses, stopRecording, videoBlob, handlePredict]);

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

  // Add this at the component level
useEffect(() => {
  return () => {
    // Final cleanup when component unmounts
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
useEffect(() => {
  // When test completes, make sure camera is off
  if (testCompleted) {
    stopRecording();
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }
}, [testCompleted, stopRecording]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-300 to-blue-300 p-4">
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
        <Results results={results} />
      )}
    </div>
  );
};

export default ExperienceFlow;