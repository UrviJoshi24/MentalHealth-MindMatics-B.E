import React, { useState, useRef, useEffect } from "react";
import api from "../api";
import backgroundImage from "../assets/images/bga.jpg";
import { FaMicrophone, FaStop, FaPaperPlane, FaRedo, FaPlay, FaPause, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import Graphs from "../components/Graphs";
import LoadingAnimation from "../components/LoadingAnimation"

 
const Audio = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedData, setRecordedData] = useState([]);
  const [step, setStep] = useState(0);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState(null);
  const [playingIndex, setPlayingIndex] = useState(null);
      const [searchParams] = useSearchParams();
      const email = searchParams.get('email');
      const fromComponent = searchParams.get('fromComponent');
      const navigate = useNavigate();

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recognitionRef = useRef(null);
  const [audioVisualizer, setAudioVisualizer] = useState(null);
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const prompts = [
    "Please introduce yourself briefly.",
    "Can you describe a recent event that made you happy?",
    "Can you describe a recent event that made you feel stressed?",
    "Is there anything else you'd like to share about your feelings?",
    "Tell us about your day.",
  ];
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  useEffect(() => {
    document.body.classList.add("bg-gradient-to-r", "from-purple-50", "to-blue-50");
    return () => {
      document.body.classList.remove("bg-gradient-to-r", "from-purple-50", "to-blue-50");
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.src = "";
      }
    };
  }, [currentAudio]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    },
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      boxShadow: [
        "0 0 0 0 rgba(124, 58, 237, 0.7)",
        "0 0 0 10px rgba(124, 58, 237, 0)",
        "0 0 0 0 rgba(124, 58, 237, 0)",
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "loop",
      },
    },
  };

  const recordingPulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      boxShadow: [
        "0 0 0 0 rgba(220, 38, 38, 0.7)",
        "0 0 0 10px rgba(220, 38, 38, 0)",
        "0 0 0 0 rgba(220, 38, 38, 0)",
      ],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: "loop",
      },
    },
  };

  const fadeInUp = {
    initial: { y: 60, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
    exit: { y: -60, opacity: 0, transition: { duration: 0.4, ease: "easeIn" } },
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert("Speech Recognition API is not supported in your browser.");
        return;
      }

      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = "en-US";
      recognitionRef.current.interimResults = true;
      recognitionRef.current.continuous = true;

      handleSpeechRecognition();
      recognitionRef.current.start();
      mediaRecorderRef.current.start();
      visualizeAudio(stream);
      setIsRecording(true);
      setLiveTranscript("");
    } catch (error) {
      console.error("Error starting recording:", error);
      alert("Could not start recording. Please try again.");
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    mediaRecorderRef.current.onstop = () => {
      addRecordedData();
    };
    stopVisualizer();
    setIsRecording(false);
  };

  const addRecordedData = () => {
    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
    const audioURL = URL.createObjectURL(audioBlob);

    setRecordedData((prev) => {
      const newData = [...prev];
      if (newData[step] && newData[step].audioURL) {
        URL.revokeObjectURL(newData[step].audioURL);
      }
      newData[step] = {
        prompt: prompts[step],
        audioBlob,
        audioURL,
        transcript: liveTranscript || "Transcript not available",
      };
      return newData;
    });

    setLiveTranscript("");
    audioChunksRef.current = [];
  };

  const reRecord = () => {
    setLiveTranscript("");
    audioChunksRef.current = [];
    setRecordedData((prev) => {
      const newData = [...prev];
      if (newData[step] && newData[step].audioURL) {
        URL.revokeObjectURL(newData[step].audioURL);
      }
      newData[step] = null;
      return newData;
    });
    startRecording();
  };

  const sendDataToBackend = async () => {
    if (recordedData.filter(Boolean).length < prompts.length) {
      alert("Please answer all prompts before submitting.");
      return;
    }
  
    setIsSubmitting(true);
    setIsLoading(true); // Set loading to true when submitting
    const formData = new FormData();
    recordedData.forEach((data, index) => {
      formData.append(`audio_${index + 1}`, data.audioBlob, `prompt_${index + 1}.wav`);
      formData.append(`transcript_${index + 1}`, data.transcript);
    });
    formData.append('email', email);
  
    try {
      const response = await api.post("/api/audio/input/", formData);
      console.log("Backend response:", response.data);
      setResults(response.data.predictions);
    } catch (error) {
      console.error("Error sending data:", error);
      alert("Error sending data. Please try again.");
      setIsLoading(false); // Reset loading state on error
    } finally {
      setIsSubmitting(false);
    }
  };

  const visualizeAudio = (stream) => {
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    source.connect(analyser);

    const canvas = document.getElementById("audio-visualizer");
    const canvasCtx = canvas.getContext("2d");

    const draw = () => {
      const drawVisual = requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);

      // Create gradient for the waveform
      const gradient = canvasCtx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, 'rgba(139, 92, 246, 0.7)');  // Purple top
      gradient.addColorStop(0.5, 'rgba(67, 56, 202, 0.7)'); // Indigo middle
      gradient.addColorStop(1, 'rgba(139, 92, 246, 0.7)');  // Purple bottom

      canvasCtx.fillStyle = "rgba(243, 232, 255, 0.3)";
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

      canvasCtx.lineWidth = 3;
      canvasCtx.strokeStyle = gradient;
      canvasCtx.beginPath();

      const sliceWidth = (canvas.width * 1.0) / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;
        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }
        x += sliceWidth;
      }
      canvasCtx.lineTo(canvas.width, canvas.height / 2);
      canvasCtx.stroke();

      // Draw a reflection of the waveform
      canvasCtx.strokeStyle = 'rgba(139, 92, 246, 0.3)';
      canvasCtx.lineWidth = 2;
      canvasCtx.beginPath();
      x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = canvas.height - (v * canvas.height) / 2;
        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }
        x += sliceWidth;
      }
      canvasCtx.lineTo(canvas.width, canvas.height / 2);
      canvasCtx.stroke();

      setAudioVisualizer(drawVisual);
    };

    draw();
  };

  const stopVisualizer = () => {
    if (audioVisualizer) {
      cancelAnimationFrame(audioVisualizer);
    }
    const canvas = document.getElementById("audio-visualizer");
    const canvasCtx = canvas.getContext("2d");
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleSpeechRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join(" ");
        setLiveTranscript(transcript);
      };

      recognitionRef.current.onend = () => {
        if (isRecording) {
          recognitionRef.current.start();
        }
      };
    }
  };

  const playAudio = (audioURL, index) => {
    if (currentAudio) {
      currentAudio.pause();
    }
    const audio = document.createElement("audio");
    audio.src = audioURL;
    audio.play();
    setCurrentAudio(audio);
    setIsPlaying(true);
    setPlayingIndex(index);
    audio.onended = () => {
      setIsPlaying(false);
      setPlayingIndex(null);
    };
  };

  const pauseAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      setIsPlaying(false);
      setPlayingIndex(null);
    }
  };

  // If results exist, render the Graphs component instead of the recording UI.
  if (results) {
    return <Graphs results={results}  email={email} fromComponent={fromComponent} />;
  }

        // Add this right after the above if statement
