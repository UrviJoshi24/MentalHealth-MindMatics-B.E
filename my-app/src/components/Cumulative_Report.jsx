import React, { useState, useEffect, useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Printer, HomeIcon, Download, Save, UserCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import api from '../api';
import { toast } from "react-toastify";
import StressReliefRecommendations from "../components/StressReliefRecommendations";



const Cumulative_Report = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [isDownloading, setIsDownloading] = useState(false);
    const reportRef = useRef(null);
    const { state } = useLocation();
    const { email, resultData } = state || {};
    const { analysis = false } = state || {};
    const [hasPrinted, setHasPrinted] = useState(false);
    const standardizedResults = {
        questionnaire: {
            depression: analysis
                ? resultData.questionnaireResult.depression
                : (resultData.questionnaireResult.depression / 42) * 100,
            anxiety: analysis
                ? resultData.questionnaireResult.anxiety
                : (resultData.questionnaireResult.anxiety / 42) * 100,
            stress: analysis
                ? resultData.questionnaireResult.stress
                : (resultData.questionnaireResult.stress / 42) * 100,
        },
        audio: {
            depression: resultData.audioResult.depression,
            anxiety: resultData.audioResult.anxiety,
            stress: resultData.audioResult.stress,
        },
        video: {
            depression: resultData.videoResult.depression,
            anxiety: resultData.videoResult.anxiety,
            stress: resultData.videoResult.stress,
        },
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

    // Calculate average scores as percentages
    const calculateAverages = () => {
        const averages = {
            depression: (standardizedResults.questionnaire.depression + standardizedResults.audio.depression + standardizedResults.video.depression) / 3,
            anxiety: (standardizedResults.questionnaire.anxiety + standardizedResults.audio.anxiety + standardizedResults.video.anxiety) / 3,
            stress: (standardizedResults.questionnaire.stress + standardizedResults.audio.stress + standardizedResults.video.stress) / 3,
        };
        return averages;
    };

    const averageScores = calculateAverages();

    // Prepare data for overview charts
    const prepareChartData = () => {
        return [
            {
                name: 'Depression',
                Questionnaire: standardizedResults.questionnaire.depression,
                Audio: standardizedResults.audio.depression,
                Video: standardizedResults.video.depression,
                Average: averageScores.depression,
            },
            {
                name: 'Anxiety',
                Questionnaire: standardizedResults.questionnaire.anxiety,
                Audio: standardizedResults.audio.anxiety,
                Video: standardizedResults.video.anxiety,
                Average: averageScores.anxiety,
            },
            {
                name: 'Stress',
                Questionnaire: standardizedResults.questionnaire.stress,
                Audio: standardizedResults.audio.stress,
                Video: standardizedResults.video.stress,
                Average: averageScores.stress,
            },
        ];
    };

    const chartData = prepareChartData();

    // Prepare data for individual model charts
    const prepareModelData = (modelName) => {
        const modelData = standardizedResults[modelName];
        return [
            { name: 'Depression', value: modelData.depression },
            { name: 'Anxiety', value: modelData.anxiety },
            { name: 'Stress', value: modelData.stress },
        ];
    };

    // Severity level function based on percentage thresholds
    const getStatusInfo = (score) => {
        const numScore = parseFloat(score);
        if (numScore < 33) return { text: 'Low', color: '#4CAF50' }; // Green
        if (numScore < 66) return { text: 'Moderate', color: '#FFC107' }; // Yellow
        return { text: 'High', color: '#F44336' }; // Red
    };
    // PDF Generation Function
    const save_generatePDF = async () => {
        try {
            setIsDownloading(true);
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();

            // Helper function to add page title
            const addPageTitle = (title, subtitle = null) => {
                pdf.setFontSize(22);
                pdf.setTextColor(44, 62, 80);
                pdf.text(title, pageWidth / 2, 20, { align: 'center' });
                if (subtitle) {
                    pdf.setFontSize(16);
                    pdf.setTextColor(100, 100, 100);
                    pdf.text(subtitle, pageWidth / 2, 30, { align: 'center' });
                }
            };

            // Helper function to add section title
            const addSectionTitle = (title, yPosition) => {
                pdf.setFontSize(16);
                pdf.setTextColor(44, 62, 80);
                pdf.text(title, 15, yPosition);
                pdf.setLineWidth(0.5);
                pdf.setDrawColor(200, 200, 200);
                pdf.line(15, yPosition + 2, pageWidth - 15, yPosition + 2);
                return yPosition + 10;
            };

            // Helper function to add score box
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

            // Helper function to convert hex to RGB
            const hexToRgb = (hex) => {
                const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return result
                    ? {
                        r: parseInt(result[1], 16),
                        g: parseInt(result[2], 16),
                        b: parseInt(result[3], 16),
                    }
                    : { r: 0, g: 0, b: 0 };
            };

            // Overview Page
            addPageTitle('Mental Health Assessment Report');
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

            yPos = addSectionTitle('Overall Assessment', yPos);
            yPos += 10;
            const boxWidth = (pageWidth - 40) / 3;
            addScoreBox('Depression', averageScores.depression, 15, yPos, boxWidth);
            addScoreBox('Anxiety', averageScores.anxiety, 15 + boxWidth + 5, yPos, boxWidth);
            addScoreBox('Stress', averageScores.stress, 15 + 2 * (boxWidth + 5), yPos, boxWidth);
            yPos += 35;

            yPos = addSectionTitle('Assessment Comparison', yPos);
            yPos += 5;

            const originalTab = activeTab;
            setActiveTab('overview');
            await new Promise((resolve) => setTimeout(resolve, 500));

            const barChartElement = document.querySelector('#overview-section .h-80:first-child');
            if (barChartElement) {
                const canvas = await html2canvas(barChartElement, { scale: 2, backgroundColor: null });
                const imgData = canvas.toDataURL('image/png');
                const imgWidth = pageWidth - 30;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                pdf.addImage(imgData, 'PNG', 15, yPos, imgWidth, imgHeight);
                yPos += imgHeight + 15;
            }

            const lineChartElement = document.querySelector('#overview-section .h-80:nth-child(2)');
            if (lineChartElement) {
                const canvas = await html2canvas(lineChartElement, { scale: 2, backgroundColor: null });
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
                `• Depression indicators are most prominent across all assessment methods.`,
                `• Anxiety levels are consistently ${getStatusInfo(averageScores.anxiety).text.toLowerCase()} across assessments.`,
                `• Stress indicators are ${getStatusInfo(averageScores.stress).text.toLowerCase()} but show variation between assessment methods.`,
                `• The video assessment shows higher stress indicators compared to other methods.`,
            ];
            insights.forEach((insight) => {
                pdf.text(insight, 20, yPos);
                yPos += 6;
            });

            // Function to create individual assessment pages
            const createAssessmentPage = async (assessmentType) => {
                const title = assessmentType.charAt(0).toUpperCase() + assessmentType.slice(1);
                pdf.addPage();
                addPageTitle('Mental Health Assessment Report', `${title} Assessment`);

                let yPos = 50;
                yPos = addSectionTitle(`${title} Assessment Scores`, yPos);
                yPos += 10;

                addScoreBox('Depression', standardizedResults[assessmentType].depression, 15, yPos, boxWidth);
                addScoreBox('Anxiety', standardizedResults[assessmentType].anxiety, 15 + boxWidth + 5, yPos, boxWidth);
                addScoreBox('Stress', standardizedResults[assessmentType].stress, 15 + 2 * (boxWidth + 5), yPos, boxWidth);
                yPos += 35;

                setActiveTab(assessmentType);
                await new Promise((resolve) => setTimeout(resolve, 500));

                const chartElement = document.querySelector(`#${assessmentType}-section .h-80`);
                if (chartElement) {
                    const canvas = await html2canvas(chartElement, { scale: 2, backgroundColor: null });
                    const imgData = canvas.toDataURL('image/png');
                    const imgWidth = pageWidth - 30;
                    const imgHeight = (canvas.height * imgWidth) / canvas.width;
                    yPos = addSectionTitle('Assessment Analysis', yPos);
                    yPos += 10;
                    pdf.addImage(imgData, 'PNG', 15, yPos, imgWidth, imgHeight);
                    yPos += imgHeight + 15;
                }

                yPos = addSectionTitle(`${title} Assessment Insights`, yPos);
                yPos += 10;
                pdf.setFontSize(10);
                pdf.setTextColor(60, 60, 60);

                const assessmentInsights =
                    assessmentType === 'questionnaire'
                        ? [
                            `• Depression indicators are at a ${getStatusInfo(standardizedResults[assessmentType].depression).text.toLowerCase()} level.`,
                            `• Anxiety indicators are ${getStatusInfo(standardizedResults[assessmentType].anxiety).text.toLowerCase()}.`,
                            `• Stress indicators are ${getStatusInfo(standardizedResults[assessmentType].stress).text.toLowerCase()}.`,
                        ]
                        : assessmentType === 'audio'
                            ? [
                                `• Voice patterns suggest a ${getStatusInfo(standardizedResults[assessmentType].depression).text.toLowerCase()} level of depression.`,
                                `• Vocal tone indicates ${getStatusInfo(standardizedResults[assessmentType].anxiety).text.toLowerCase()} anxiety markers.`,
                                `• Speech patterns reveal ${getStatusInfo(standardizedResults[assessmentType].stress).text.toLowerCase()} stress indicators.`,
                            ]
                            : [
                                `• Facial expressions suggest ${getStatusInfo(standardizedResults[assessmentType].depression).text.toLowerCase()} depressive indicators.`,
                                `• Body language reveals ${getStatusInfo(standardizedResults[assessmentType].anxiety).text.toLowerCase()} anxiety markers.`,
                                `• Visual cues indicate ${getStatusInfo(standardizedResults[assessmentType].stress).text.toLowerCase()} stress levels.`,
                            ];

                assessmentInsights.forEach((insight) => {
                    pdf.text(insight, 20, yPos);
                    yPos += 6;
                });

                yPos = addSectionTitle('Recommendations', yPos);
                yPos += 10;
                const recommendations = [
                    `• Continue monitoring ${title.toLowerCase()} indicators regularly.`,
                    `• Consider professional consultation based on the ${getStatusInfo(standardizedResults[assessmentType].depression).text.toLowerCase()} depression levels.`,
                    `• Implement appropriate coping strategies for ${getStatusInfo(standardizedResults[assessmentType].stress).text.toLowerCase()} stress.`,
                ];
                recommendations.forEach((rec) => {
                    pdf.text(rec, 20, yPos);
                    yPos += 6;
                });
            };

            await createAssessmentPage('questionnaire');
            await createAssessmentPage('audio');
            await createAssessmentPage('video');

            setActiveTab(originalTab);

            // Generate the PDF as blob for sending to backend
            const pdfBlob = pdf.output('blob');

            // Prepare report data to send to backend
            const reportData = {
                userEmail: email,
                generatedDate,
                overallScores: averageScores,
                assessmentResults: standardizedResults,
                insights
            };

            // Prepare form data with email, report data, and PDF file
            const formData = new FormData();
            formData.append('email', email);
            formData.append('reportData', JSON.stringify(reportData));
            formData.append('pdfFile', pdfBlob, 'mental_health_assessment_report.pdf');

            // Send the request to the Django backend
            await api.post('/api/reports-save/', formData);
            setHasPrinted(true);

            // Show success notification
            toast.success('Assessment report has been saved and emailed successfully!');
        } catch (error) {
            console.error('Error generating or sending PDF:', error);
            toast.error('Failed to generate or send the assessment report. Please try again.');
        } finally {
            setIsDownloading(false);
        }
    };


    // PDF Generation Function
    const generatePDF = async () => {
        try {
            setIsDownloading(true);
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();

            // Helper function to add page title
            const addPageTitle = (title, subtitle = null) => {
                pdf.setFontSize(22);
                pdf.setTextColor(44, 62, 80);
                pdf.text(title, pageWidth / 2, 20, { align: 'center' });
                if (subtitle) {
                    pdf.setFontSize(16);
                    pdf.setTextColor(100, 100, 100);
                    pdf.text(subtitle, pageWidth / 2, 30, { align: 'center' });
                }
            };

            // Helper function to add section title
            const addSectionTitle = (title, yPosition) => {
                pdf.setFontSize(16);
                pdf.setTextColor(44, 62, 80);
                pdf.text(title, 15, yPosition);
                pdf.setLineWidth(0.5);
                pdf.setDrawColor(200, 200, 200);
                pdf.line(15, yPosition + 2, pageWidth - 15, yPosition + 2);
                return yPosition + 10;
            };

            // Helper function to add score box
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

            // Helper function to convert hex to RGB
            const hexToRgb = (hex) => {
                const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return result
                    ? {
                        r: parseInt(result[1], 16),
                        g: parseInt(result[2], 16),
                        b: parseInt(result[3], 16),
                    }
                    : { r: 0, g: 0, b: 0 };
            };

            // Overview Page
            addPageTitle('Mental Health Assessment Report');
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

            yPos = addSectionTitle('Overall Assessment', yPos);
            yPos += 10;
            const boxWidth = (pageWidth - 40) / 3;
            addScoreBox('Depression', averageScores.depression, 15, yPos, boxWidth);
            addScoreBox('Anxiety', averageScores.anxiety, 15 + boxWidth + 5, yPos, boxWidth);
            addScoreBox('Stress', averageScores.stress, 15 + 2 * (boxWidth + 5), yPos, boxWidth);
            yPos += 35;

            yPos = addSectionTitle('Assessment Comparison', yPos);
            yPos += 5;

            const originalTab = activeTab;
            setActiveTab('overview');
            await new Promise((resolve) => setTimeout(resolve, 500));

            const barChartElement = document.querySelector('#overview-section .h-80:first-child');
            if (barChartElement) {
                const canvas = await html2canvas(barChartElement, { scale: 2, backgroundColor: null });
                const imgData = canvas.toDataURL('image/png');
                const imgWidth = pageWidth - 30;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                pdf.addImage(imgData, 'PNG', 15, yPos, imgWidth, imgHeight);
                yPos += imgHeight + 15;
            }

            const lineChartElement = document.querySelector('#overview-section .h-80:nth-child(2)');
            if (lineChartElement) {
                const canvas = await html2canvas(lineChartElement, { scale: 2, backgroundColor: null });
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
                `• Depression indicators are most prominent across all assessment methods.`,
                `• Anxiety levels are consistently ${getStatusInfo(averageScores.anxiety).text.toLowerCase()} across assessments.`,
                `• Stress indicators are ${getStatusInfo(averageScores.stress).text.toLowerCase()} but show variation between assessment methods.`,
                `• The video assessment shows higher stress indicators compared to other methods.`,
            ];
            insights.forEach((insight) => {
                pdf.text(insight, 20, yPos);
                yPos += 6;
            });

            // Function to create individual assessment pages
            const createAssessmentPage = async (assessmentType) => {
                const title = assessmentType.charAt(0).toUpperCase() + assessmentType.slice(1);
                pdf.addPage();
                addPageTitle('Mental Health Assessment Report', `${title} Assessment`);

                let yPos = 50;
                yPos = addSectionTitle(`${title} Assessment Scores`, yPos);
                yPos += 10;

                addScoreBox('Depression', standardizedResults[assessmentType].depression, 15, yPos, boxWidth);
                addScoreBox('Anxiety', standardizedResults[assessmentType].anxiety, 15 + boxWidth + 5, yPos, boxWidth);
                addScoreBox('Stress', standardizedResults[assessmentType].stress, 15 + 2 * (boxWidth + 5), yPos, boxWidth);
                yPos += 35;

                setActiveTab(assessmentType);
                await new Promise((resolve) => setTimeout(resolve, 500));

                const chartElement = document.querySelector(`#${assessmentType}-section .h-80`);
                if (chartElement) {
                    const canvas = await html2canvas(chartElement, { scale: 2, backgroundColor: null });
                    const imgData = canvas.toDataURL('image/png');
                    const imgWidth = pageWidth - 30;
                    const imgHeight = (canvas.height * imgWidth) / canvas.width;
                    yPos = addSectionTitle('Assessment Analysis', yPos);
                    yPos += 10;
                    pdf.addImage(imgData, 'PNG', 15, yPos, imgWidth, imgHeight);
                    yPos += imgHeight + 15;
                }

                yPos = addSectionTitle(`${title} Assessment Insights`, yPos);
                yPos += 10;
                pdf.setFontSize(10);
                pdf.setTextColor(60, 60, 60);

                const assessmentInsights =
                    assessmentType === 'questionnaire'
                        ? [
                            `• Depression indicators are at a ${getStatusInfo(standardizedResults[assessmentType].depression).text.toLowerCase()} level.`,
                            `• Anxiety indicators are ${getStatusInfo(standardizedResults[assessmentType].anxiety).text.toLowerCase()}.`,
                            `• Stress indicators are ${getStatusInfo(standardizedResults[assessmentType].stress).text.toLowerCase()}.`,
                        ]
                        : assessmentType === 'audio'
                            ? [
                                `• Voice patterns suggest a ${getStatusInfo(standardizedResults[assessmentType].depression).text.toLowerCase()} level of depression.`,
                                `• Vocal tone indicates ${getStatusInfo(standardizedResults[assessmentType].anxiety).text.toLowerCase()} anxiety markers.`,
                                `• Speech patterns reveal ${getStatusInfo(standardizedResults[assessmentType].stress).text.toLowerCase()} stress indicators.`,
                            ]
                            : [
                                `• Facial expressions suggest ${getStatusInfo(standardizedResults[assessmentType].depression).text.toLowerCase()} depressive indicators.`,
                                `• Body language reveals ${getStatusInfo(standardizedResults[assessmentType].anxiety).text.toLowerCase()} anxiety markers.`,
                                `• Visual cues indicate ${getStatusInfo(standardizedResults[assessmentType].stress).text.toLowerCase()} stress levels.`,
                            ];

                assessmentInsights.forEach((insight) => {
                    pdf.text(insight, 20, yPos);
                    yPos += 6;
                });

                yPos = addSectionTitle('Recommendations', yPos);
                yPos += 10;
                const recommendations = [
                    `• Continue monitoring ${title.toLowerCase()} indicators regularly.`,
                    `• Consider professional consultation based on the ${getStatusInfo(standardizedResults[assessmentType].depression).text.toLowerCase()} depression levels.`,
                    `• Implement appropriate coping strategies for ${getStatusInfo(standardizedResults[assessmentType].stress).text.toLowerCase()} stress.`,
                ];
                recommendations.forEach((rec) => {
                    pdf.text(rec, 20, yPos);
                    yPos += 6;
                });
            };

            await createAssessmentPage('questionnaire');
            await createAssessmentPage('audio');
            await createAssessmentPage('video');

            setActiveTab(originalTab);
            // Save PDF locally
            pdf.save('mental_health_assessment_report.pdf');
        } catch (error) {
            console.error('Error generating or sending PDF:', error);
            toast.error('Failed to generate or send the assessment report. Please try again.');
        } finally {
            setIsDownloading(false);
        }
    };

    // Render score card with percentage
    const renderScoreCard = (title, score, additionalInfo = '') => {
        const { text: level, color } = getStatusInfo(score);

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.03, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                className="bg-white rounded-lg shadow-lg p-6 mb-6 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 h-full w-2" style={{ backgroundColor: color }}></div>
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <div className="flex items-center">
                    <div className="text-4xl font-bold mr-4" style={{ color }}>
                        {score.toFixed(1)}%
                    </div>
                    <div>
                        <motion.div className="text-lg font-medium" style={{ color }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                            {level} Level
                        </motion.div>
                        {additionalInfo && <div className="text-sm text-gray-500">{additionalInfo}</div>}
                    </div>
                </div>
            </motion.div>
        );
    };
    const handleNavigation = () => {
        // Define your thresholds here
        const DEPRESSION_THRESHOLD = 60; // Example threshold value
        const ANXIETY_THRESHOLD = 60;    // Example threshold value
        const STRESS_THRESHOLD = 60;     // Example threshold value

        // Check if any of the metrics exceed their respective thresholds
        const isHighRisk = (
            (averageScores.depression > DEPRESSION_THRESHOLD) ||
            (averageScores.anxiety > ANXIETY_THRESHOLD) ||
            (averageScores.stress > STRESS_THRESHOLD)
        );

        // Navigate to the appropriate component based on the condition
        if (isHighRisk) {
            // Redirect to personalized recommendations
            window.location.href = '/personalizedrecommendation';
            // Alternatively, if using React Router:
            // navigate('/personalized-recommendations');
        } else {
            // Redirect to stress relief recommendations
            window.location.href = '/stressreliefRecommendations';
            // Alternatively, if using React Router:
            // navigate('/stress-relief-recommendations');
        }
    };
        const [animate, setAnimate] = useState(false);
    
        useEffect(() => {
            setAnimate(true);
        }, []);
    return (
        <div className="min-h-screen py-8 bg-gray-50">
            <div className="max-w-6xl mx-auto p-6 relative z-10" ref={reportRef}>
                <div className="flex justify-between items-center mb-8">
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
                    >
                        Mental Health Assessment Report
                    </motion.h1>
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex space-x-4">
                        {!analysis && (
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
                        )}
                        {analysis && (
                            <RouterLink to={`/result?email=${encodeURIComponent(email)}`}>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 relative overflow-hidden group"
                                >
                                    <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full group-hover:w-32 group-hover:h-32 opacity-10"></span>
                                    <HomeIcon size={18} className="mr-2" />
                                    Back
                                </motion.button>
                            </RouterLink>
                        )}

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
                        {!analysis && !hasPrinted && (
                            <motion.button
                                onClick={save_generatePDF}
                                disabled={isDownloading}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 relative overflow-hidden group"
                            >
                                <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full group-hover:w-32 group-hover:h-32 opacity-10"></span>
                                <Save size={18} className="mr-2" />
                                {isDownloading ? 'Storing Pdf...' : 'Save Pdf'}
                            </motion.button>
                        )}
                    </motion.div>
                </div>
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

                {/* Average Scores Section */}
                <div className="mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white shadow-lg rounded-lg p-6"
                    >
                        <div className="flex flex-wrap -mx-2">
                            <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
                                {renderScoreCard('Depression', averageScores.depression, 'Based on all assessments')}
                            </div>
                            <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
                                {renderScoreCard('Anxiety', averageScores.anxiety, 'Based on all assessments')}
                            </div>
                            <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
                                {renderScoreCard('Stress', averageScores.stress, 'Based on all assessments')}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Tabs Section */}
                <div className="mb-8">
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                        <div className="border-b border-gray-200">
                            <nav className="flex -mb-px">
                                <button
                                    className={`py-4 px-6 font-medium text-md ${activeTab === 'overview' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                    onClick={() => setActiveTab('overview')}
                                >
                                    Overview
                                </button>
                                <button
                                    className={`py-4 px-6 font-medium text-md ${activeTab === 'questionnaire' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                    onClick={() => setActiveTab('questionnaire')}
                                >
                                    Questionnaire
                                </button>
                                <button
                                    className={`py-4 px-6 font-medium text-md ${activeTab === 'audio' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                    onClick={() => setActiveTab('audio')}
                                >
                                    Audio
                                </button>
                                <button
                                    className={`py-4 px-6 font-medium text-md ${activeTab === 'video' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                    onClick={() => setActiveTab('video')}
                                >
                                    Video
                                </button>
                            </nav>
                        </div>

                        {/* Overview Tab */}
                        {activeTab === 'overview' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="p-6" id="overview-section">
                                <h2 className="text-2xl font-bold mb-6">Comprehensive Assessment Overview</h2>

                                <div className="mb-8">
                                    <h3 className="text-xl font-semibold mb-4">Comparison Across Assessment Methods</h3>
                                    <div className="h-80 mb-8">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={chartData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis
                                                    tickFormatter={(value) => `${value}%`}
                                                    domain={[0, 100]}
                                                    ticks={[0, 20, 40, 60, 80, 100]}
                                                />
                                                <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                                                <Legend />
                                                <Bar dataKey="Questionnaire" fill="#8884d8" />
                                                <Bar dataKey="Audio" fill="#82ca9d" />
                                                <Bar dataKey="Video" fill="#ffc658" />
                                                <Bar dataKey="Average" fill="#ff8042" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <h3 className="text-xl font-semibold mb-4">Assessment Trends</h3>
                                    <div className="h-80 mb-8">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={chartData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis
                                                    tickFormatter={(value) => `${value}%`}
                                                    domain={[0, 100]}
                                                    ticks={[0, 20, 40, 60, 80, 100]}
                                                />
                                                <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                                                <Legend />
                                                <Line type="monotone" dataKey="Questionnaire" stroke="#8884d8" activeDot={{ r: 8 }} />
                                                <Line type="monotone" dataKey="Audio" stroke="#82ca9d" activeDot={{ r: 8 }} />
                                                <Line type="monotone" dataKey="Video" stroke="#ffc658" activeDot={{ r: 8 }} />
                                                <Line type="monotone" dataKey="Average" stroke="#ff8042" strokeWidth={2} activeDot={{ r: 8 }} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                <div className="bg-blue-50 p-6 rounded-lg">
                                    <h3 className="text-xl font-semibold mb-4">Key Insights</h3>
                                    <ul className="list-disc pl-6 space-y-2">
                                        <li>Depression indicators are most prominent across all assessment methods.</li>
                                        <li>Anxiety levels are consistently {getStatusInfo(averageScores.anxiety).text.toLowerCase()} across assessments.</li>
                                        <li>Stress indicators are {getStatusInfo(averageScores.stress).text.toLowerCase()} but show variation between assessment methods.</li>
                                        <li>The video assessment shows higher stress indicators compared to other methods.</li>
                                    </ul>
                                </div>
                            </motion.div>
                        )}

                        {/* Questionnaire Tab */}
                        {activeTab === 'questionnaire' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="p-6" id="questionnaire-section">
                                <h2 className="text-2xl font-bold mb-6">Questionnaire Assessment Results</h2>

                                <div className="flex flex-wrap -mx-2 mb-8">
                                    <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
                                        {renderScoreCard('Depression', standardizedResults.questionnaire.depression)}
                                    </div>
                                    <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
                                        {renderScoreCard('Anxiety', standardizedResults.questionnaire.anxiety)}
                                    </div>
                                    <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
                                        {renderScoreCard('Stress', standardizedResults.questionnaire.stress)}
                                    </div>
                                </div>

                                <div className="h-80 mb-8">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={prepareModelData('questionnaire')}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis
                                                tickFormatter={(value) => `${value}%`}
                                                domain={[0, 100]}
                                                ticks={[0, 20, 40, 60, 80, 100]}
                                            />
                                            <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                                            <Legend />
                                            <Bar dataKey="value" fill="#8884d8" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="bg-purple-50 p-6 rounded-lg">
                                    <h3 className="text-xl font-semibold mb-4">Questionnaire Assessment Insights</h3>
                                    <p className="mb-4">The questionnaire assessment indicates:</p>
                                    <ul className="list-disc pl-6 space-y-2">
                                        <li>Depression indicators are at a {getStatusInfo(standardizedResults.questionnaire.depression).text.toLowerCase()} level.</li>
                                        <li>Anxiety indicators are {getStatusInfo(standardizedResults.questionnaire.anxiety).text.toLowerCase()}.</li>
                                        <li>Stress indicators are {getStatusInfo(standardizedResults.questionnaire.stress).text.toLowerCase()}.</li>
                                    </ul>
                                </div>
                            </motion.div>
                        )}

                        {/* Audio Tab */}
                        {activeTab === 'audio' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="p-6" id="audio-section">
                                <h2 className="text-2xl font-bold mb-6">Audio Assessment Results</h2>

                                <div className="flex flex-wrap -mx-2 mb-8">
                                    <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
                                        {renderScoreCard('Depression', standardizedResults.audio.depression)}
                                    </div>
                                    <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
                                        {renderScoreCard('Anxiety', standardizedResults.audio.anxiety)}
                                    </div>
                                    <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
                                        {renderScoreCard('Stress', standardizedResults.audio.stress)}
                                    </div>
                                </div>

                                <div className="h-80 mb-8">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={prepareModelData('audio')}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis
                                                tickFormatter={(value) => `${value}%`}
                                                domain={[0, 100]}
                                                ticks={[0, 20, 40, 60, 80, 100]}
                                            />
                                            <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                                            <Legend />
                                            <Bar dataKey="value" fill="#82ca9d" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="bg-green-50 p-6 rounded-lg">
                                    <h3 className="text-xl font-semibold mb-4">Audio Assessment Insights</h3>
                                    <p className="mb-4">The audio analysis indicates:</p>
                                    <ul className="list-disc pl-6 space-y-2">
                                        <li>Voice patterns suggest a {getStatusInfo(standardizedResults.audio.depression).text.toLowerCase()} level of depression.</li>
                                        <li>Vocal tone indicates {getStatusInfo(standardizedResults.audio.anxiety).text.toLowerCase()} anxiety markers.</li>
                                        <li>Speech patterns reveal {getStatusInfo(standardizedResults.audio.stress).text.toLowerCase()} stress indicators.</li>
                                    </ul>
                                </div>
                            </motion.div>
                        )}

                        {/* Video Tab */}
                        {activeTab === 'video' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="p-6" id="video-section">
                                <h2 className="text-2xl font-bold mb-6">Video Assessment Results</h2>

                                <div className="flex flex-wrap -mx-2 mb-8">
                                    <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
                                        {renderScoreCard('Depression', standardizedResults.video.depression)}
                                    </div>
                                    <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
                                        {renderScoreCard('Anxiety', standardizedResults.video.anxiety)}
                                    </div>
                                    <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
                                        {renderScoreCard('Stress', standardizedResults.video.stress)}
                                    </div>
                                </div>

                                <div className="h-80 mb-8">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={prepareModelData('video')}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis
                                                tickFormatter={(value) => `${value}%`}
                                                domain={[0, 100]}
                                                ticks={[0, 20, 40, 60, 80, 100]}
                                            />
                                            <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                                            <Legend />
                                            <Bar dataKey="value" fill="#ffc658" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="bg-yellow-50 p-6 rounded-lg">
                                    <h3 className="text-xl font-semibold mb-4">Video Assessment Insights</h3>
                                    <p className="mb-4">The video analysis indicates:</p>
                                    <ul className="list-disc pl-6 space-y-2">
                                        <li>Facial expressions suggest {getStatusInfo(standardizedResults.video.depression).text.toLowerCase()} depressive indicators.</li>
                                        <li>Body language reveals {getStatusInfo(standardizedResults.video.anxiety).text.toLowerCase()} anxiety markers.</li>
                                        <li>Visual cues indicate {getStatusInfo(standardizedResults.video.stress).text.toLowerCase()} stress levels.</li>
                                    </ul>
                                </div>
                            </motion.div>
                        )}
                        <div className="flex justify-center">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="flex justify-center"
                            >
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center bg-pink-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-pink-600 relative overflow-hidden group"
                                    onClick={handleNavigation}
                                >
                                    <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-out bg-white rounded-full opacity-0 group-hover:opacity-10"></span>
                                    <UserCheck size={24} className="mr-2" />
                                    Get Personalized Recommendation
                                </motion.button>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <StressReliefRecommendations/> */}
        </div>
    );
};

export default Cumulative_Report;