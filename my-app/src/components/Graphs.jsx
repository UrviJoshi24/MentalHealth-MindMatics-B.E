import React, { useEffect ,useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
// import Cumulative_Report from './Cumulative_Report';


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Graphs = ({ results, email ,fromComponent }) => {
  const navigate = useNavigate();

  // const [animate, setAnimate] = useState(false);
  
  // useEffect(() => {
  //     setAnimate(true);
  // }, []);

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
  
  // Extract the predictions array from the response object
  const resultsArray =
    Array.isArray(results)
      ? results
      : results && results.predictions
      ? results.predictions
      : [];

  // Calculate overall average scores from both audio and text predictions
  let totalDepression = 0;
  let totalAnxiety = 0;
  let totalStress = 0;
  resultsArray.forEach(item => {
    const audioScores = item.audio_prediction.audio_mental_health_scores.mental_health_scores;
    const textScores = item.text_prediction.text_mental_health_scores;
    totalDepression += (audioScores.depression + textScores.depression) / 2;
    totalAnxiety += (audioScores.anxiety + textScores.anxiety) / 2;
    totalStress += (audioScores.stress + textScores.stress) / 2;
  });
  const count = resultsArray.length || 1;
  const avgDepression = (totalDepression / count).toFixed(2);
  const avgAnxiety = (totalAnxiety / count).toFixed(2);
  const avgStress = (totalStress / count).toFixed(2);

 // Function to determine status text and color based on score (percentage)
const getStatusInfo = (score) => {
  const numScore = parseFloat(score);
  if (numScore < 33) return { text: "Low", color: "text-green-500" };
  if (numScore < 66) return { text: "Moderate", color: "text-yellow-500" };
  return { text: "High", color: "text-red-500" };
};

  // Prepare chart data for Audio Predictions
  const audioChartData = {
    labels: resultsArray.map(item => `Q${item.audio_index}`),
    datasets: [
      {
        label: "Depression",
        data: resultsArray.map(item => item.audio_prediction.audio_mental_health_scores.mental_health_scores.depression),
        backgroundColor: "rgba(255, 99, 132, 0.7)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
      {
        label: "Anxiety",
        data: resultsArray.map(item => item.audio_prediction.audio_mental_health_scores.mental_health_scores.anxiety),
        backgroundColor: "rgba(54, 162, 235, 0.7)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
      {
        label: "Stress",
        data: resultsArray.map(item => item.audio_prediction.audio_mental_health_scores.mental_health_scores.stress),
        backgroundColor: "rgba(255, 206, 86, 0.7)",
        borderColor: "rgba(255, 206, 86, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Prepare chart data for Text Predictions
  const textChartData = {
    labels: resultsArray.map(item => `Q${item.audio_index}`),
    datasets: [
      {
        label: "Depression",
        data: resultsArray.map(item => item.text_prediction.text_mental_health_scores.depression),
        backgroundColor: "rgba(153, 102, 255, 0.7)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
      {
        label: "Anxiety",
        data: resultsArray.map(item => item.text_prediction.text_mental_health_scores.anxiety),
        backgroundColor: "rgba(75, 192, 192, 0.7)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Stress",
        data: resultsArray.map(item => item.text_prediction.text_mental_health_scores.stress),
        backgroundColor: "rgba(255, 159, 64, 0.7)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: "top",
        labels: {
          font: {
            family: "'Poppins', sans-serif",
            size: 12
          }
        }
      },
      title: { 
        display: false
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleFont: {
          family: "'Poppins', sans-serif",
          size: 14
        },
        bodyFont: {
          family: "'Poppins', sans-serif",
          size: 13
        },
        padding: 12,
        cornerRadius: 8
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            family: "'Poppins', sans-serif"
          }
        }
      },
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 10,
          font: {
            family: "'Poppins', sans-serif"
          }
        }
      }
    },
    animation: {
      duration: 2000
    }
  };

  // Navigation handler
  const handleClick = (route) => {
    navigate(`${route}?email=${encodeURIComponent(email)}&fromComponent=true`);
  };


  // Staggered animation for cards
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8 flex flex-col items-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-4xl mb-6"
      >
        <div className="flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
            Mental Health Analysis
          </h1>
          <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleClick('/home')}
          className="mt-4 md:mt-0 px-5 py-3 bg-gradient-to-r from-indigo-600 to-green-600 rounded-lg text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Home
        </motion.button>
          {fromComponent && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleClick('/video-based-detection')}
          className="mt-4 md:mt-0 px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Go to Video Model
        </motion.button>
      )}
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-4xl mb-6"
      >
      <CardWrapper className='mb-6'>
                {/* Severity Legend */}
                <h4 className="font-bold text-md mb-2 text-gray-800">Severity Legend</h4>
                <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                    {/* Colored Bar */}
                    <div className="flex w-full h-10 rounded overflow-hidden">
                        <div className="w-[33%] bg-gradient-to-r from-green-400 to-green-600"></div>
                        <div className="w-[33%] bg-gradient-to-r from-yellow-400 to-yellow-600"></div>
                        <div className="w-[14%] bg-gradient-to-r from-orange-400 to-orange-600"></div>
                        <div className="w-[20%] bg-gradient-to-r from-red-400 to-red-600"></div>
                    </div>
                    {/* Labels and Ranges */}
                    <div className="flex w-full mt-2 text-gray-800">
                        <div className="w-[33%] text-center">
                            <p className="font-semibold text-sm">Mild</p>
                            <p className="text-xs">0-33%</p>
                        </div>
                        <div className="w-[33%] text-center">
                            <p className="font-semibold text-sm">Moderate</p>
                            <p className="text-xs">33-66%</p>
                        </div>
                        <div className="w-[14%] text-center">
                            <p className="font-semibold text-sm">Severe</p>
                            <p className="text-xs">66-80%</p>
                        </div>
                        <div className="w-[20%] text-center">
                            <p className="font-semibold text-sm">Extreme</p>
                            <p className="text-xs">80-100%</p>
                        </div>
                    </div>
                </div>
            </CardWrapper>
            </motion.div>
      
      {/* Overall Summary Cards */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 w-full max-w-4xl"
      >
        {[
          { label: "Depression", value: avgDepression, color: "from-red-400 to-red-600" },
          { label: "Anxiety", value: avgAnxiety, color: "from-blue-400 to-blue-600"},
          { label: "Stress", value: avgStress, color: "from-yellow-400 to-yellow-600" }
        ].map((item, index) => {
          const status = getStatusInfo(item.value);
          return (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
              }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden"
            >
              <div className={`h-2 bg-gradient-to-r ${item.color}`}></div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-semibold text-gray-700">{item.label}</span>
                  <span className="text-3xl">{item.icon}</span>
                </div>
                <div className="flex items-end">
                  <span className="text-4xl font-bold">{item.value}</span>
                  <span className={`ml-2 mb-1 ${status.color} font-medium`}>
                    {status.text}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
      
      {/* Chart Sections */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="w-full max-w-4xl mb-8 bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="h-2 bg-gradient-to-r from-purple-400 to-indigo-600"></div>
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Audio Analysis</h2>
          <div className="h-64 md:h-80">
            <Bar data={audioChartData} options={chartOptions} />
          </div>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        className="w-full max-w-4xl mb-8 bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="h-2 bg-gradient-to-r from-teal-400 to-cyan-600"></div>
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Text Analysis</h2>
          <div className="h-64 md:h-80">
            <Bar data={textChartData} options={chartOptions} />
          </div>
        </div>
      </motion.div>
      
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mb-12">
        <motion.button
          onClick={() => window.print()}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Download Report (PDF)
        </motion.button>
      </div>
    </div>
  );
};

export default Graphs;