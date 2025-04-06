// import React, { useState, useEffect } from "react";
// import { useNavigate } from 'react-router-dom';
// import { FaSadTear, FaHeartbeat, FaExclamationTriangle } from "react-icons/fa";
// import { FaTimesCircle, FaClock, FaCheckCircle, FaFireAlt } from "react-icons/fa";
// import { motion, AnimatePresence } from "framer-motion";
// import { useSearchParams } from 'react-router-dom';
// import api from "../api";


// // Array of questions
// const questions = [
//     "I found it hard to wind down",           // Stress
//     "I was aware of dryness of my mouth",     // Anxiety
//     "I couldn't seem to experience any positive feeling at all", // Depression
//     "I experienced breathing difficulty",     // Anxiety
//     "I found it hard to get started on tasks", // Depression
//     "I tended to over-react to situations",   // Stress
//     "My hands or body sometimes shook or trembled", // Anxiety
//     "I felt that I was using a lot of nervous energy", // Stress
//     "I was worried about situations in which I might panic", // Anxiety
//     "I felt that I had nothing to look forward to", // Depression
//     "I found myself getting upset or annoyed easily",        // Stress
//     "I found it difficult to relax",          // Stress
//     "I felt down-hearted and blue",           // Depression
//     "I got frustrated when something interrupted what I was doing", // Stress
//     "I felt I was close to panic",            // Anxiety
//     "I was unable to become enthusiastic about anything", // Depression
//     "I felt I wasn't worth much as a person", // Depression
//     "I felt that I was easily irritated",        // Stress
//     "I was aware of the action of my heart in the absence of physical exertion", // Anxiety
//     "I felt scared without any good reason",  // Anxiety
//     "I felt that life was meaningless"        // Depression
// ];

// // Indices of questions corresponding to each subscale
// const depressionIndices = [2, 4, 9, 12, 15, 16, 20];
// const anxietyIndices = [1, 3, 6, 8, 14, 18, 19];
// const stressIndices = [0, 5, 7, 10, 11, 13, 17];

// const Questionnaire = () => {
//     const [result, setResult] = useState(null);
//     const [answers, setAnswers] = useState(Array(questions.length).fill(null));
//     const [submitted, setSubmitted] = useState(false);
//     const [timeLeft, setTimeLeft] = useState(8 * 60); // 8 minutes in seconds
//     const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//     const [showWarning, setShowWarning] = useState(false);
//     const [apiStatus, setApiStatus] = useState({ loading: false, success: false, error: null });
//     const [searchParams] = useSearchParams();
//     const email = searchParams.get('email');
//     const navigate = useNavigate();


//     // Timer logic
//     useEffect(() => {
//         if (timeLeft <= 0 || submitted) return;

//         const timerId = setInterval(() => {
//             setTimeLeft((prev) => {
//                 if (prev <= 30 && prev > 0) setShowWarning(true);
//                 if (prev <= 0) return 0;
//                 return prev - 1;
//             });
//         }, 1000);

//         return () => clearInterval(timerId);
//     }, [timeLeft, submitted]);

//     // Hide warning after 3 seconds
//     useEffect(() => {
//         if (showWarning) {
//             const warningTimer = setTimeout(() => {
//                 setShowWarning(false);
//             }, 3000);
//             return () => clearTimeout(warningTimer);
//         }
//     }, [showWarning]);

//     const handleClick = (route) => {
//         navigate(`${route}?email=${encodeURIComponent(email)}&fromComponent=true`);
//     };

//     // Format time as MM:SS
//     const formatTime = (seconds) => {
//         const minutes = Math.floor(seconds / 60);
//         const remainingSeconds = seconds % 60;
//         return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
//             .toString()
//             .padStart(2, "0")}`;
//     };

//     // Update answers array
//     const handleAnswerChange = (index, value) => {
//         const updatedAnswers = [...answers];
//         updatedAnswers[index] = parseInt(value, 10);
//         setAnswers(updatedAnswers);

//         // Auto-advance to next question after selection
//         if (currentQuestionIndex < questions.length - 1) {
//             setTimeout(() => {
//                 setCurrentQuestionIndex(currentQuestionIndex + 1);
//             }, 300);
//         }
//     };

//     // Navigate to specific question
//     const goToQuestion = (index) => {
//         setCurrentQuestionIndex(index);
//     };

//     // Send results to Django backend
//     const sendResultsToDjango = async (resultData) => {
//         setApiStatus({ loading: true, success: false, error: null });

//         try {
//             // Replace with your actual Django API endpoint
//             const response = await api.post('/api/save-results/', {
//                 depression_score: resultData.depressionScore,
//                 anxiety_score: resultData.anxietyScore,
//                 stress_score: resultData.stressScore,
//                 email: email,
//             });

//             console.log('Results sent successfully:', response.data);
//             setApiStatus({ loading: false, success: true, error: null });
//         } catch (error) {
//             console.error('Error sending results:', error);
//             setApiStatus({
//                 loading: false,
//                 success: false,
//                 error: error.response?.data?.message || 'Failed to send results to server'
//             });
//         }
//     };

//     // Calculate DASS-21 score
//     const calculateScore = (e) => {
//         e.preventDefault();

//         // Check if all questions are answered
//         if (answers.includes(null)) {
//             const unansweredIndex = answers.findIndex(a => a === null);
//             setCurrentQuestionIndex(unansweredIndex);
//             return;
//         }

