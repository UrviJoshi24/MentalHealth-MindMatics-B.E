import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";

 // Add this loading animation component
 const Loading = () => {
    // Total loading time in seconds
    const totalLoadingTime = 60; // 1 minute
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black backdrop-blur-sm">
        <div className="bg-black bg-opacity-60 p-8 rounded-3xl shadow-2xl border border-purple-500 border-opacity-30 max-w-lg w-full">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold mb-4 text-white">Analyzing Your Responses</h2>
              <p className="text-lg text-purple-200 mb-8">Please wait while our AI processes your audio responses...</p>
            </motion.div>
            
            {/* Enhanced brain wave animation */}
            <motion.div className="mb-8 relative h-36">
              <svg width="100%" height="100%" viewBox="0 0 400 120">
                {/* Multiple wave layers with different speeds */}
                <motion.path
                  d="M0,60 C50,40 100,80 150,60 C200,40 250,80 300,60 C350,40 400,80 450,60"
                  fill="none"
                  stroke="url(#gradient1)"
                  strokeWidth="3"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ 
                    pathLength: 1, 
                    opacity: 1,
                    d: [
                      "M0,60 C50,40 100,80 150,60 C200,40 250,80 300,60 C350,40 400,80 450,60",
                      "M0,60 C50,80 100,40 150,60 C200,80 250,40 300,60 C350,80 400,40 450,60",
                      "M0,60 C50,40 100,80 150,60 C200,40 250,80 300,60 C350,40 400,80 450,60"
                    ]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
                <motion.path
                  d="M0,60 C50,30 100,90 150,60 C200,30 250,90 300,60 C350,30 400,90 450,60"
                  fill="none"
                  stroke="url(#gradient2)"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ 
                    pathLength: 1, 
                    opacity: 0.7,
                    d: [
                      "M0,60 C50,30 100,90 150,60 C200,30 250,90 300,60 C350,30 400,90 450,60",
                      "M0,60 C50,90 100,30 150,60 C200,90 250,30 300,60 C350,90 400,30 450,60",
                      "M0,60 C50,30 100,90 150,60 C200,30 250,90 300,60 C350,30 400,90 450,60"
                    ]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: 0.5
                  }}
                />
                <motion.path
                  d="M0,60 C30,45 60,75 90,60 C120,45 150,75 180,60 C210,45 240,75 270,60 C300,45 330,75 360,60 C390,45 420,75 450,60"
                  fill="none"
                  stroke="url(#gradient3)"
                  strokeWidth="1.5"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ 
                    pathLength: 1, 
                    opacity: 0.5,
                    d: [
                      "M0,60 C30,45 60,75 90,60 C120,45 150,75 180,60 C210,45 240,75 270,60 C300,45 330,75 360,60 C390,45 420,75 450,60",
                      "M0,60 C30,75 60,45 90,60 C120,75 150,45 180,60 C210,75 240,45 270,60 C300,75 330,45 360,60 C390,75 420,45 450,60",
                      "M0,60 C30,45 60,75 90,60 C120,45 150,75 180,60 C210,45 240,75 270,60 C300,45 330,75 360,60 C390,45 420,75 450,60"
                    ]
                  }}
                  transition={{ 
                    duration: 5, 
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: 1
                  }}
                />
                <defs>
                  <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="50%" stopColor="#6366F1" />
                    <stop offset="100%" stopColor="#EC4899" />
                  </linearGradient>
                  <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6366F1" />
                    <stop offset="50%" stopColor="#EC4899" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                  <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#EC4899" />
                    <stop offset="50%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#6366F1" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Enhanced floating particles - more particles with varied effects */}
              {[...Array(24)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{ 
                    width: Math.random() * 12 + 3,
                    height: Math.random() * 12 + 3,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    opacity: 0.7,
                    background: i % 3 === 0 ? 'rgba(139, 92, 246, 0.8)' : 
                               i % 3 === 1 ? 'rgba(99, 102, 241, 0.8)' : 
                               'rgba(236, 72, 153, 0.8)',
                    boxShadow: i % 3 === 0 ? '0 0 12px rgba(139, 92, 246, 0.7)' : 
                               i % 3 === 1 ? '0 0 12px rgba(99, 102, 241, 0.7)' : 
                               '0 0 12px rgba(236, 72, 153, 0.7)'
                  }}
                  animate={{
                    y: [0, -Math.random() * 60 - 10, 0],
                    x: [0, Math.random() * 50 - 25, 0],
                    scale: [1, Math.random() * 0.5 + 0.8, 1],
                    opacity: [0.4, 0.8, 0.4]
                  }}
                  transition={{
                    duration: 3 + Math.random() * 4,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: Math.random() * 3
                  }}
                />
              ))}
              
              {/* Pulsing central orb */}
              <motion.div 
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-purple-600 to-pink-500"
                style={{ width: 20, height: 20 }}
                animate={{
                  scale: [1, 1.5, 1],
                  boxShadow: [
                    '0 0 20px rgba(139, 92, 246, 0.5)',
                    '0 0 40px rgba(139, 92, 246, 0.8)',
                    '0 0 20px rgba(139, 92, 246, 0.5)'
                  ]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
            </motion.div>
            
            {/* Enhanced processing steps with typing effect */}
            <div className="space-y-4 text-left">
              {[
                { text: "Processing video responses", delay: 0, duration: 60 },
                { text: "Analyzing Expresion patterns and Pixels", delay: 60, duration: 60 },
                { text: "Identifying emotional markers and sentiment", delay: 120, duration: 60 },
                { text: "Generating comprehensive mental health insights", delay: 180, duration: 60 }
              ].map((step, index) => (
                <motion.div 
                  key={index}
                  className="flex items-center text-white"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: step.delay / totalLoadingTime * 8, duration: 0.8 }}
                >
                  <motion.div 
                    className="w-6 h-6 rounded-full border-2 border-purple-400 mr-3 flex items-center justify-center"
                    animate={{ 
                      borderColor: ['rgba(139, 92, 246, 0.7)', 'rgba(236, 72, 153, 1)', 'rgba(139, 92, 246, 0.7)'],
                      boxShadow: [
                        '0 0 0px rgba(139, 92, 246, 0)',
                        '0 0 10px rgba(139, 92, 246, 0.8)',
                        '0 0 0px rgba(139, 92, 246, 0)'
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <motion.div 
                      className="w-3 h-3 bg-purple-400 rounded-full"
                      animate={{ 
                        scale: [1, 1.5, 1],
                        backgroundColor: ['rgb(139, 92, 246)', 'rgb(236, 72, 153)', 'rgb(139, 92, 246)']
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.div>
                  <span>{step.text}</span>
                  <motion.div
                    className="ml-3"
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    ...
                  </motion.div>
                  {/* Progress indicator for each step */}
                  <motion.div
                    className="ml-auto h-1 bg-purple-500 rounded-full"
                    style={{ width: 50 }}
                    initial={{ scaleX: 0, originX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ 
                      duration: step.duration / totalLoadingTime * 8,
                      delay: step.delay / totalLoadingTime * 8,
                      ease: "linear"
                    }}
                  />
                </motion.div>
              ))}
            </div>
            
            {/* One minute progress bar (60 seconds) */}
            <div className="mt-8 bg-gray-800 h-3 rounded-full overflow-hidden border border-purple-900">
              <motion.div 
                className="h-full bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500 relative"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: totalLoadingTime, ease: "linear" }}
              >
                {/* Glow effect on progress bar */}
                <motion.div 
                  className="absolute top-0 bottom-0 right-0 w-8 bg-white" 
                  animate={{ opacity: [0, 0.5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  style={{ filter: 'blur(10px)' }}
                />
              </motion.div>
            </div>
            
            {/* Time estimate message */}
            <div className="flex justify-between text-xs text-gray-400 mt-2 px-1">
              <span>0:00</span>
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
              >
                Estimated time: ~1:00
              </motion.span>
              <span>1:00</span>
            </div>
            
            <motion.p 
              className="text-sm text-gray-300 mt-6"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Creating your personalized mental health insights...
            </motion.p>
            
            {/* Pulse effect at bottom */}
            <motion.div 
              className="mx-auto mt-4 w-2 h-2 rounded-full bg-purple-500"
              animate={{ 
                scale: [1, 3, 1],
                opacity: [0.7, 0, 0.7],
                boxShadow: ['0 0 0px rgba(139, 92, 246, 0.5)', '0 0 20px rgba(139, 92, 246, 0.8)', '0 0 0px rgba(139, 92, 246, 0.5)']
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </div>
      </div>
    );
  };
  export default Loading;