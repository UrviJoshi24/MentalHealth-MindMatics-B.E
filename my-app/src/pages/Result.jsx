import React, { useState, useEffect } from 'react';
import api from "../api";
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaQuestionCircle,
    FaMicrophone,
    FaVideo,
    FaBook,
    FaFilePdf,
    FaChartLine,
    FaCalendarAlt,
    FaChevronRight,
    FaChartBar
} from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import bg_home from "../assets/images/bg_home.jpg"




// Animation variants (unchanged)
const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const tableRowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: i => ({
        opacity: 1,
        x: 0,
        transition: {
            delay: i * 0.1,
            duration: 0.4
        }
    })
};

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

// Updated ResultTable
const ResultTable = ({ results }) => {
    if (results.length === 0) {
        return <div className="text-gray-500 italic text-center p-8">No results available</div>;
    }

    const getSeverityClass = (value) => {
        if (value <= 33) return "bg-green-100 text-green-800";
        if (value <= 66) return "bg-yellow-100 text-yellow-800";
        if (value <= 80) return "bg-yellow-100 text-orange-800";
        return "bg-red-100 text-red-800";
    };

    return (
        <div className="overflow-hidden rounded-lg shadow">
            {/* Legend */}
            <div className="p-4 border-b bg-gray-50">
                <div className="flex flex-wrap items-center space-x-4 text-sm">
                    <div className="flex items-center">
                        <span className="inline-block w-5 h-5 rounded-full bg-green-300 mr-1"></span>
                        Normal
                    </div>
                    <div className="flex items-center">
                        <span className="inline-block w-5 h-5 rounded-full bg-yellow-300 mr-1"></span>
                        Mild
                    </div>
                    <div className="flex items-center">
                        <span className="inline-block w-5 h-5 rounded-full bg-orange-300 mr-1"></span>
                        Moderate
                    </div>
                    <div className="flex items-center">
                        <span className="inline-block w-5 h-5 rounded-full bg-red-300 mr-1"></span>
                        Severe
                    </div>
                </div>
            </div>
            <table className="w-full border-collapse bg-white">
                <thead>
                    <tr className="bg-gray-200 text-gray-700">
                        <th className="p-3 border-b text-left">Timestamp</th>
                        <th className="p-3 border-b text-left">Depression</th>
                        <th className="p-3 border-b text-left">Anxiety</th>
                        <th className="p-3 border-b text-left">Stress</th>
                    </tr>
                </thead>
                <tbody>
                    <AnimatePresence>
                        {results.map((result, index) => (
                            <motion.tr
                                key={index}
                                custom={index}
                                variants={tableRowVariants}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                className="hover:bg-gray-50 transition-colors duration-150"
                            >
                                <td className="p-3 border-b">
                                    <div className="flex items-center">
                                        <FaCalendarAlt className="mr-2 text-gray-500" />
                                        {result.timestamp}
                                    </div>
                                </td>
                                <td className="p-3 border-b">
                                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${getSeverityClass(result.depression)}`}>
                                        {parseInt(result.depression, 10)}
                                    </span>
                                </td>
                                <td className="p-3 border-b">
                                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${getSeverityClass(result.anxiety)}`}>
                                        {parseInt(result.anxiety, 10)}
                                    </span>
                                </td>
                                <td className="p-3 border-b">
                                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${getSeverityClass(result.stress)}`}>
                                        {parseInt(result.stress, 10)}
                                    </span>
                                </td>
                            </motion.tr>
                        ))}
                    </AnimatePresence>
                </tbody>
            </table>
        </div>
    );
};



const ResultTable_que = ({ results }) => {
    if (results.length === 0) {
        return <div className="text-gray-500 italic text-center p-8">No results available</div>;
    }
    // Updated ResultTable
    const getSeverityClass = (type, value) => {
        // Multiply raw DASS-21 score by 2 for final score
        const finalScore = value * 2;

        if (type === "depression") {
            if (finalScore <= 9) return "bg-green-100 text-green-800"; // Normal
            else if (finalScore <= 13) return "bg-yellow-100 text-yellow-800"; // Mild
            else if (finalScore <= 20) return "bg-orange-100 text-orange-800"; // Moderate
            else if (finalScore <= 27) return "bg-red-100 text-red-800"; // Severe
            else return "bg-purple-100 text-purple-800"; // Extremely Severe
        }

        if (type === "anxiety") {
            if (finalScore <= 7) return "bg-green-100 text-green-800"; // Normal
            else if (finalScore <= 9) return "bg-yellow-100 text-yellow-800"; // Mild
            else if (finalScore <= 14) return "bg-orange-100 text-orange-800"; // Moderate
            else if (finalScore <= 19) return "bg-red-100 text-red-800"; // Severe
            else return "bg-purple-100 text-purple-800"; // Extremely Severe
        }

        if (type === "stress") {
            if (finalScore <= 14) return "bg-green-100 text-green-800"; // Normal
            else if (finalScore <= 18) return "bg-yellow-100 text-yellow-800"; // Mild
            else if (finalScore <= 25) return "bg-orange-100 text-orange-800"; // Moderate
            else if (finalScore <= 33) return "bg-red-100 text-red-800"; // Severe
            else return "bg-purple-100 text-purple-800"; // Extremely Severe
        }
    };

    return (
        <div className="overflow-hidden rounded-lg shadow">
            {/* Legend */}
            <div className="p-4 border-b bg-gray-50">
                <div className="flex flex-wrap items-center space-x-4 text-sm">
                    <div className="flex items-center">
                        <span className="inline-block w-3 h-3 rounded-full bg-green-100 mr-1"></span>
                        Normal
                    </div>
                    <div className="flex items-center">
                        <span className="inline-block w-3 h-3 rounded-full bg-yellow-100 mr-1"></span>
                        Mild
                    </div>
                    <div className="flex items-center">
                        <span className="inline-block w-3 h-3 rounded-full bg-orange-100 mr-1"></span>
                        Moderate
                    </div>
                    <div className="flex items-center">
                        <span className="inline-block w-3 h-3 rounded-full bg-red-100 mr-1"></span>
                        Severe
                    </div>
                    <div className="flex items-center">
                        <span className="inline-block w-3 h-3 rounded-full bg-purple-100 mr-1"></span>
                        Extremely Severe
                    </div>
                </div>
            </div>
            <table className="w-full border-collapse bg-white">
                <thead>
                    <tr className="bg-gray-200 text-gray-700">
                        <th className="p-3 border-b text-left">Timestamp</th>
                        <th className="p-3 border-b text-left">Depression</th>
                        <th className="p-3 border-b text-left">Anxiety</th>
                        <th className="p-3 border-b text-left">Stress</th>
                    </tr>
                </thead>
                <tbody>
                    <AnimatePresence>
                        {results.map((result, index) => (
                            <motion.tr
                                key={index}
                                custom={index}
                                variants={tableRowVariants}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                className="hover:bg-gray-50 transition-colors duration-150"
                            >
                                <td className="p-3 border-b">
                                    <div className="flex items-center">
                                        <FaCalendarAlt className="mr-2 text-gray-500" />
                                        {result.timestamp}
                                    </div>
                                </td>
                                <td className="p-3 border-b">
                                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${getSeverityClass("depression", result.depression)}`}>
                                        {result.depression * 2}
                                    </span>
                                </td>
                                <td className="p-3 border-b">
                                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${getSeverityClass("anxiety", result.anxiety)}`}>
                                        {result.anxiety * 2}
                                    </span>
                                </td>
                                <td className="p-3 border-b">
                                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${getSeverityClass("stress", result.stress)}`}>
                                        {result.stress * 2}
                                    </span>
                                </td>
                            </motion.tr>
                        ))}
                    </AnimatePresence>
                </tbody>
            </table>
        </div>
    );
};