//         // Calculate subscale totals
//         const depressionScore = depressionIndices.reduce((total, i) => total + (answers[i] || 0), 0);
//         const anxietyScore = anxietyIndices.reduce((total, i) => total + (answers[i] || 0), 0);
//         const stressScore = stressIndices.reduce((total, i) => total + (answers[i] || 0), 0);

//         // Categorize based on score
//         const getCategory = (score, type) => {
//             if (type === "depression") {
//                 if (score <= 4) return "Normal";
//                 if (score <= 6) return "Mild";
//                 if (score <= 10) return "Moderate";
//                 if (score <= 13) return "Severe";
//                 return "Extremely Severe";
//             } else if (type === "anxiety") {
//                 if (score <= 3) return "Normal";
//                 if (score <= 5) return "Mild";
//                 if (score <= 7) return "Moderate";
//                 if (score <= 9) return "Severe";
//                 return "Extremely Severe";
//             } else if (type === "stress") {
//                 if (score <= 7) return "Normal";
//                 if (score <= 9) return "Mild";
//                 if (score <= 12) return "Moderate";
//                 if (score <= 16) return "Severe";
//                 return "Extremely Severe";
//             }
//         };

//         // Create result object
//         const resultData = {
//             depressionScore,
//             depressionCategory: getCategory(depressionScore, "depression"),
//             anxietyScore,
//             anxietyCategory: getCategory(anxietyScore, "anxiety"),
//             stressScore,
//             stressCategory: getCategory(stressScore, "stress"),
//         };

//         // Set result and mark as submitted
//         setResult(resultData);
//         setSubmitted(true);

//         // Send results to Django backend
//         sendResultsToDjango(resultData);
//     };

//     // Get color based on category
//     const getCategoryColor = (category) => {
//         switch (category) {
//             case "Normal": return "bg-green-100 text-green-800";
//             case "Mild": return "bg-yellow-100 text-yellow-800";
//             case "Moderate": return "bg-orange-100 text-orange-800";
//             case "Severe": return "bg-red-100 text-red-800";
//             case "Extremely Severe": return "bg-purple-100 text-purple-800";
//             default: return "bg-gray-100 text-gray-800";
//         }
//     };

//     return (
//         <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="min-h-screen bg-gradient-to-br from-orange-300 to-pink-300 flex items-center justify-center py-16 px-4"
//         >
//             {/* Title with animation */}
//             <motion.div
//                 className="fixed top-0 left-0 right-0 text-center bg-gradient-to-r from-orange-500 via-pink-500 to-orange-500 p-4 z-50 shadow-lg"
//                 initial={{ y: -100 }}
//                 animate={{ y: 0 }}
//                 transition={{ type: "spring", stiffness: 120 }}
//             >
//                 <motion.p
//                     className="text-4xl font-extrabold text-white font-sans"
//                     animate={{ scale: [1, 1.05, 1], textShadow: ["0px 0px 0px rgba(0,0,0,0)", "0px 0px 8px rgba(255,255,255,0.5)", "0px 0px 0px rgba(0,0,0,0)"] }}
//                     transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
//                 >
//                     Mind Matrix
//                 </motion.p>
//             </motion.div>

//             {/* Timer with animation */}
//             <AnimatePresence>
//                 {!submitted && (
//                     <motion.div
//                         className={`fixed top-20 right-10 ${timeLeft <= 30 ? "bg-red-500" : "bg-gradient-to-r from-orange-400 to-orange-600"} text-white rounded-lg shadow-lg border border-yellow-300 p-4 flex items-center space-x-2 z-50`}
//                         initial={{ x: 100, opacity: 0 }}
//                         animate={{ x: 0, opacity: 1, scale: timeLeft <= 30 ? [1, 1.1, 1] : 1 }}
//                         transition={{
//                             type: "spring",
//                             stiffness: 100,
//                             repeat: timeLeft <= 30 ? Infinity : 0,
//                             repeatType: "reverse",
//                             duration: 0.5
//                         }}
//                     >
//                         <FaClock className={`h-8 w-8 ${timeLeft <= 30 ? "text-red-200" : "text-yellow-300"}`} />
//                         <div className="flex flex-col items-center">
//                             <span className="text-xl font-bold">Time Left</span>
//                             <span className="text-4xl font-extrabold">{formatTime(timeLeft)}</span>
//                         </div>
//                     </motion.div>
//                 )}
//             </AnimatePresence>

//             {/* Time Warning */}
//             <AnimatePresence>
//                 {showWarning && (
//                     <motion.div
//                         className="fixed top-40 right-10 bg-red-600 text-white p-4 rounded-lg shadow-lg z-50"
//                         initial={{ opacity: 0, x: 100 }}
//                         animate={{ opacity: 1, x: 0 }}
//                         exit={{ opacity: 0, x: 100 }}
//                     >
//                         <p className="font-bold">Hurry up! Time is running out!</p>
//                     </motion.div>
//                 )}
//             </AnimatePresence>

