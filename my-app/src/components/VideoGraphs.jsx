import React, { useState } from 'react';
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
import api from "../api";


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const VideoGraphs = ({ results, email, fromComponent }) => {
  const navigate = useNavigate();

  // Extract final scores, video prediction, and text predictions from the results
  const finalScores = results && results.final_scores ? results.final_scores : { depression: 0, anxiety: 0, stress: 0 };
  const videoPrediction = results && results.video_prediction ? results.video_prediction : { depression: 0, anxiety: 0, stress: 0 };
  const textPredictions = results && results.text_predictions ? results.text_predictions : [];

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


  // Function to determine status text and color based on score (percentage)
  const getStatusInfo = (score) => {
    const numScore = parseFloat(score);
    if (numScore < 33) return { text: "Low", color: "text-green-500" };
    if (numScore < 66) return { text: "Moderate", color: "text-yellow-500" };
    return { text: "High", color: "text-red-500" };
  };


  // Prepare final scores (DAS) values for display
  const finalDepression = finalScores.depression.toFixed(2);
  const finalAnxiety = finalScores.anxiety.toFixed(2);
  const finalStress = finalScores.stress.toFixed(2);

  // Prepare chart data for Video Prediction
  const videoChartData = {
    labels: ['Depression', 'Anxiety', 'Stress'],
    datasets: [
      {
        label: "Video Prediction",
        data: [videoPrediction.depression, videoPrediction.anxiety, videoPrediction.stress],
        backgroundColor: [
          "rgba(255, 99, 132, 0.7)",
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 206, 86, 0.7)"
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)"
        ],
        borderWidth: 1,
      },
    ],
  };

  // Prepare chart data for Text Predictions
  const textChartData = {
    labels: textPredictions.map(item => `Q${item.text_index}`),
    datasets: [
      {
        label: "Depression",
        data: textPredictions.map(item => item.text_prediction.depression),
        backgroundColor: "rgba(153, 102, 255, 0.7)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
      {
        label: "Anxiety",
        data: textPredictions.map(item => item.text_prediction.anxiety),
        backgroundColor: "rgba(75, 192, 192, 0.7)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Stress",
        data: textPredictions.map(item => item.text_prediction.stress),
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
            size: 12,
          },
        },
      },
      title: { display: false },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleFont: { family: "'Poppins', sans-serif", size: 14 },
        bodyFont: { family: "'Poppins', sans-serif", size: 13 },
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { family: "'Poppins', sans-serif" } },
      },
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 10,
          font: { family: "'Poppins', sans-serif" },
        },
      },
    },
    animation: { duration: 2000 },
  };

  const handleClick = async () => {
    try {
      const response = await api.post('/api/report_generate/', { email });
      const resultData = response.data;
      navigate('/report', {
        state: { email, resultData },
      });
    } catch (error) {
      console.error('Error fetching result data:', error.response || error);
    }
  };
  // Animation container for summary cards
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };
    // Navigation handler
    const handleClick_home = (route) => {
      navigate(`${route}?email=${encodeURIComponent(email)}&fromComponent=true`);
    };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8 flex flex-col items-center" style={{ fontFamily: "'Poppins', sans-serif" }}>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="w-full max-w-4xl mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
            Video Mental Health Analysis
          </h1>
          <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleClick_home("/home")}
              className="mt-4 md:mt-0 px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Home
            </motion.button>
          {fromComponent && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleClick()}
              className="mt-4 md:mt-0 px-5 py-3 bg-gradient-to-r from-indigo-600 to-green-600 rounded-lg text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Generate Report
            </motion.button>
          )}
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="w-full max-w-4xl mb-6">
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

      {/* Final DAS Summary Cards */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 w-full max-w-4xl">
        {[
          { label: "Depression", value: finalDepression, color: "from-red-400 to-red-600" },
          { label: "Anxiety", value: finalAnxiety, color: "from-blue-400 to-blue-600" },
          { label: "Stress", value: finalStress, color: "from-yellow-400 to-yellow-600" },
        ].map((item, index) => {
          const status = getStatusInfo(item.value);
          return (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden"
            >
              <div className={`h-2 bg-gradient-to-r ${item.color}`}></div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-semibold text-gray-700">{item.label}</span>
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

      {/* Video Analysis Chart */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="w-full max-w-4xl mb-8 bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="h-2 bg-gradient-to-r from-purple-400 to-indigo-600"></div>
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Video Analysis</h2>
          <div className="h-64 md:h-80">
            <Bar data={videoChartData} options={chartOptions} />
          </div>
        </div>
      </motion.div>

      {/* Text Analysis Chart */}
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
    </div>
  );
};

export default VideoGraphs;