if (isLoading) {
  return <LoadingAnimation />;
}

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center bg-fixed p-4 overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${backgroundImage})`,
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* Animated background shapes */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Progress bar */}
      <div className="fixed top-0 left-0 w-full z-50 p-4">
        <div className="w-full bg-gray-300 bg-opacity-30 rounded-full h-3 backdrop-blur-sm">
          <motion.div
            className="bg-gradient-to-r from-purple-600 to-indigo-600 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((step + 1) / prompts.length) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          ></motion.div>
        </div>
        <div className="flex justify-between px-2 mt-1 text-xs text-white">
          {prompts.map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: -10 }}
              animate={{
                opacity: step >= i ? 1 : 0.5,
                y: 0,
                scale: step === i ? 1.2 : 1
              }}
              transition={{ duration: 0.3 }}
              className={`w-6 h-6 flex items-center justify-center rounded-full ${step >= i
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                  : 'bg-gray-400 bg-opacity-50 text-gray-200'
                }`}
            >
              {i + 1}
            </motion.div>
          ))}
        </div>
      </div>
      <br/>

      {/* Title section with animated particles */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-center mb-8 relative z-10"
      >
        <h1 className="text-6xl font-bold text-white mb-3 tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-indigo-300">
            Mindful Moments
          </span>
        </h1>
        <p className="text-xl text-white">Your Daily Mental Health Check-in</p>
      </motion.div>

      {/* Main container */}
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={controls}
        className="bg-white bg-opacity-80 text-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-3xl backdrop-filter backdrop-blur-lg border border-white border-opacity-20 relative z-10"
      >
        {/* Question title with animation */}
        <motion.div
          key={`question-${step}`} // Unique key to force remount on step change
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-semibold mb-2 text-center">
            Question {step + 1} of {prompts.length}
          </h2>
          <p className="text-2xl mb-6 text-center font-medium text-purple-800 p-4 rounded-lg bg-purple-50 shadow-inner">
            {prompts[step]}
          </p>
        </motion.div>


        {/* Audio visualizer with enhanced styling */}
        <motion.div
          variants={itemVariants}
          className="relative mb-8"
        >
          <canvas
            id="audio-visualizer"
            width="600"
            height="150"
            className="w-full h-40 rounded-xl mb-2 shadow-lg bg-gradient-to-r from-purple-100 to-indigo-100"
          ></canvas>
          {isRecording && (
            <motion.div
              className="absolute top-2 right-2 bg-red-500 text-white text-xs px-3 py-1 rounded-full"
              animate={{ opacity: [1, 0.6, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Recording...
            </motion.div>
          )}
        </motion.div>

        {/* Recording controls with animations */}
        <motion.div
          className="flex items-center justify-center mb-8 space-x-4"
          variants={itemVariants}
        >
          {!isRecording ? (
            recordedData[step] ? (
              <motion.button
                onClick={reRecord}
                className="px-6 py-3 text-lg font-bold rounded-full transition-all bg-yellow-500 hover:bg-yellow-400 text-white shadow-lg flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaRedo />
                <span>Re-record</span>
              </motion.button>
            ) : (
              <motion.button
                onClick={startRecording}
                className="px-6 py-3 text-lg font-bold rounded-full transition-all bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                variants={pulseVariants}
                animate="pulse"
              >
                <FaMicrophone />
                <span>Start Recording</span>
              </motion.button>
            )
          ) : (
            <motion.button
              onClick={stopRecording}
              className="px-6 py-3 text-lg font-bold rounded-full transition-all bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              variants={recordingPulseVariants}
              animate="pulse"
            >
              <FaStop />
              <span>Stop Recording</span>
            </motion.button>
          )}
        </motion.div>

        {/* Live transcript with fade-in animation */}
        <AnimatePresence>
          {isRecording && (
            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              exit="exit"
              className="mb-8"
            >
              <h3 className="text-lg font-semibold mb-2 text-purple-700">Live Transcript:</h3>
              <motion.div
                className="bg-purple-50 text-gray-800 p-4 rounded-lg shadow-inner min-h-[100px] max-h-[200px] overflow-y-auto border-2 border-purple-100"
                animate={{
                  boxShadow: isRecording ? ["0 0 0 rgba(139, 92, 246, 0.3)", "0 0 15px rgba(139, 92, 246, 0.7)", "0 0 0 rgba(139, 92, 246, 0.3)"] : "none"
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {liveTranscript || (
                  <div className="flex items-center text-gray-500">
                    <motion.span
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      Listening...
                    </motion.span>
                    <div className="ml-2 flex space-x-1">
                      <motion.div
                        className="w-2 h-2 bg-purple-500 rounded-full"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-purple-500 rounded-full"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-purple-500 rounded-full"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recorded responses with staggered animations */}
        <AnimatePresence>
          {recordedData.map((data, index) =>
            data ? (
              <motion.div
                key={index}
                variants={itemVariants}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="mb-6 bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-lg shadow-lg border border-purple-100"
              >
                <p className="text-lg font-semibold text-purple-700 mb-3 flex items-center">
                  <span className="bg-purple-700 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 text-sm">
                    {index + 1}
                  </span>
                  {data.prompt}
                </p>
                <div className="flex items-center space-x-4 mb-4">
                  <motion.button
                    onClick={() =>
                      isPlaying && playingIndex === index
                        ? pauseAudio()
                        : playAudio(data.audioURL, index)
                    }
                    className={`p-3 rounded-full text-white shadow-md flex items-center justify-center ${isPlaying && playingIndex === index
                        ? "bg-purple-700"
                        : "bg-purple-600 hover:bg-purple-500"
                      }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isPlaying && playingIndex === index ? <FaPause /> : <FaPlay />}
                  </motion.button>
                  <p className="text-sm text-gray-600">
                    {isPlaying && playingIndex === index ? "Playing audio..." : "Play recording"}
                  </p>

                  {/* Animated waveform when playing */}
                  {isPlaying && playingIndex === index && (
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-1 bg-purple-500 rounded-full"
                          animate={{
                            height: [15, 25, 10, 30, 15],
                          }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: i * 0.1,
                            repeatType: "mirror"
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
                <motion.div
                  className="text-gray-700 mt-2 bg-white p-4 rounded-lg shadow-inner border border-purple-100"
                  whileHover={{ boxShadow: "0 4px 12px rgba(139, 92, 246, 0.15)" }}
                >
                  <span className="font-semibold text-purple-800">Transcript:</span> {data.transcript}
                </motion.div>
              </motion.div>
            ) : null
          )}
        </AnimatePresence>

        {/* Navigation buttons with enhanced animations */}
        <motion.div
          className="flex justify-between mt-8"
          variants={itemVariants}
        >
          <motion.button
            onClick={() => setStep(Math.max(0, step - 1))}
            className="px-6 py-3 bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 rounded-lg hover:from-gray-300 hover:to-gray-400 transition-all shadow-md flex items-center"
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            disabled={step === 0}
            style={{ opacity: step === 0 ? 0.5 : 1 }}
          >
            <FaChevronLeft className="mr-2" /> Previous
          </motion.button>
          <motion.button
            onClick={() => {
              if (recordedData[step]) {
                setStep(Math.min(prompts.length - 1, step + 1));
              } else {
                alert("Please record an answer before moving to the next question.");
              }
            }}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all shadow-md flex items-center"
            whileHover={{ scale: 1.05, x: 5 }}
            whileTap={{ scale: 0.95 }}
            disabled={step === prompts.length - 1}
            style={{ opacity: step === prompts.length - 1 ? 0.5 : 1 }}
          >
            Next <FaChevronRight className="ml-2" />
          </motion.button>
        </motion.div>

        {/* Submit button with enhanced animation */}
        {step === prompts.length - 1 && recordedData.filter(Boolean).length === prompts.length && (
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {isSubmitting ? (
              <div className="text-center text-lg font-semibold p-4">
                <motion.div
                  className="inline-block"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <div className="w-6 h-6 border-4 border-purple-600 border-t-transparent rounded-full mr-2"></div>
                </motion.div>
                Submitting responses... Please wait.
              </div>
            ) : (
              <motion.button
                onClick={sendDataToBackend}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg shadow-lg flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.5)" }}
                whileTap={{ scale: 0.98 }}
                variants={pulseVariants}
                animate="pulse"
              >
                <FaPaperPlane />
                <span>Submit All Responses</span>
              </motion.button>
            )}
          </motion.div>
        )}
      </motion.div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Audio;