//             <motion.div
//                 className="bg-gradient-to-r from-pink-100 via-orange-100 to-orange-200 shadow-2xl p-10 rounded-lg w-full max-w-4xl"
//                 initial={{ scale: 0.9, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 transition={{ duration: 0.5 }}
//             >
//                 {!submitted && (
//                     <AnimatePresence mode="wait">
//                         <motion.div
//                             key="questionnaire"
//                             initial={{ opacity: 0 }}
//                             animate={{ opacity: 1 }}
//                             exit={{ opacity: 0 }}
//                         >
//                             {/* Instructions Section */}
//                             <motion.div
//                                 className="mb-10 bg-pink-100 p-8 rounded-lg shadow-md border-l-8 border-orange-300"
//                                 initial={{ y: 20, opacity: 0 }}
//                                 animate={{ y: 0, opacity: 1 }}
//                                 transition={{ delay: 0.2 }}
//                             >
//                                 <h1 className="text-5xl font-bold text-gray-800 mb-6 text-center">DASS-21 Questionnaire</h1>
//                                 <p className="text-xl text-gray-700 leading-relaxed mb-6 text-center">
//                                     Please carefully read each statement and rate how much it applied to you over the past week. Your responses will help assess your current mental state.
//                                 </p>

//                                 <div className="text-left">
//                                     <strong className="text-gray-800 text-2xl">Rating scale:</strong>
//                                     <ul className="text-gray-600 mt-6 space-y-5 text-lg">
//                                         {/* Never */}
//                                         <motion.li
//                                             className="flex items-center space-x-4"
//                                             initial={{ x: -20, opacity: 0 }}
//                                             animate={{ x: 0, opacity: 1 }}
//                                             transition={{ delay: 0.3 }}
//                                         >
//                                             <FaTimesCircle className="w-8 h-8 text-red-500" />
//                                             <span className="text-xl text-gray-800">
//                                                 <strong>0:</strong> Did not apply to me at all - <strong>NEVER</strong>
//                                             </span>
//                                         </motion.li>
//                                         {/* Sometimes */}
//                                         <motion.li
//                                             className="flex items-center space-x-4"
//                                             initial={{ x: -20, opacity: 0 }}
//                                             animate={{ x: 0, opacity: 1 }}
//                                             transition={{ delay: 0.4 }}
//                                         >
//                                             <FaClock className="w-8 h-8 text-yellow-500" />
//                                             <span className="text-xl text-gray-800">
//                                                 <strong>1:</strong> Applied to me to some degree - <strong>SOMETIMES</strong>
//                                             </span>
//                                         </motion.li>
//                                         {/* Often */}
//                                         <motion.li
//                                             className="flex items-center space-x-4"
//                                             initial={{ x: -20, opacity: 0 }}
//                                             animate={{ x: 0, opacity: 1 }}
//                                             transition={{ delay: 0.5 }}
//                                         >
//                                             <FaCheckCircle className="w-8 h-8 text-green-500" />
//                                             <span className="text-xl text-gray-800">
//                                                 <strong>2:</strong> Applied to me to a considerable degree - <strong>OFTEN</strong>
//                                             </span>
//                                         </motion.li>
//                                         {/* Almost Always */}
//                                         <motion.li
//                                             className="flex items-center space-x-4"
//                                             initial={{ x: -20, opacity: 0 }}
//                                             animate={{ x: 0, opacity: 1 }}
//                                             transition={{ delay: 0.6 }}
//                                         >
//                                             <FaFireAlt className="w-8 h-8 text-orange-500" />
//                                             <span className="text-xl text-gray-800">
//                                                 <strong>3:</strong> Applied to me very much - <strong>ALMOST ALWAYS</strong>
//                                             </span>
//                                         </motion.li>
//                                     </ul>
//                                 </div>
//                             </motion.div>

//                             {/* Question Navigation */}
//                             <div className="mb-8 flex flex-wrap justify-center gap-2">
//                                 {questions.map((_, index) => (
//                                     <motion.button
//                                         key={index}
//                                         className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${answers[index] !== null
//                                                 ? "bg-green-500 text-white"
//                                                 : index === currentQuestionIndex
//                                                     ? "bg-orange-500 text-white"
//                                                     : "bg-gray-200 text-gray-700"
//                                             }`}
//                                         whileHover={{ scale: 1.1 }}
//                                         whileTap={{ scale: 0.95 }}
//                                         onClick={() => goToQuestion(index)}
//                                     >
//                                         {index + 1}
//                                     </motion.button>
//                                 ))}
//                             </div>

//                             {/* Form Section - Only Show Current Question */}
//                             <form onSubmit={calculateScore} className="space-y-10">
//                                 <AnimatePresence mode="wait">
//                                     <motion.div
//                                         key={currentQuestionIndex}
//                                         initial={{ opacity: 0, x: 50 }}
//                                         animate={{ opacity: 1, x: 0 }}
//                                         exit={{ opacity: 0, x: -50 }}
//                                         transition={{ duration: 0.3 }}
//                                         className="bg-orange-50 border border-orange-200 rounded-lg p-6 shadow-md"
//                                     >
//                                         <h2 className="text-sm text-orange-500 mb-2">Question {currentQuestionIndex + 1} of {questions.length}</h2>
//                                         <label className="block text-2xl text-gray-800 font-semibold mb-6">
//                                             {questions[currentQuestionIndex]}
//                                         </label>
//                                         <div className="flex justify-between">
//                                             {[0, 1, 2, 3].map((value) => (
//                                                 <motion.label
//                                                     key={value}
//                                                     className={`flex items-center space-x-3 p-3 rounded-lg ${answers[currentQuestionIndex] === value ? "bg-orange-200" : "hover:bg-orange-100"
//                                                         } cursor-pointer transition-colors duration-200`}
//                                                     whileHover={{ scale: 1.05 }}
//                                                     whileTap={{ scale: 0.95 }}
//                                                 >
//                                                     <input
//                                                         type="radio"
//                                                         name={`question-${currentQuestionIndex}`}
//                                                         value={value}
//                                                         checked={answers[currentQuestionIndex] === value}
//                                                         onChange={(e) => handleAnswerChange(currentQuestionIndex, e.target.value)}
//                                                         className="form-radio text-pink-500 focus:ring-2 focus:ring-orange-200"
//                                                     />
//                                                     <span className="text-lg text-gray-700 font-medium">
//                                                         {value === 0 ? 'Never' : value === 1 ? 'Sometimes' : value === 2 ? 'Often' : 'Always'}
//                                                     </span>
//                                                 </motion.label>
//                                             ))}
//                                         </div>
//                                     </motion.div>
//                                 </AnimatePresence>

