import React, { useState, useRef } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Printer, HomeIcon, Download, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Import for table support in jsPDF
import api from '../api';
import { toast } from 'react-toastify';

const DiaryReport = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [hasPrinted, setHasPrinted] = useState(false);
  const reportRef = useRef(null);
  const { state } = useLocation();
  const { email } = state || {};

  // Hardcoded diary data for 5 days (replace with API data in a real app)
  const diaryData = [
    { day: 1, depression: 50, anxiety: 40, stress: 80 },
    { day: 2, depression: 5, anxiety: 50, stress: 85 },
    { day: 3, depression: 10, anxiety: 5, stress: 15 },
    { day: 4, depression: 0, anxiety: 10, stress: 30 },
    { day: 5, depression: 4, anxiety: 15, stress: 20 },
  ];

  // Calculate average scores over the 5 days
  const calculateAverages = () => {
    const totals = diaryData.reduce(
      (acc, day) => {
        acc.depression += day.depression;
        acc.anxiety += day.anxiety;
        acc.stress += day.stress;
        return acc;
      },
      { depression: 0, anxiety: 0, stress: 0 }
    );
    const numDays = diaryData.length;
    return {
      depression: totals.depression / numDays,
      anxiety: totals.anxiety / numDays,
      stress: totals.stress / numDays,
    };
  };

  const averageScores = calculateAverages();

  // Calculate trend direction for insights
  const calculateChange = (metric) => {
    const firstDay = diaryData[0][metric];
    const lastDay = diaryData[diaryData.length - 1][metric];
    const change = lastDay - firstDay;
    return change > 0 ? 'increased' : change < 0 ? 'decreased' : 'remained stable';
  };

  const depressionChange = calculateChange('depression');
  const anxietyChange = calculateChange('anxiety');
  const stressChange = calculateChange('stress');

  // Prepare data for the line chart
  const chartData = diaryData.map((day) => ({
    day: `Day ${day.day}`,
    depression: day.depression,
    anxiety: day.anxiety,
    stress: day.stress,
  }));

  // Get status info based on score thresholds
  const getStatusInfo = (score) => {
    const numScore = parseFloat(score);
    if (numScore < 33) return { text: 'Low', color: '#4CAF50' }; // Green
    if (numScore < 66) return { text: 'Moderate', color: '#FFC107' }; // Yellow
    return { text: 'High', color: '#F44336' }; // Red
  };

  // Render score card
  const renderScoreCard = (title, score) => {
    const { text: level, color } = getStatusInfo(score);
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.03, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
        className="bg-white rounded-lg shadow-lg p-6 mb-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 h-full w-2" style={{ backgroundColor: color }}></div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <div className="flex items-center">
          <div className="text-4xl font-bold mr-4" style={{ color }}>
            {score.toFixed(1)}%
          </div>
          <motion.div className="text-lg font-medium" style={{ color }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            {level} Level
          </motion.div>
        </div>
      </motion.div>
    );
  };

  // PDF generation function (Download PDF)
  const generatePDF = async () => {
    try {
      setIsDownloading(true);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();

      // Helper functions
      const addPageTitle = (title) => {
        pdf.setFontSize(22);
        pdf.setTextColor(44, 62, 80);
        pdf.text(title, pageWidth / 2, 20, { align: 'center' });
      };

      const addSectionTitle = (title, yPosition) => {
        pdf.setFontSize(16);
        pdf.setTextColor(44, 62, 80);
        pdf.text(title, 15, yPosition);
        pdf.setLineWidth(0.5);
        pdf.setDrawColor(200, 200, 200);
        pdf.line(15, yPosition + 2, pageWidth - 15, yPosition + 2);
        return yPosition + 10;
      };

      const addScoreBox = (title, score, x, y, width) => {
        const { text: level, color } = getStatusInfo(score);
        const colorRGB = hexToRgb(color);
        pdf.setFillColor(250, 250, 250);
        pdf.setDrawColor(220, 220, 220);
        pdf.roundedRect(x, y, width, 25, 2, 2, 'FD');
        pdf.setFontSize(11);
        pdf.setTextColor(80, 80, 80);
        pdf.text(title, x + 5, y + 6);
        pdf.setFontSize(14);
        pdf.setTextColor(colorRGB.r, colorRGB.g, colorRGB.b);
        pdf.text(`${score.toFixed(1)}%`, x + 5, y + 16);
        pdf.setFontSize(10);
        pdf.text(`${level} Level`, x + 25, y + 16);
      };

      const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
          ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
          : { r: 0, g: 0, b: 0 };
      };

      // Page 1: Summary and Trends
      addPageTitle('Mental Health Diary Report');
      let yPos = 40;
      pdf.setFontSize(12);
      pdf.setTextColor(80, 80, 80);
      if (email) {
        pdf.text(`Report for: ${email}`, 15, yPos);
        yPos += 10;
      }
      const generatedDate = new Date().toLocaleDateString();
      pdf.text(`Generated on: ${generatedDate}`, 15, yPos);
      yPos += 15;

      yPos = addSectionTitle('Average Scores Over 5 Days', yPos);
      yPos += 10;
      const boxWidth = (pageWidth - 40) / 3;
      addScoreBox('Depression', averageScores.depression, 15, yPos, boxWidth);
      addScoreBox('Anxiety', averageScores.anxiety, 15 + boxWidth + 5, yPos, boxWidth);
      addScoreBox('Stress', averageScores.stress, 15 + 2 * (boxWidth + 5), yPos, boxWidth);
      yPos += 35;

      yPos = addSectionTitle('Mental Health Trends', yPos);
      yPos += 5;
      const chartElement = document.querySelector('.trend-chart');
      if (chartElement) {
        const canvas = await html2canvas(chartElement, { scale: 2, backgroundColor: null });
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pageWidth - 30;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 15, yPos, imgWidth, imgHeight);
        yPos += imgHeight + 15;
      }

      yPos = addSectionTitle('Key Insights', yPos);
      yPos += 10;
      pdf.setFontSize(10);
      pdf.setTextColor(60, 60, 60);
      const insights = [
        `• Your depression score has ${depressionChange} over the five days.`,
        `• Your anxiety score has ${anxietyChange} over the five days.`,
        `• Your stress score has ${stressChange} over the five days.`,
      ];
      insights.forEach((insight) => {
        pdf.text(insight, 20, yPos);
        yPos += 6;
      });

      // Page 2: Daily Scores and Recommendations
      pdf.addPage();
      addPageTitle('Mental Health Diary Report - Details');
      yPos = 40;

      yPos = addSectionTitle('Daily Scores', yPos);
      yPos += 10;
      const tableData = diaryData.map((day) => [
        `Day ${day.day}`,
        `${day.depression.toFixed(1)}%`,
        `${day.anxiety.toFixed(1)}%`,
        `${day.stress.toFixed(1)}%`,
      ]);
      pdf.autoTable({
        startY: yPos,
        head: [['Day', 'Depression', 'Anxiety', 'Stress']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [44, 62, 80] },
        alternateRowStyles: { fillColor: [240, 240, 240] },
      });
      yPos = pdf.lastAutoTable.finalY + 15;

      yPos = addSectionTitle('Recommendations', yPos);
      yPos += 10;
      const recommendations = [
        '• Continue monitoring your mental health daily.',
        '• If you notice persistent high scores, consider seeking professional help.',
        '• Practice stress-relief techniques such as meditation or exercise.',
      ];
      recommendations.forEach((rec) => {
        pdf.text(rec, 20, yPos);
        yPos += 6;
      });

      pdf.save('mental_health_diary_report.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate the diary report. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  // Save and generate PDF (includes backend save)
  const save_generatePDF = async () => {
    try {
      setIsDownloading(true);
      const pdf = new jsPDF('p', 'mm', 'a4');
      // ... (Same PDF generation logic as generatePDF) ...

      const pdfBlob = pdf.output('blob');
      const generatedDate = new Date().toLocaleDateString();
      const reportData = {
        userEmail: email,
        generatedDate,
        averageScores,
        dailyScores: diaryData,
        insights: [
          `Your depression score has ${depressionChange} over the five days.`,
          `Your anxiety score has ${anxietyChange} over the five days.`,
          `Your stress score has ${stressChange} over the five days.`,
        ],
      };

      const formData = new FormData();
      formData.append('email', email);
      formData.append('reportData', JSON.stringify(reportData));
      formData.append('pdfFile', pdfBlob, 'mental_health_diary_report.pdf');

      await api.post('/api/reports-save/', formData);
      setHasPrinted(true);
      toast.success('Diary report has been saved and emailed successfully!');
    } catch (error) {
      console.error('Error saving PDF:', error);
      toast.error('Failed to save the diary report. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="max-w-6xl mx-auto p-6 relative z-10" ref={reportRef}>
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
          >
            Mental Health Diary Report
          </motion.h1>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex space-x-4">
            <RouterLink to={`/home?email=${encodeURIComponent(email)}`}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 relative overflow-hidden group"
              >
                <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full group-hover:w-32 group-hover:h-32 opacity-10"></span>
                <HomeIcon size={18} className="mr-2" />
                Home
              </motion.button>
            </RouterLink>
            <motion.button
              onClick={() => window.print()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 relative overflow-hidden group"
            >
              <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full group-hover:w-32 group-hover:h-32 opacity-10"></span>
              <Printer size={18} className="mr-2" />
              Print
            </motion.button>
            <motion.button
              onClick={generatePDF}
              disabled={isDownloading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 relative overflow-hidden group"
            >
              <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full group-hover:w-32 group-hover:h-32 opacity-10"></span>
              <Download size={18} className="mr-2" />
              {isDownloading ? 'Generating...' : 'Download PDF'}
            </motion.button>
            {!hasPrinted && (
              <motion.button
                onClick={save_generatePDF}
                disabled={isDownloading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 relative overflow-hidden group"
              >
                <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full group-hover:w-32 group-hover:h-32 opacity-10"></span>
                <Save size={18} className="mr-2" />
                {isDownloading ? 'Storing...' : 'Save PDF'}
              </motion.button>
            )}
          </motion.div>
        </div>

        {/* Average Scores Section */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white shadow-lg rounded-lg p-6"
          >
            <h2 className="text-2xl font-bold mb-6">Average Scores Over 5 Days</h2>
            <div className="flex flex-wrap -mx-2">
              <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
                {renderScoreCard('Depression', averageScores.depression)}
              </div>
              <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
                {renderScoreCard('Anxiety', averageScores.anxiety)}
              </div>
              <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
                {renderScoreCard('Stress', averageScores.stress)}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Trends Section */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white shadow-lg rounded-lg p-6"
          >
            <h2 className="text-2xl font-bold mb-6">Mental Health Trends</h2>
            <div className="h-80 trend-chart">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis tickFormatter={(value) => `${value}%`} domain={[0, 100]} ticks={[0, 20, 40, 60, 80, 100]} />
                  <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                  <Legend />
                  <Line type="monotone" dataKey="depression" stroke="#8884d8" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="anxiety" stroke="#82ca9d" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="stress" stroke="#ffc658" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Insights Section */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-blue-50 p-6 rounded-lg"
          >
            <h3 className="text-xl font-semibold mb-4">Key Insights</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Your depression score has {depressionChange} over the five days.</li>
              <li>Your anxiety score has {anxietyChange} over the five days.</li>
              <li>Your stress score has {stressChange} over the five days.</li>
            </ul>
          </motion.div>
        </div>

        {/* Recommendations Section */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-green-50 p-6 rounded-lg"
          >
            <h3 className="text-xl font-semibold mb-4">Recommendations</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Continue monitoring your mental health daily.</li>
              <li>If you notice persistent high scores, consider seeking professional help.</li>
              <li>Practice stress-relief techniques such as meditation or exercise.</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DiaryReport;