// Updated PDFList component with Analysis button and Download API call
const PDFList = ({ overallPDFs, email }) => {
    const navigate = useNavigate();

    if (!overallPDFs || overallPDFs.length === 0) {
        return <div className="text-gray-500 italic text-center p-8">No assessment results available</div>;
    }

    // Function to get color based on score severity
    const getScoreColor = (score) => {
        if (score < 33) return "bg-green-100 text-green-800"; // Low
        if (score < 66) return "bg-yellow-100 text-yellow-800"; // Medium
        return "bg-red-100 text-red-800"; // High
    };

    // Format timestamp for better readability
    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp.replace(' ', 'T'));
        return date.toLocaleString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    // Function to navigate to analysis page
    const navigateToAnalysis = (pdfData) => {
        // Prepare data for analysis
        const resultData = {
            questionnaireResult: {
                depression: pdfData.questionnaire_depression,
                anxiety: pdfData.questionnaire_anxiety,
                stress: pdfData.questionnaire_stress
            },
            audioResult: {
                depression: pdfData.audio_depression,
                anxiety: pdfData.audio_anxiety,
                stress: pdfData.audio_stress
            },
            videoResult: {
                depression: pdfData.video_depression,
                anxiety: pdfData.video_anxiety,
                stress: pdfData.video_stress
            }
        };

        // Use navigate from react-router-dom or your custom navigation method
        // This example assumes you're using react-router-dom
        // If you're using Next.js or another routing library, adjust accordingly
        const analysis =true;
        navigate('/report', {
            state: { email, resultData ,analysis },
          });
    };

    return (
        <div className="grid grid-cols-1 gap-6">
            {overallPDFs.map((pdfData, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow duration-300"
                >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
                        <div className="flex items-center mb-3 sm:mb-0">
                            <div className="bg-blue-100 p-3 rounded-lg mr-3">
                                <FaFilePdf className="text-blue-600 text-xl" />
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-800 text-lg">
                                    Assessment Results
                                </h3>
                                <p className="text-gray-500 text-sm">
                                    {formatTimestamp(pdfData.timestamp)}
                                </p>
                            </div>
                        </div>
                        <div className="flex space-x-3">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
                                onClick={() => navigateToAnalysis(pdfData)}
                            >
                                <FaChartBar className="mr-2" />
                                <span>Analysis</span>
                            </motion.button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                        <div className={`p-4 rounded-lg ${getScoreColor(pdfData.final_depression)}`}>
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-medium">Depression</span>
                                <span className="font-bold">{pdfData.final_depression.toFixed(1)}</span>
                            </div>
                            <div className="w-full bg-white bg-opacity-50 rounded-full h-2.5">
                                <div 
                                    className="bg-current h-2.5 rounded-full" 
                                    style={{ width: `${Math.min(100, pdfData.final_depression)}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className={`p-4 rounded-lg ${getScoreColor(pdfData.final_anxiety)}`}>
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-medium">Anxiety</span>
                                <span className="font-bold">{pdfData.final_anxiety.toFixed(1)}</span>
                            </div>
                            <div className="w-full bg-white bg-opacity-50 rounded-full h-2.5">
                                <div 
                                    className="bg-current h-2.5 rounded-full" 
                                    style={{ width: `${Math.min(100, pdfData.final_anxiety)}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className={`p-4 rounded-lg ${getScoreColor(pdfData.final_stress)}`}>
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-medium">Stress</span>
                                <span className="font-bold">{pdfData.final_stress.toFixed(1)}</span>
                            </div>
                            <div className="w-full bg-white bg-opacity-50 rounded-full h-2.5">
                                <div 
                                    className="bg-current h-2.5 rounded-full" 
                                    style={{ width: `${Math.min(100, pdfData.final_stress)}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

// Updated TrendChart
const TrendChart_que = ({ data, activeMetrics }) => {
    if (!data || data.length === 0) {
        return <div className="text-gray-500 italic text-center p-8">No trend data available</div>;
    }

    const processedData = data
        .map(item => ({
            ...item,
            time: new Date(item.timestamp).getTime()
        }))
        .sort((a, b) => a.time - b.time);

    const colors = {
        depression: "#F87171",
        anxiety: "#FBBF24",
        stress: "#60A5FA"
    };

    return (
        <motion.div
            className="h-64 w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
        >
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={processedData}
                    margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis
                        dataKey="time"
                        type="number"
                        domain={['dataMin', 'dataMax']}
                        tickFormatter={(unixTime) => {
                            const date = new Date(unixTime);
                            return date.toLocaleDateString();
                        }}
                        tick={{ fontSize: 12 }}
                    />
                    <YAxis domain={[0, 34]} tick={{ fontSize: 12 }} />
                    <Tooltip
                        contentStyle={{ background: "rgba(255, 255, 255, 0.9)", borderRadius: "8px", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}
                        formatter={(value, name) => [`${value} (${name})`, '']}
                        labelFormatter={(label, payload) => {
                            if (payload && payload.length > 0) {
                                return payload[0].payload.timestamp;
                            }
                            return label;
                        }}
                    />
                    <Legend wrapperStyle={{ paddingTop: 10 }} />

                    {activeMetrics.includes('depression') && (
                        <Line
                            type="monotone"
                            name="Depression"
                            dataKey="depression"
                            stroke={colors.depression}
                            strokeWidth={2}
                            dot={{ r: 4, strokeWidth: 2, fill: "white" }}
                            activeDot={{ r: 6, strokeWidth: 0, fill: colors.depression }}
                            animationDuration={1500}
                        />
                    )}

                    {activeMetrics.includes('anxiety') && (
                        <Line
                            type="monotone"
                            name="Anxiety"
                            dataKey="anxiety"
                            stroke={colors.anxiety}
                            strokeWidth={2}
                            dot={{ r: 4, strokeWidth: 2, fill: "white" }}
                            activeDot={{ r: 6, strokeWidth: 0, fill: colors.anxiety }}
                            animationDuration={1500}
                            animationBegin={300}
                        />
                    )}

                    {activeMetrics.includes('stress') && (
                        <Line
                            type="monotone"
                            name="Stress"
                            dataKey="stress"
                            stroke={colors.stress}
                            strokeWidth={2}
                            dot={{ r: 4, strokeWidth: 2, fill: "white" }}
                            activeDot={{ r: 6, strokeWidth: 0, fill: colors.stress }}
                            animationDuration={1500}
                            animationBegin={600}
                        />
                    )}
                </LineChart>
            </ResponsiveContainer>
        </motion.div>
    );
};
// Updated TrendChart
const TrendChart_ov = ({ data, activeMetrics }) => {
    if (!data || data.length === 0) {
        return <div className="text-gray-500 italic text-center p-8">No trend data available</div>;
    }

    const processedData = data
        .map(item => ({
            ...item,
            time: new Date(item.timestamp).getTime()
        }))
        .sort((a, b) => a.time - b.time);

    const colors = {
        depression: "#F87171",
        anxiety: "#FBBF24",
        stress: "#60A5FA"
    };

    return (
        <motion.div
            className="h-64 w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
        >
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={processedData}
                    margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis
                        dataKey="time"
                        type="number"
                        domain={['dataMin', 'dataMax']}
                        tickFormatter={(unixTime) => {
                            const date = new Date(unixTime);
                            return date.toLocaleDateString();
                        }}
                        tick={{ fontSize: 12 }}
                    />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 20 }} />
                    <Tooltip
                        contentStyle={{ background: "rgba(255, 255, 255, 0.9)", borderRadius: "8px", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}
                        formatter={(value, name) => [`${value} (${name})`, '']}
                        labelFormatter={(label, payload) => {
                            if (payload && payload.length > 0) {
                                return payload[0].payload.timestamp;
                            }
                            return label;
                        }}
                    />
                    <Legend wrapperStyle={{ paddingTop: 10 }} />

                    {activeMetrics.includes('depression') && (
                        <Line
                            type="monotone"
                            name="Depression"
                            dataKey="final_depression"
                            stroke={colors.depression}
                            strokeWidth={2}
                            dot={{ r: 4, strokeWidth: 2, fill: "white" }}
                            activeDot={{ r: 6, strokeWidth: 0, fill: colors.depression }}
                            animationDuration={1500}
                        />
                    )}

                    {activeMetrics.includes('anxiety') && (
                        <Line
                            type="monotone"
                            name="Anxiety"
                            dataKey="final_anxiety"
                            stroke={colors.anxiety}
                            strokeWidth={2}
                            dot={{ r: 4, strokeWidth: 2, fill: "white" }}
                            activeDot={{ r: 6, strokeWidth: 0, fill: colors.anxiety }}
                            animationDuration={1500}
                            animationBegin={300}
                        />
                    )}

                    {activeMetrics.includes('stress') && (
                        <Line
                            type="monotone"
                            name="Stress"
                            dataKey="final_stress"
                            stroke={colors.stress}
                            strokeWidth={2}
                            dot={{ r: 4, strokeWidth: 2, fill: "white" }}
                            activeDot={{ r: 6, strokeWidth: 0, fill: colors.stress }}
                            animationDuration={1500}
                            animationBegin={600}
                        />
                    )}
                </LineChart>
            </ResponsiveContainer>
        </motion.div>
    );
};

// Updated TrendChart
const TrendChart = ({ data, activeMetrics }) => {
    if (!data || data.length === 0) {
        return <div className="text-gray-500 italic text-center p-8">No trend data available</div>;
    }

    const processedData = data
        .map(item => ({
            ...item,
            time: new Date(item.timestamp).getTime()
        }))
        .sort((a, b) => a.time - b.time);

    const colors = {
        depression: "#F87171",
        anxiety: "#FBBF24",
        stress: "#60A5FA"
    };

    return (
        <motion.div
            className="h-64 w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
        >
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={processedData}
                    margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis
                        dataKey="time"
                        type="number"
                        domain={['dataMin', 'dataMax']}
                        tickFormatter={(unixTime) => {
                            const date = new Date(unixTime);
                            return date.toLocaleDateString();
                        }}
                        tick={{ fontSize: 12 }}
                    />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 20 }} />
                    <Tooltip
                        contentStyle={{ background: "rgba(255, 255, 255, 0.9)", borderRadius: "8px", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}
                        formatter={(value, name) => [`${value} (${name})`, '']}
                        labelFormatter={(label, payload) => {
                            if (payload && payload.length > 0) {
                                return payload[0].payload.timestamp;
                            }
                            return label;
                        }}
                    />
                    <Legend wrapperStyle={{ paddingTop: 10 }} />

                    {activeMetrics.includes('depression') && (
                        <Line
                            type="monotone"
                            name="Depression"
                            dataKey="depression"
                            stroke={colors.depression}
                            strokeWidth={2}
                            dot={{ r: 4, strokeWidth: 2, fill: "white" }}
                            activeDot={{ r: 6, strokeWidth: 0, fill: colors.depression }}
                            animationDuration={1500}
                        />
                    )}

                    {activeMetrics.includes('anxiety') && (
                        <Line
                            type="monotone"
                            name="Anxiety"
                            dataKey="anxiety"
                            stroke={colors.anxiety}
                            strokeWidth={2}
                            dot={{ r: 4, strokeWidth: 2, fill: "white" }}
                            activeDot={{ r: 6, strokeWidth: 0, fill: colors.anxiety }}
                            animationDuration={1500}
                            animationBegin={300}
                        />
                    )}

                    {activeMetrics.includes('stress') && (
                        <Line
                            type="monotone"
                            name="Stress"
                            dataKey="stress"
                            stroke={colors.stress}
                            strokeWidth={2}
                            dot={{ r: 4, strokeWidth: 2, fill: "white" }}
                            activeDot={{ r: 6, strokeWidth: 0, fill: colors.stress }}
                            animationDuration={1500}
                            animationBegin={600}
                        />
                    )}
                </LineChart>
            </ResponsiveContainer>
        </motion.div>
    );
};

const SummaryCard_qu = ({ data }) => {
    // Helper functions and calculations remain unchanged
    const getMinMax = (data, key) => {
        if (data.length === 0) {
            return { minValue: "N/A", minDate: "N/A", maxValue: "N/A", maxDate: "N/A" };
        }
        const minItem = data.reduce((min, current) =>
            current[key] < min[key] ? current : min, data[0]);
        const maxItem = data.reduce((max, current) =>
            current[key] > max[key] ? current : max, data[0]);
        return {
            minValue: minItem[key],
            minDate: minItem.date,
            maxValue: maxItem[key],
            maxDate: maxItem.date
        };
    };

    const depressionMinMax = getMinMax(data, "depression");
    const anxietyMinMax = getMinMax(data, "anxiety");
    const stressMinMax = getMinMax(data, "stress");

    const avgDepression = data.length > 0
        ? (data.reduce((sum, item) => sum + item.depression, 0) / data.length).toFixed(1)
        : "N/A";

    const avgAnxiety = data.length > 0
        ? (data.reduce((sum, item) => sum + item.anxiety, 0) / data.length).toFixed(1)
        : "N/A";

    const avgStress = data.length > 0
        ? (data.reduce((sum, item) => sum + item.stress, 0) / data.length).toFixed(1)
        : "N/A";

    const getTrend = (data, key) => {
        if (data.length < 2) return "stable";
        const first = data[0][key];
        const last = data[data.length - 1][key];
        if (last < first) return "improving";
        if (last > first) return "worsening";
        return "stable";
    };

    const getTrendIcon = (trend) => {
        switch (trend) {
            case "improving": return "text-green-500 transform -rotate-45";
            case "worsening": return "text-red-500 transform rotate-45";
            default: return "text-gray-500";
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
        <>
            {/* First CardWrapper: DASS-21 Score Interpretation Legend */}
            <CardWrapper className="mb-6">
                <div className="w-full  max-w-4xl mx-auto p-6 rounded-lg shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
                    <h3 className="font-bold text-lg mb-2 text-gray-800">
                        DASS-21 Score Interpretation:
                    </h3>
                    <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
                        Depression Anxiety Stress Scale (DASS)
                    </h2>
                    <div className="overflow-hidden rounded-lg shadow-md">
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

            {/* Second CardWrapper: Summary */}
            <CardWrapper className="mb-6">
                <h3 className="font-bold text-lg mb-3 text-gray-800">Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Depression Card */}
                    <div className="p-3 bg-green-50 rounded-lg">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-gray-600">Depression</p>
                                <p className="text-2xl font-bold text-gray-800">Avg: {avgDepression}</p>
                            </div>
                            <div className={getTrendIcon(getTrend(data, "depression"))}>
                                <FaChartLine />
                            </div>
                        </div>
                        <p className="text-l font-bold text-gray-800">
                            Min: {typeof depressionMinMax.minValue === "number"
                                ? depressionMinMax.minValue.toFixed(1)
                                : "N/A"}
                            {typeof depressionMinMax.minValue === "number" && depressionMinMax.minDate
                                ? ` on ${depressionMinMax.minDate}`
                                : ""}
                        </p>
                        <p className="text-l font-bold text-gray-800">
                            Max: {typeof depressionMinMax.maxValue === "number"
                                ? depressionMinMax.maxValue.toFixed(1)
                                : "N/A"}
                            {typeof depressionMinMax.maxValue === "number" && depressionMinMax.maxDate
                                ? ` on ${depressionMinMax.maxDate}`
                                : ""}
                        </p>
                    </div>

                    {/* Anxiety Card */}
                    <div className="p-3 bg-yellow-50 rounded-lg">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-gray-600">Anxiety</p>
                                <p className="text-2xl font-bold text-gray-800">Avg: {avgAnxiety}</p>
                            </div>
                            <div className={getTrendIcon(getTrend(data, "anxiety"))}>
                                <FaChartLine />
                            </div>
                        </div>
                        <p className="text-l font-bold text-gray-800">
                            Min: {typeof anxietyMinMax.minValue === "number"
                                ? anxietyMinMax.minValue.toFixed(1)
                                : "N/A"}
                            {typeof anxietyMinMax.minValue === "number" && anxietyMinMax.minDate
                                ? ` on ${anxietyMinMax.minDate}`
                                : ""}
                        </p>
                        <p className="text-l font-bold text-gray-800">
                            Max: {typeof anxietyMinMax.maxValue === "number"
                                ? anxietyMinMax.maxValue.toFixed(1)
                                : "N/A"}
                            {typeof anxietyMinMax.maxValue === "number" && anxietyMinMax.maxDate
                                ? ` on ${anxietyMinMax.maxDate}`
                                : ""}
                        </p>
                    </div>

                    {/* Stress Card */}
                    <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-gray-600">Stress</p>
                                <p className="text-2xl font-bold text-gray-800">Avg: {avgStress}</p>
                            </div>
                            <div className={getTrendIcon(getTrend(data, "stress"))}>
                                <FaChartLine />
                            </div>
                        </div>
                        <p className="text-l font-bold text-gray-800">
                            Min: {typeof stressMinMax.minValue === "number"
                                ? stressMinMax.minValue.toFixed(1)
                                : "N/A"}
                            {typeof stressMinMax.minValue === "number" && stressMinMax.minDate
                                ? ` on ${stressMinMax.minDate}`
                                : ""}
                        </p>
                        <p className="text-l font-bold text-gray-800">
                            Max: {typeof stressMinMax.maxValue === "number"
                                ? stressMinMax.maxValue.toFixed(1)
                                : "N/A"}
                            {typeof stressMinMax.maxValue === "number" && stressMinMax.maxDate
                                ? ` on ${stressMinMax.maxDate}`
                                : ""}
                        </p>
                    </div>
                </div>
            </CardWrapper>
        </>
    );
};



const SummaryCard = ({ data }) => {
    // Helper function to calculate min and max values with their dates
    const getMinMax = (data, key) => {
        if (data.length === 0) {
            return { minValue: "N/A", minDate: "N/A", maxValue: "N/A", maxDate: "N/A" };
        }
        const minItem = data.reduce((min, current) =>
            current[key] < min[key] ? current : min, data[0]);
        const maxItem = data.reduce((max, current) =>
            current[key] > max[key] ? current : max, data[0]);
        return {
            minValue: minItem[key],
            minDate: minItem.date,
            maxValue: maxItem[key],
            maxDate: maxItem.date
        };
    };

    // Calculate min and max for each metric
    const depressionMinMax = getMinMax(data, "depression");
    const anxietyMinMax = getMinMax(data, "anxiety");
    const stressMinMax = getMinMax(data, "stress");

    // Calculate averages (unchanged from original)
    const avgDepression = data.length > 0
        ? (data.reduce((sum, item) => sum + item.depression, 0) / data.length).toFixed(1)
        : "N/A";

    const avgAnxiety = data.length > 0
        ? (data.reduce((sum, item) => sum + item.anxiety, 0) / data.length).toFixed(1)
        : "N/A";

    const avgStress = data.length > 0
        ? (data.reduce((sum, item) => sum + item.stress, 0) / data.length).toFixed(1)
        : "N/A";

    // Trend calculation functions (unchanged from original)
    const getTrend = (data, key) => {
        if (data.length < 2) return "stable";
        const first = data[0][key];
        const last = data[data.length - 1][key];
        if (last < first) return "improving";
        if (last > first) return "worsening";
        return "stable";
    };

    const getTrendIcon = (trend) => {
        switch (trend) {
            case "improving": return "text-green-500 transform -rotate-45";
            case "worsening": return "text-red-500 transform rotate-45";
            default: return "text-gray-500";
        }
    };
    // Function to determine severity based on percentage
    const getSeverityLabel = (percentage) => {
        if (percentage === "N/A") return "N/A";
        const score = parseFloat(percentage);
        if (score >= 0 && score < 33) return "Normal";
        if (score >= 33 && score < 66) return "Mild";
        if (score >= 66 && score < 80) return "Moderate";
        if (score >= 80 && score <= 100) return "Severe";
        return "Unknown";
    };
    // Calculate severity for each metric
    const depressionSeverity = getSeverityLabel(avgDepression);
    const anxietySeverity = getSeverityLabel(avgAnxiety);
    const stressSeverity = getSeverityLabel(avgStress);

    return (
        <>
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

            <CardWrapper className="mb-6">
                <h3 className="font-bold text-lg mb-3 text-gray-800">Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Depression Card */}
                    <div className="p-3 bg-green-50 rounded-lg">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-gray-600">Depression</p>
                                <p className="text-2xl font-bold text-gray-800">Avg: {avgDepression}</p>
                                <p className="text-sm text-gray-600">Severity: {depressionSeverity}</p>
                            </div>
                            <div className={getTrendIcon(getTrend(data, "depression"))}>
                                <FaChartLine />
                            </div>
                        </div>
                        <p className="text-l font-bold text-gray-800">
                            Min: {typeof depressionMinMax.minValue === "number"
                                ? depressionMinMax.minValue.toFixed(1)
                                : "N/A"}
                            {typeof depressionMinMax.minValue === "number" && depressionMinMax.minDate
                                ? ` on ${depressionMinMax.minDate}`
                                : ""}
                        </p>
                        <p className="text-l font-bold text-gray-800">
                            Max: {typeof depressionMinMax.maxValue === "number"
                                ? depressionMinMax.maxValue.toFixed(1)
                                : "N/A"}
                            {typeof depressionMinMax.maxValue === "number" && depressionMinMax.maxDate
                                ? ` on ${depressionMinMax.maxDate}`
                                : ""}
                        </p>
                    </div>

                    {/* Anxiety Card */}
                    <div className="p-3 bg-yellow-50 rounded-lg">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-gray-600">Anxiety</p>
                                <p className="text-2xl font-bold text-gray-800">Avg: {avgAnxiety}</p>
                                <p className="text-sm text-gray-600">Severity: {anxietySeverity}</p>
                            </div>
                            <div className={getTrendIcon(getTrend(data, "anxiety"))}>
                                <FaChartLine />
                            </div>
                        </div>
                        <p className="text-l font-bold text-gray-800">
                            Min: {typeof anxietyMinMax.minValue === "number"
                                ? anxietyMinMax.minValue.toFixed(1)
                                : "N/A"}
                            {typeof anxietyMinMax.minValue === "number" && anxietyMinMax.minDate
                                ? ` on ${anxietyMinMax.minDate}`
                                : ""}
                        </p>
                        <p className="text-l font-bold text-gray-800">
                            Max: {typeof anxietyMinMax.maxValue === "number"
                                ? anxietyMinMax.maxValue.toFixed(1)
                                : "N/A"}
                            {typeof anxietyMinMax.maxValue === "number" && anxietyMinMax.maxDate
                                ? ` on ${anxietyMinMax.maxDate}`
                                : ""}
                        </p>
                    </div>

                    {/* Stress Card */}
                    <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-gray-600">Stress</p>
                                <p className="text-2xl font-bold text-gray-800">Avg: {avgStress}</p>
                                <p className="text-sm text-gray-600">Severity: {stressSeverity}</p>
                            </div>
                            <div className={getTrendIcon(getTrend(data, "stress"))}>
                                <FaChartLine />
                            </div>
                        </div>
                        <p className="text-l font-bold text-gray-800">
                            Min: {typeof stressMinMax.minValue === "number"
                                ? stressMinMax.minValue.toFixed(1)
                                : "N/A"}
                            {typeof stressMinMax.minValue === "number" && stressMinMax.minDate
                                ? ` on ${stressMinMax.minDate}`
                                : ""}
                        </p>
                        <p className="text-l font-bold text-gray-800">
                            Max: {typeof stressMinMax.maxValue === "number"
                                ? stressMinMax.maxValue.toFixed(1)
                                : "N/A"}
                            {typeof stressMinMax.maxValue === "number" && stressMinMax.maxDate
                                ? ` on ${stressMinMax.maxDate}`
                                : ""}
                        </p>
                    </div>
                </div>
            </CardWrapper>
        </>
    );
};


// Updated Result Component
const Result = () => {
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email');
    const [selectedCategory, setSelectedCategory] = useState('questionnaire');
    const [isMenuOpen, setIsMenuOpen] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('all');
    const [activeMetrics, setActiveMetrics] = useState(['depression', 'anxiety', 'stress']);

    // const diaryResults = [
    //     { timestamp: '2024-03-05 15:00', depression: 3, anxiety: 2, stress: 3 },
    //     { timestamp: '2024-02-05 16:00', depression: 4, anxiety: 3, stress: 4 },
    //     { timestamp: '2024-01-05 10:00', depression: 5, anxiety: 4, stress: 5 },
    //     { timestamp: '2023-12-05 12:00', depression: 6, anxiety: 5, stress: 5 },
    //     { timestamp: '2023-11-05 14:00', depression: 7, anxiety: 6, stress: 6 },
    // ];

    // const overallPDFs = [
    //     { title: 'Comprehensive Mental Health Report - Q1 2024', url: '/pdfs/report1.pdf', date: 'March 2024' },
    //     { title: 'Monthly Progress Summary', url: '/pdfs/report2.pdf', date: 'February 2024' },
    //     { title: 'Year End Assessment', url: '/pdfs/report3.pdf', date: 'December 2023' },
    //     { title: 'Quarterly Report - Q3 2023', url: '/pdfs/report4.pdf', date: 'September 2023' },
    //     { title: 'Initial Assessment Report', url: '/pdfs/report5.pdf', date: 'July 2023' },
    // ];
    // Replace the hardcoded data with state variables
    const [questionnaireResults, setQuestionnaireResults] = useState([]);
    const [audioResults, setAudioResults] = useState([]);
    const [videoResults, setVideoResults] = useState([]);
    const [diaryResults, setDiaryResults] = useState([]);
    const [overallPDFs, setOverallPDFs] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1200);
        return () => clearTimeout(timer);
    }, []);
    useEffect(() => {
        // Only fetch if we have an email
        if (!email) {
            setIsLoading(false);
            setError("No email provided. Cannot fetch results.");
            return;
        }

        // Fetch combined data from backend
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                // Single API call to fetch all combined data
                const response = await api.post('/api/fetch_data/', { email });

                // Destructure the response data and set state accordingly
                const {
                    questionnaireResults,
                    audioResults,
                    videoResults,
                    diaryResults,
                    overallPDFs
                } = response.data;

                setQuestionnaireResults(questionnaireResults);
                setAudioResults(audioResults);
                setVideoResults(videoResults);
                setDiaryResults(diaryResults);
                setOverallPDFs(overallPDFs);

                setIsLoading(false);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to load data. Please try again later.");
                setIsLoading(false);
            }
        };

        fetchData();
    }, [email]);

    // Function to convert a timestamp to Indian Standard Format ("dd/mm/yyyy hh:mm am/pm")
    function convertToIndianStandard(timestamp) {
        // Create a Date object from the timestamp
        const date = new Date(timestamp);

        // Convert the date to IST using toLocaleString with the Asia/Kolkata timeZone option
        const istString = date.toLocaleString("en-US", {
            timeZone: "Asia/Kolkata",
            hour12: true,
            day: "numeric",
            month: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
        });

        // The result might be "22/3/2025, 12:30 AM". Remove the comma if desired:
        return istString.replace(",", "");
    }
    // Convert diaryResults timestamps to IST format:
    const formattedquestionnaireResults = questionnaireResults.map(item => ({
        ...item,
        timestamp: convertToIndianStandard(item.timestamp)
    }));
    // Convert diaryResults timestamps to IST format:
    const formattedaudioResults = audioResults.map(item => ({
        ...item,
        timestamp: convertToIndianStandard(item.timestamp)
    }));
    // Convert diaryResults timestamps to IST format:
    const formattedvideoResults = videoResults.map(item => ({
        ...item,
        timestamp: convertToIndianStandard(item.timestamp)
    }));
    // Convert diaryResults timestamps to IST format:
    const formattedDiaryResults = diaryResults.map(item => ({
        ...item,
        timestamp: convertToIndianStandard(item.timestamp)
    }));
    // Convert diaryResults timestamps to IST format:
    const formattedOverResults = overallPDFs.map(item => ({
        ...item,
        timestamp: convertToIndianStandard(item.timestamp)
    }));
    //   const formattedOverallPDFs = overallPDFs.map(item => {
    //     // Parsing the month/year string creates a Date set to the 1st of that month at midnight.
    //     const dateObj = new Date(item.date);
    //     return {
    //       ...item,
    //       date: convertToIndianStandard(dateObj)
    //     };
    //   });

    const getCurrentData = () => {
        let data;
        switch (selectedCategory) {
            case 'questionnaire': data = formattedquestionnaireResults; break;
            case 'audio': data = formattedaudioResults; break;
            case 'video': data = formattedvideoResults; break;
            case 'diary': data = formattedDiaryResults; break;
            default: data = [];
        }

        if (timeRange !== 'all') {
            const now = new Date();
            let cutoffDate = new Date();

            switch (timeRange) {
                case 'week':
                    cutoffDate.setDate(now.getDate() - 7);
                    break;
                case 'month':
                    cutoffDate.setMonth(now.getMonth() - 1);
                    break;
                case 'quarter':
                    cutoffDate.setMonth(now.getMonth() - 3);
                    break;
                case 'year':
                    cutoffDate.setFullYear(now.getFullYear() - 1);
                    break;
                default:
                    break;
            }

            return data.filter(item => new Date(item.timestamp) >= cutoffDate);
        }

        return data;
    };

    const toggleMetric = (metric) => {
        if (activeMetrics.includes(metric)) {
            setActiveMetrics(activeMetrics.filter(m => m !== metric));
        } else {
            setActiveMetrics([...activeMetrics, metric]);
        }
    };

    const categories = [
        { id: 'questionnaire', label: 'Questionnaire', icon: FaQuestionCircle, color: 'from-blue-400 to-indigo-500' },
        { id: 'audio', label: 'Audio', icon: FaMicrophone, color: 'from-green-400 to-emerald-500' },
        { id: 'video', label: 'Video', icon: FaVideo, color: 'from-purple-400 to-pink-500' },
        { id: 'diary', label: 'Diary', icon: FaBook, color: 'from-yellow-400 to-orange-500' },
        { id: 'overall', label: 'Overall PDFs', icon: FaFilePdf, color: 'from-red-400 to-rose-500' },
    ];

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center h-64">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-12 h-12 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full"
                    />
                    <p className="mt-4 text-gray-600">Loading your results...</p>
                </div>
            );
        }
        if (error) {
            return (
                <motion.div
                    className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg"
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <h3 className="font-bold text-lg mb-2">Error</h3>
                    <p>{error}</p>
                </motion.div>
            );
        }
        // Empty state handling
        if (selectedCategory !== 'overall' && getCurrentData().length === 0) {
            return (
                <motion.div
                    className="bg-blue-50 border border-blue-200 text-blue-700 p-8 rounded-lg text-center"
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <h3 className="font-bold text-xl mb-2">No Data Available</h3>
                    <p>There are no {selectedCategory} results available for this user.</p>
                    <button
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition duration-200"
                        onClick={() => setSelectedCategory('questionnaire')}
                    >
                        Try Another Category
                    </button>
                </motion.div>
            );
        }

        switch (selectedCategory) {
            case 'questionnaire':
                return (
                    <motion.div
                        key={selectedCategory}
                        variants={contentVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <SummaryCard_qu data={getCurrentData()} />
                        <div className="grid grid-cols-1 gap-6">
                            {/* Trend Analysis (Graph) comes first */}
                            <CardWrapper>
                                <div className="mb-4">
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="font-bold text-lg text-gray-800">Trend Analysis</h3>
                                        <div className="flex space-x-2">
                                            <select
                                                className="px-3 py-1 bg-gray-100 rounded-lg text-sm border border-gray-200"
                                                value={timeRange}
                                                onChange={(e) => setTimeRange(e.target.value)}
                                            >
                                                <option value="all">All Time</option>
                                                <option value="week">Last Week</option>
                                                <option value="month">Last Month</option>
                                                <option value="quarter">Last Quarter</option>
                                                <option value="year">Last Year</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2 mb-3">
                                        <button
                                            className={`px-3 py-1 ${activeMetrics.includes('depression') ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'} rounded-full text-sm transition-colors duration-200`}
                                            onClick={() => toggleMetric('depression')}
                                        >
                                            Depression
                                        </button>
                                        <button
                                            className={`px-3 py-1 ${activeMetrics.includes('anxiety') ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'} rounded-full text-sm transition-colors duration-200`}
                                            onClick={() => toggleMetric('anxiety')}
                                        >
                                            Anxiety
                                        </button>
                                        <button
                                            className={`px-3 py-1 ${activeMetrics.includes('stress') ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'} rounded-full text-sm transition-colors duration-200`}
                                            onClick={() => toggleMetric('stress')}
                                        >
                                            Stress
                                        </button>
                                    </div>
                                </div>
                                <TrendChart_que data={getCurrentData()} activeMetrics={activeMetrics} />
                            </CardWrapper>
                            {/* Recent Results (Table) comes second */}
                            <CardWrapper>
                                <h3 className="font-bold text-lg mb-3 text-gray-800">Recent Results</h3>
                                <ResultTable_que results={getCurrentData()} />
                            </CardWrapper>
                        </div>
                    </motion.div>
                );
            case 'audio':
            case 'video':
            case 'diary':
                return (
                    <motion.div
                        key={selectedCategory}
                        variants={contentVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <SummaryCard data={getCurrentData()} />
                        <div className="grid grid-cols-1 gap-6">
                            {/* Trend Analysis (Graph) comes first */}
                            <CardWrapper>
                                <div className="mb-4">
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="font-bold text-lg text-gray-800">Trend Analysis</h3>
                                        <div className="flex space-x-2">
                                            <select
                                                className="px-3 py-1 bg-gray-100 rounded-lg text-sm border border-gray-200"
                                                value={timeRange}
                                                onChange={(e) => setTimeRange(e.target.value)}
                                            >
                                                <option value="all">All Time</option>
                                                <option value="week">Last Week</option>
                                                <option value="month">Last Month</option>
                                                <option value="quarter">Last Quarter</option>
                                                <option value="year">Last Year</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2 mb-3">
                                        <button
                                            className={`px-3 py-1 ${activeMetrics.includes('depression') ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'} rounded-full text-sm transition-colors duration-200`}
                                            onClick={() => toggleMetric('depression')}
                                        >
                                            Depression
                                        </button>
                                        <button
                                            className={`px-3 py-1 ${activeMetrics.includes('anxiety') ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'} rounded-full text-sm transition-colors duration-200`}
                                            onClick={() => toggleMetric('anxiety')}
                                        >
                                            Anxiety
                                        </button>
                                        <button
                                            className={`px-3 py-1 ${activeMetrics.includes('stress') ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'} rounded-full text-sm transition-colors duration-200`}
                                            onClick={() => toggleMetric('stress')}
                                        >
                                            Stress
                                        </button>
                                    </div>
                                </div>
                                <TrendChart data={getCurrentData()} activeMetrics={activeMetrics} />
                            </CardWrapper>
                            {/* Recent Results (Table) comes second */}
                            <CardWrapper>
                                <h3 className="font-bold text-lg mb-3 text-gray-800">Recent Results</h3>
                                <ResultTable results={getCurrentData()} />
                            </CardWrapper>
                        </div>
                    </motion.div>
                );
            case 'overall':
                return (
                    <motion.div
                        key="overall"
                        variants={contentVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <CardWrapper className="mb-6">
                            <h3 className="font-bold text-lg mb-4 text-gray-800">Comprehensive Reports</h3>
                            <PDFList overallPDFs={overallPDFs} email={email}/>
                        </CardWrapper >
                        {/* Trend Analysis (Graph) comes first */}
                        <CardWrapper className="mb-6">
                            <div className="mb-4">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="font-bold text-lg text-gray-800">Trend Analysis</h3>
                                    <div className="flex space-x-2">
                                        <select
                                            className="px-3 py-1 bg-gray-100 rounded-lg text-sm border border-gray-200"
                                            value={timeRange}
                                            onChange={(e) => setTimeRange(e.target.value)}
                                        >
                                            <option value="all">All Time</option>
                                            <option value="week">Last Week</option>
                                            <option value="month">Last Month</option>
                                            <option value="quarter">Last Quarter</option>
                                            <option value="year">Last Year</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex space-x-2 mb-3">
                                    <button
                                        className={`px-3 py-1 ${activeMetrics.includes('depression') ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'} rounded-full text-sm transition-colors duration-200`}
                                        onClick={() => toggleMetric('depression')}
                                    >
                                        Depression
                                    </button>
                                    <button
                                        className={`px-3 py-1 ${activeMetrics.includes('anxiety') ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'} rounded-full text-sm transition-colors duration-200`}
                                        onClick={() => toggleMetric('anxiety')}
                                    >
                                        Anxiety
                                    </button>
                                    <button
                                        className={`px-3 py-1 ${activeMetrics.includes('stress') ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'} rounded-full text-sm transition-colors duration-200`}
                                        onClick={() => toggleMetric('stress')}
                                    >
                                        Stress
                                    </button>
                                </div>
                            </div>
                            <TrendChart_ov data={formattedOverResults} activeMetrics={activeMetrics} />
                        </CardWrapper>
                    </motion.div>
                );
            default:
                return <div className="text-gray-500">Select a category</div>;
        }
    };
    // Variants for sidebar, header, and main content
    const sidebarVariants = {
        open: {
            width: "16rem",
            transition: { duration: 0.5, type: "spring", stiffness: 100 }
        },
        closed: {
            width: "4rem",
            transition: { duration: 0.5, type: "spring", stiffness: 100 }
        }
    };

    const headerVariants = {
        open: {
            marginLeft: "16rem",
            width: "calc(100% - 16rem)",
            transition: { duration: 0.5, type: "spring", stiffness: 100 }
        },
        closed: {
            marginLeft: "4rem",
            width: "calc(100% - 4rem)",
            transition: { duration: 0.5, type: "spring", stiffness: 100 }
        }
    };

    const mainVariants = {
        open: {
            marginLeft: "16rem",
            transition: { duration: 0.5, type: "spring", stiffness: 100 }
        },
        closed: {
            marginLeft: "4rem",
            transition: { duration: 0.5, type: "spring", stiffness: 100 }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col  bg-cover bg-center bg-fixed" style={{ backgroundImage: `url(${bg_home})` }}>
            <motion.header
                className="bg-white/50 backdrop-blur-md shadow-md p-4 fixed top-0 z-10"
                variants={headerVariants}
                animate={isMenuOpen ? "open" : "closed"}
                initial={isMenuOpen ? "open" : "closed"}
            >
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Mental Health Test Results
                    </h1>
                    <div className="flex items-center space-x-4">
                        <motion.div
                            className="flex items-center bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-lg border border-blue-200"
                            whileHover={{
                                scale: 1.03,
                                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                                background: "linear-gradient(to right, #dbeafe, #ede9fe)"
                            }}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3, duration: 0.4 }}
                        >
                            <motion.svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-blue-600 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                initial={{ rotate: -30 }}
                                animate={{ rotate: 0 }}
                                transition={{ delay: 0.6, type: "spring" }}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                            </motion.svg>
                            <motion.div className="flex flex-col">
                                <motion.span
                                    className="text-blue-600 font-semibold truncate max-w-xs"
                                    initial={{ letterSpacing: "1px" }}
                                    animate={{ letterSpacing: "normal" }}
                                    transition={{ delay: 0.7, duration: 0.5 }}
                                    whileHover={{
                                        color: "#4338ca",
                                        textShadow: "0 0 1px rgba(79, 70, 229, 0.2)"
                                    }}
                                >
                                    {email}
                                </motion.span>
                            </motion.div>
                        </motion.div>
                        <RouterLink to={`/home`}>
                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)" }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition duration-200"
                            >
                                Take New Test
                            </motion.button>
                        </RouterLink>
                    </div>
                </div>
            </motion.header>

            <div className="flex flex-1 pt-20">
                {/* Sidebar */}
                <motion.aside
                    className="fixed top-0 left-0 bottom-0 bg-gray-800 text-white shadow-lg"
                    variants={sidebarVariants}
                    animate={isMenuOpen ? "open" : "closed"}
                    initial={isMenuOpen ? "open" : "closed"}
                >
                    <div className="p-4">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className={`text-xl font-semibold ${isMenuOpen ? "block" : "hidden"}`}>
                                Categories
                            </h2>
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="p-1 rounded-full hover:bg-gray-700 transition-colors duration-200"
                            >
                                <FaChevronRight
                                    className={`transform transition-transform duration-300 ${isMenuOpen ? "rotate-180" : ""
                                        }`}
                                />
                            </button>
                        </div>
                        <ul className="space-y-2">
                            {categories.map((category) => (
                                <li key={category.id}>
                                    <button
                                        onClick={() => setSelectedCategory(category.id)}
                                        className={`w-full text-left rounded flex items-center transition-all duration-200 ${selectedCategory === category.id
                                            ? `bg-gradient-to-r ${category.color} p-2`
                                            : "hover:bg-gray-700 p-2"
                                            }`}
                                    >
                                        <category.icon className={`${isMenuOpen ? "mr-2" : "mx-auto"}`} />
                                        {isMenuOpen && <span>{category.label}</span>}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </motion.aside>

                {/* Main content */}
                <motion.main
                    className="flex-1 p-6"
                    variants={mainVariants}
                    animate={isMenuOpen ? "open" : "closed"}
                    initial={isMenuOpen ? "open" : "closed"}
                >
                    <div className="container mx-auto">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="mb-4"
                        >
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                {categories.find((c) => c.id === selectedCategory)?.label} Results
                            </h2>
                            <p className="text-gray-600">
                                View and analyze your mental health assessment data
                            </p>
                        </motion.div>

                        {renderContent()}
                    </div>
                </motion.main>
            </div>
        </div>
    );

};

export default Result;