//                                 {/* Navigation Buttons */}
//                                 <div className="flex justify-between mt-6">
//                                     <motion.button
//                                         type="button"
//                                         onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
//                                         className={`py-2 px-4 bg-gray-500 text-white font-bold rounded-lg hover:bg-gray-400 transition duration-200 shadow-lg ${currentQuestionIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
//                                             }`}
//                                         disabled={currentQuestionIndex === 0}
//                                         whileHover={{ scale: currentQuestionIndex === 0 ? 1 : 1.05 }}
//                                         whileTap={{ scale: currentQuestionIndex === 0 ? 1 : 0.95 }}
//                                     >
//                                         Previous
//                                     </motion.button>

//                                     {currentQuestionIndex < questions.length - 1 ? (
//                                         <motion.button
//                                             type="button"
//                                             onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
//                                             className="py-2 px-4 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-400 transition duration-200 shadow-lg"
//                                             whileHover={{ scale: 1.05 }}
//                                             whileTap={{ scale: 0.95 }}
//                                         >
//                                             Next
//                                         </motion.button>
//                                     ) : (
//                                         <motion.button
//                                             type="submit"
//                                             className="py-2 px-4 bg-green-500 text-white font-bold rounded-lg hover:bg-green-400 transition duration-200 shadow-lg"
//                                             whileHover={{ scale: 1.05 }}
//                                             whileTap={{ scale: 0.95 }}
//                                         >
//                                             Submit
//                                         </motion.button>
//                                     )}
//                                 </div>
//                             </form>
//                         </motion.div>
//                     </AnimatePresence>
//                 )}

//                 {/* Result Section */}
//                 {submitted && result && (
//                     <motion.div
//                         className="mt-10 bg-pink-50 p-8 rounded-lg shadow-md border border-orange-300 text-center"
//                         initial={{ opacity: 0, scale: 0.9 }}
//                         animate={{ opacity: 1, scale: 1 }}
//                         transition={{ duration: 0.5, delay: 0.3 }}
//                     >
//                         <motion.h2
//                             className="text-4xl font-bold text-gray-800 mb-6"
//                             initial={{ y: -20 }}
//                             animate={{ y: 0 }}
//                             transition={{ delay: 0.5 }}
//                         >
//                             Your DASS-21 Results
//                         </motion.h2>
//                         <motion.p
//                             className="text-lg font-semibold text-gray-700 mb-8"
//                             initial={{ opacity: 0 }}
//                             animate={{ opacity: 1 }}
//                             transition={{ delay: 0.7 }}
//                         >
//                             Based on your answers, here are your categorized scores:
//                             Normal (0 to 16), Mild (17 to 20), Moderate, (21 to 25), Severe (26 to 29), Extremely Severe (30 and above)
//                         </motion.p>

//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//                             {[
//                                 {
//                                     icon: <FaSadTear className="text-blue-500 text-3xl" />,
//                                     title: "Depression",
//                                     score: result.depressionScore,
//                                     category: result.depressionCategory
//                                 },
//                                 {
//                                     icon: <FaHeartbeat className="text-green-500 text-3xl" />,
//                                     title: "Anxiety",
//                                     score: result.anxietyScore,
//                                     category: result.anxietyCategory
//                                 },
//                                 {
//                                     icon: <FaExclamationTriangle className="text-red-500 text-3xl" />,
//                                     title: "Stress",
//                                     score: result.stressScore,
//                                     category: result.stressCategory
//                                 }
//                             ].map((item, index) => (
//                                 <motion.div
//                                     key={index}
//                                     className="bg-white p-6 rounded-lg shadow-md border border-orange-200"
//                                     initial={{ opacity: 0, y: 20 }}
//                                     animate={{ opacity: 1, y: 0 }}
//                                     transition={{ delay: 0.8 + (index * 0.2) }}
//                                     whileHover={{ scale: 1.05 }}
//                                 >
//                                     <div className="flex justify-center mb-4">
//                                         {item.icon}
//                                     </div>
//                                     <h3 className="text-2xl font-bold text-gray-800 mb-2">{item.title}</h3>
//                                     <p className="text-4xl font-bold text-orange-500 mb-2">{item.score}</p>
//                                     <p className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getCategoryColor(item.category)}`}>
//                                         {item.category}
//                                     </p>
//                                 </motion.div>
//                             ))}
//                         </div>

//                         {/* API Status Message */}
//                         <AnimatePresence>
//                             {apiStatus.loading && (
//                                 <motion.div
//                                     className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6 rounded"
//                                     initial={{ opacity: 0 }}
//                                     animate={{ opacity: 1 }}
//                                     exit={{ opacity: 0 }}
//                                 >
//                                     <p className="font-medium">Saving your results...</p>
//                                 </motion.div>
//                             )}

//                             {apiStatus.success && (
//                                 <motion.div
//                                     className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded"
//                                     initial={{ opacity: 0 }}
//                                     animate={{ opacity: 1 }}
//                                     exit={{ opacity: 0 }}
//                                 >
//                                     <p className="font-medium">Your results have been saved successfully!</p>
//                                 </motion.div>
//                             )}

//                             {apiStatus.error && (
//                                 <motion.div
//                                     className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded"
//                                     initial={{ opacity: 0 }}
//                                     animate={{ opacity: 1 }}
//                                     exit={{ opacity: 0 }}
//                                 >
//                                     <p className="font-medium">Error: {apiStatus.error}</p>
//                                     <p>Your results were calculated but couldn't be saved. Please try again.</p>
//                                 </motion.div>
//                             )}
//                         </AnimatePresence>
//                         <motion.button
//                             className="py-3 px-6 bg-orange-500 text-white text-xl font-bold rounded-lg hover:bg-orange-400 transition duration-200 shadow-lg mr-20"
//                             onClick={() => window.location.reload()}
//                             whileHover={{ scale: 1.05 }}
//                             whileTap={{ scale: 0.95 }}
//                             initial={{ opacity: 0 }}
//                             animate={{ opacity: 1 }}
//                             transition={{ delay: 1.5 }}
//                         >
//                             Take Test Again
//                         </motion.button>
//                         <motion.button
//                             className="py-3 px-6 bg-orange-500 text-white text-xl font-bold rounded-lg hover:bg-orange-400 transition duration-200 shadow-lg ml-20"
//                             onClick={() => handleClick('/audio-testing')}
//                             whileHover={{ scale: 1.05 }}
//                             whileTap={{ scale: 0.95 }}
//                             initial={{ opacity: 0 }}
//                             animate={{ opacity: 1 }}
//                             transition={{ delay: 1.5 }}
//                         >
//                             Go to Audio Model
//                         </motion.button>

//                     </motion.div>
//                 )}
//             </motion.div>
//         </motion.div>
//     );
// };

// export default Questionnaire;


import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { FaSadTear, FaHeartbeat, FaExclamationTriangle, FaTimesCircle, FaCheckCircle, FaFireAlt, FaInfoCircle } from "react-icons/fa";
import { Link as RouterLink } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from 'react-router-dom';
import api from "../api";

// Import question images and videos (replace with your actual file paths)
import question1 from '../assets/images/Q_1.jpg';
import question2 from '../assets/images/Q_2.png';
import question3 from '../assets/images/Q_3.mp4'; // Video file
import question4 from '../assets/images/Q_4.webp';
import question5 from '../assets/images/Q_5.jpg';
import question6 from '../assets/images/Q_6.jpg';
import question7 from '../assets/images/Q_7.webp';
import question8 from '../assets/images/Q_8.mp4'; // Video file
import question9 from '../assets/images/Q_9 (2).mp4'; // Video file
import question10 from '../assets/images/Q_10.jpg';
import question11 from '../assets/images/V_2.mp4'; // Video file
import question12 from '../assets/images/Q_12.jpg';
import question13 from '../assets/images/Q_13.mp4';
import question14 from '../assets/images/Q_14.jpg';
import question15 from '../assets/images/Q_15.png';
import question16 from '../assets/images/Q_16.avif';
import question17 from '../assets/images/Q_17.jpg';
import question18 from '../assets/images/Q_18.avif';
import question19 from '../assets/images/Q_19.jpg';
import question20 from '../assets/images/Q_20.mp4'; // Video file
import question21 from '../assets/images/Q_21.png';

// Import background image
import backgroundImage from '../assets/images/bg.jpg'; // Replace with your background image path

export const questionImages = [
  question1, question2, question3, question4, question5,
  question6, question7, question8, question9, question10,
  question11, question12, question13, question14, question15,
  question16, question17, question18, question19, question20,
  question21
];

// Array of questions
const questions = [
  "I found it hard to calm down",  
  "My mouth felt dry",  
  "I couldn’t feel happy",  
  "I had trouble breathing",  
  "I found it hard to start tasks",  
  "I reacted too strongly to situations",  
  "My hands or body shook sometimes",  
  "I felt nervous and restless",  
  "I was afraid of panicking in certain situations",  
  "I felt like I had nothing to look forward to",  
  "I got annoyed or upset easily",  
  "I struggled to relax",  
  "I felt sad or down",  
  "I got frustrated when interrupted",  
  "I felt like I was about to panic",  
  "I couldn’t feel excited about anything",  
  "I felt like I wasn’t important",  
  "I got irritated easily",  
  "I noticed my heart beating fast for no reason",  
  "I felt scared without knowing why",  
  "I felt like life had no meaning"
];

// Indices of questions corresponding to each subscale
const depressionIndices = [2, 4, 9, 12, 15, 16, 20];
const anxietyIndices = [1, 3, 6, 8, 14, 18, 19];
const stressIndices = [0, 5, 7, 10, 11, 13, 17];

// Function to check if a question is a video
const isVideo = (question) => {
  return [question3, question8, question9, question11, question13, question20].includes(question);
};

const Questionnaire = () => {
  const [result, setResult] = useState(null);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [apiStatus, setApiStatus] = useState({ loading: false, success: false, error: null });
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true); // State to toggle instructions
  const cardVariants = {
      hidden: { scale: 0.8, opacity: 0 },
      visible: { scale: 1, opacity: 1, transition: { duration: 0.5 } }
  };
  
  // CardWrapper (unchanged)
  const CardWrapper = ({ children, className = "" }) => (
      <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className={`bg-white/50 backdrop-blur-md rounded-lg shadow-lg p-4 ${className}`}
      >
          {children}
      </motion.div>
  );
  

  // Update answers array
  const handleAnswerChange = (index, value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = parseInt(value, 10);
    setAnswers(updatedAnswers);

    // Auto-advance to next question after selection
    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }, 300);
    }
  };

  // Navigate to specific question
  const goToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  // Send results to Django backend
  const sendResultsToDjango = async (resultData) => {
    setApiStatus({ loading: true, success: false, error: null });

    try {
      const response = await api.post('/api/save-results/', {
        depression_score: resultData.depressionScore,
        anxiety_score: resultData.anxietyScore,
        stress_score: resultData.stressScore,
        email: email,
      });

      console.log('Results sent successfully:', response.data);
      setApiStatus({ loading: false, success: true, error: null });
    } catch (error) {
      console.error('Error sending results:', error);
      setApiStatus({
        loading: false,
        success: false,
        error: error.response?.data?.message || 'Failed to send results to server'
      });
    }
  };

  // Calculate DASS-21 score
  const calculateScore = (e) => {
    e.preventDefault();

    // Check if all questions are answered
    if (answers.includes(null)) {
      const unansweredIndex = answers.findIndex(a => a === null);
      setCurrentQuestionIndex(unansweredIndex);
      return;
    }

    // Calculate subscale totals
    const depressionScore = depressionIndices.reduce((total, i) => total + (answers[i] || 0), 0);
    const anxietyScore = anxietyIndices.reduce((total, i) => total + (answers[i] || 0), 0);
    const stressScore = stressIndices.reduce((total, i) => total + (answers[i] || 0), 0);

    // Categorize based on score
    const getCategory = (score, type) => {
      if (type === "depression") {
        if (score <= 9 )return "Normal";
        if (score <= 13) return "Mild";
        if (score <= 20) return "Moderate";
        if (score <= 28) return "Severe";
        return "Extremely Severe";
      } else if (type === "anxiety") {
        if (score <= 9) return "Normal";
        if (score <= 13) return "Mild";
        if (score <= 20) return "Moderate";
        if (score <= 28) return "Severe";
        return "Extremely Severe";
      } else if (type === "stress") {
        if (score <= 9) return "Normal";
        if (score <= 13) return "Mild";
        if (score <= 20) return "Moderate";
        if (score <= 28) return "Severe";
        return "Extremely Severe";
      }
    };

    // Create result object
    const resultData = {
      depressionScore,
      depressionCategory: getCategory(depressionScore, "depression"),
      anxietyScore,
      anxietyCategory: getCategory(anxietyScore, "anxiety"),
      stressScore,
      stressCategory: getCategory(stressScore, "stress"),
    };

    // Set result and mark as submitted
    setResult(resultData);
    setSubmitted(true);

    // Send results to Django backend
    sendResultsToDjango(resultData);
  };

  // Get color based on category
  const getCategoryColor = (category) => {
    switch (category) {
      case "Normal": return "bg-green-100 text-green-800";
      case "Mild": return "bg-yellow-100 text-yellow-800";
      case "Moderate": return "bg-orange-100 text-orange-800";
      case "Severe": return "bg-red-100 text-red-800";
      case "Extremely Severe": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
      const [animate, setAnimate] = useState(false);
  
      useEffect(() => {
          setAnimate(true);
      }, []);
      const data_se = [
          { severity: 'Normal', depression: '0-9', anxiety: '0-7', stress: '0-14', color: '#6dd5ed' },
          { severity: 'Mild', depression: '10-13', anxiety: '8-9', stress: '15-18', color: '#81c784' },
          { severity: 'Moderate', depression: '14-20', anxiety: '10-14', stress: '19-25', color: '#fff176' },
          { severity: 'Severe', depression: '21-27', anxiety: '15-19', stress: '26-33', color: '#ffb74d' },
          { severity: 'Extremely Severe', depression: '28+', anxiety: '20+', stress: '34+', color: '#e57373' }
      ];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-orange-300 to-pink-300 flex items-center justify-center py-4 px-2"
      style={{ 
        backgroundImage: `url('https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=1920&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Start Screen */}
      {!started && (
        <motion.div
          className="fixed inset-0 bg-black\10 bg-opacity-90 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-white p-6 rounded-lg text-center"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          >
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Welcome to the DASS-21 Questionnaire</h1>
            <p className="text-sm text-gray-600 mb-6">
              This questionnaire will help assess your mental health. Click "Start" to begin.
            </p>
            <motion.button
              className="py-2 px-4 bg-orange-500 text-white text-lg font-bold rounded-lg hover:bg-orange-400 transition duration-200 shadow-lg"
              onClick={() => setStarted(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Questionnaire
            </motion.button>
          </motion.div>
        </motion.div>
      )}

      {/* Questionnaire */}
      {started && !submitted && (
        <motion.div
          className="bg-gradient-to-r from-pink-100 via-orange-100 to-orange-200 shadow-2xl p-4 rounded-lg w-full max-w-[700px]"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Toggle Instructions Button */}
          <motion.button
            className="fixed top-4 right-4 bg-orange-500 text-white p-2 rounded-full shadow-lg hover:bg-orange-400 transition duration-200 z-50"
            onClick={() => setShowInstructions(!showInstructions)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaInfoCircle className="w-5 h-5" />
          </motion.button>

          {/* Instructions Section */}
          {showInstructions && (
            <motion.div
              className="mb-4 bg-pink-100 p-4 rounded-lg shadow-md border-l-8 border-orange-300"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">DASS-21 Questionnaire</h1>
              <p className="text-sm text-gray-700 leading-relaxed mb-2 text-center">
                Please carefully read each statement and rate how much it applied to you over the past week. Your responses will help assess your current mental state.
              </p>

              <div className="text-left">
                <strong className="text-gray-800 text-lg">Rating scale:</strong>
                <ul className="text-gray-600 mt-2 space-y-2 text-sm">
                  {/* Never */}
                  <motion.li
                    className="flex items-center space-x-2"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <FaTimesCircle className="w-5 h-5 text-red-500" />
                    <span className="text-base text-gray-800">
                      <strong>0:</strong> Did not apply to me at all - <strong>NEVER</strong>
                    </span>
                  </motion.li>
                  {/* Sometimes */}
                  <motion.li
                    className="flex items-center space-x-2"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <FaCheckCircle className="w-5 h-5 text-yellow-500" />
                    <span className="text-base text-gray-800">
                      <strong>1:</strong> Applied to me to some degree - <strong>SOMETIMES</strong>
                    </span>
                  </motion.li>
                  {/* Often */}
                  <motion.li
                    className="flex items-center space-x-2"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <FaCheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-base text-gray-800">
                      <strong>2:</strong> Applied to me to a considerable degree - <strong>OFTEN</strong>
                    </span>
                  </motion.li>
                  {/* Almost Always */}
                  <motion.li
                    className="flex items-center space-x-2"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <FaFireAlt className="w-5 h-5 text-orange-500" />
                    <span className="text-base text-gray-800">
                      <strong>3:</strong> Applied to me very much - <strong>ALMOST ALWAYS</strong>
                    </span>
                  </motion.li>
                </ul>
              </div>

              {/* Next Button */}
              <motion.button
                className="py-2 px-4 bg-green-500 text-white text-lg font-bold rounded-lg hover:bg-green-400 transition duration-200 shadow-lg mt-2"
                onClick={() => setShowInstructions(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Next
              </motion.button>
            </motion.div>
          )}

          {/* Question Navigation and Form */}
          {!showInstructions && (
            <>
              {/* Question Navigation */}
              <div className="mb-4 flex flex-wrap justify-center gap-2">
                {questions.map((_, index) => (
                  <motion.button
                    key={index}
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${answers[index] !== null
                        ? "bg-green-500 text-white"
                        : index === currentQuestionIndex
                          ? "bg-orange-500 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => goToQuestion(index)}
                  >
                    {index + 1}
                  </motion.button>
                ))}
              </div>

              {/* Form Section - Only Show Current Question */}
              <form onSubmit={calculateScore} className="space-y-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQuestionIndex}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="bg-orange-50 border border-orange-200 rounded-lg p-2 shadow-md"
                  >
                    <h2 className="text-xs text-orange-500 mb-1">Question {currentQuestionIndex + 1} of {questions.length}</h2>
                    <label className="block text-lg text-gray-800 font-semibold mb-2">
                      {questions[currentQuestionIndex]}
                    </label>
                    {/* Display the image or video */}
                    <div className="flex justify-center mb-2">
                      <div className="w-[900px] h-[270px] overflow-hidden rounded-lg shadow-md">
                        {isVideo(questionImages[currentQuestionIndex]) ? (
                          <video
                            controls
                            autoPlay
                            loop
                            muted
                            className="w-full h-full object-contain"
                          >
                            <source src={questionImages[currentQuestionIndex]} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        ) : (
                          <img
                            src={questionImages[currentQuestionIndex]}
                            alt={`Question ${currentQuestionIndex + 1}`}
                            className="w-full h-full object-contain"
                          />
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      {[0, 1, 2, 3].map((value) => (
                        <motion.label
                          key={value}
                          className={`flex items-center space-x-2 p-1 rounded-lg ${answers[currentQuestionIndex] === value ? "bg-orange-200" : "hover:bg-orange-100"
                            } cursor-pointer transition-colors duration-200`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <input
                            type="radio"
                            name={`question-${currentQuestionIndex}`}
                            value={value}
                            checked={answers[currentQuestionIndex] === value}
                            onChange={(e) => handleAnswerChange(currentQuestionIndex, e.target.value)}
                            className="form-radio text-pink-500 focus:ring-2 focus:ring-orange-200"
                          />
                          <span className="text-sm text-gray-700 font-medium">
                            {value === 0 ? 'Never' : value === 1 ? 'Sometimes' : value === 2 ? 'Often' : 'Always'}
                          </span>
                        </motion.label>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-2">
                  <motion.button
                    type="button"
                    onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                    className={`py-1 px-3 bg-gray-500 text-white font-bold rounded-lg hover:bg-gray-400 transition duration-200 shadow-lg ${currentQuestionIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    disabled={currentQuestionIndex === 0}
                    whileHover={{ scale: currentQuestionIndex === 0 ? 1 : 1.05 }}
                    whileTap={{ scale: currentQuestionIndex === 0 ? 1 : 0.95 }}
                  >
                    Previous
                  </motion.button>

                  {currentQuestionIndex < questions.length - 1 ? (
                    <motion.button
                      type="button"
                      onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                      className="py-1 px-3 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-400 transition duration-200 shadow-lg"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Next
                    </motion.button>
                  ) : (
                    <motion.button
                      type="submit"
                      className="py-1 px-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-400 transition duration-200 shadow-lg"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Submit
                    </motion.button>
                  )}
                </div>
              </form>
            </>
          )}
        </motion.div>
      )}

      {/* Result Section */}
      {submitted && result && (
        
        <motion.div
          className="mt-4 bg-pink-50 p-4 rounded-lg shadow-md border border-orange-300 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
           <CardWrapper className="mb-6">
                <div className="w-full  max-w-4xl mx-auto p-6 rounded-lg shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
                    <h3 className="font-bold text-sm mb-0 text-gray-800">
                        DASS-21 Score Interpretation:
                    </h3>
                    <h2 className="text-l font-bold mb-4 text-center text-gray-800">
                        Depression Anxiety Stress Scale (DASS)
                    </h2>
                    <div className="overflow-hidden rounded-sm shadow-md">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                                    <th className="px-4 py-3 text-left">Severity</th>
                                    <th className="px-4 py-3 text-center">Depression</th>
                                    <th className="px-4 py-3 text-center">Anxiety</th>
                                    <th className="px-4 py-3 text-center">Stress</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data_se.map((row, index) => (
                                    <tr
                                        key={index}
                                        className="border-b border-gray-200 hover:bg-gray-50 transition-all duration-200"
                                        style={{
                                            transform: animate ? 'translateX(0)' : 'translateX(-100%)',
                                            opacity: animate ? 1 : 0,
                                            transition: `all 0.5s ease-out ${index * 0.1}s`
                                        }}
                                    >
                                        <td className="px-4 py-3 font-medium" style={{ backgroundColor: `${row.color}33` }}>
                                            <div className="flex items-center">
                                                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: row.color }}></div>
                                                {row.severity}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-center">{row.depression}</td>
                                        <td className="px-4 py-3 text-center">{row.anxiety}</td>
                                        <td className="px-4 py-3 text-center">{row.stress}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="mt-4 text-sm text-gray-600 text-center">
                        Based on DASS-21 scoring. For screening purposes only. Always consult with a healthcare professional.
                    </p>
                </div>
            </CardWrapper>
          <motion.h2
            className="text-xl font-bold text-gray-800 mb-2"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Your DASS-21 Results
          </motion.h2>
          {/* <motion.p
            className="text-sm font-semibold text-gray-700 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Based on your answers, here are your categorized scores:
            Normal (0 to 9), Mild (10 to 13), Moderate, (13 to 20), Severe (21 to 28), Extremely Severe (39 and above)
          </motion.p> */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-1">
            {[
              {
                icon: <FaSadTear className="text-blue-500 text-xl" />,
                title: "Depression",
                score: result.depressionScore,
                category: result.depressionCategory
              },
              {
                icon: <FaHeartbeat className="text-green-500 text-xl" />,
                title: "Anxiety",
                score: result.anxietyScore,
                category: result.anxietyCategory
              },
              {
                icon: <FaExclamationTriangle className="text-red-500 text-xl" />,
                title: "Stress",
                score: result.stressScore,
                category: result.stressCategory
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-white p-2 rounded-lg shadow-md border border-orange-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + (index * 0.2) }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex justify-center mb-1">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">{item.title}</h3>
                <p className="text-2xl font-bold text-orange-500 mb-1">{item.score}</p>
                <p className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getCategoryColor(item.category)}`}>
                  {item.category}
                </p>
              </motion.div>
            ))}
          </div>

          {/* API Status Message */}
          <AnimatePresence>
            {apiStatus.loading && (
              <motion.div
                className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-2 mb-2 rounded"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <p className="font-medium">Saving your results...</p>
              </motion.div>
            )}

            {apiStatus.success && (
              <motion.div
                className="bg-green-100 border-l-4 border-green-500 text-green-700 p-2 mb-2 rounded"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <p className="font-medium">Your results have been saved successfully!</p>
              </motion.div>
            )}

            {apiStatus.error && (
              <motion.div
                className="bg-red-100 border-l-4 border-red-500 text-red-700 p-2 mb-2 rounded"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <p className="font-medium">Error: {apiStatus.error}</p>
                <p>Your results were calculated but couldn't be saved. Please try again.</p>
              </motion.div>
            )}
          </AnimatePresence>
          <RouterLink to={`/home?email=${encodeURIComponent(email)}`}>
          <motion.button
            className="py-1 px-3 bg-orange-500 text-white text-sm font-bold rounded-lg hover:bg-orange-400 transition duration-200 shadow-lg mr-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            Home
          </motion.button>
          </RouterLink>
          <motion.button
            className="py-1 px-3 bg-orange-500 text-white text-sm font-bold rounded-lg hover:bg-orange-400 transition duration-200 shadow-lg mr-2"
            onClick={() => window.location.reload()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            Take Test Again
          </motion.button>
          <RouterLink to={`/audio-testing?email=${encodeURIComponent(email)}&fromComponent=true`}>
          <motion.button
            className="py-1 px-3 bg-orange-500 text-white text-sm font-bold rounded-lg hover:bg-orange-400 transition duration-200 shadow-lg ml-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            Go to Audio Model
          </motion.button>
          </RouterLink>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Questionnaire;