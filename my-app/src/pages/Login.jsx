import React, { useState, useEffect } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaHeart, FaBrain, FaLeaf } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/images/MH_1.jpg'; // Keeping your original background image
import api from "../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";
import { motion, AnimatePresence } from "framer-motion";

const Login = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [breathingAnimation, setBreathingAnimation] = useState(true);

  // Breathing circles animation
  const [circlePositions] = useState(Array.from({ length: 10 }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 30 + 10,
    delay: Math.random() * 2,
  })));

  const handleChange = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateField = (name, value) => {
    let errorMsg = '';
    switch (name) {
      case 'password':
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/.test(value)) {
          errorMsg = 'Password must be 8 characters long, include uppercase, lowercase, a digit, and a special character.';
        }
        break;
      default:
        break;
    }

    setErrors({
      ...errors,
      [name]: errorMsg,
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setBreathingAnimation(false);

    // Create a payload with the necessary fields
    const payload = {
      email: formData.email,
      password: formData.password,
    };

    try {
      const response = await api.post('/api/token/', payload);
      if (response.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, response.data.access);
        localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
        
        // Show success animation before redirecting
        setTimeout(() => {
          navigate('/home');
        }, 500);
      }
    } catch (error) {
      console.error('login failed', error.response ? error.response.data : error.message);
      setIsLoading(false);
      setBreathingAnimation(true);
      
      // Error animation
      const formElement = document.querySelector('form');
      formElement.classList.add('shake-animation');
      setTimeout(() => {
        formElement.classList.remove('shake-animation');
      }, 500);
    }
  };

  // Wellness tips to display in rotation
  const wellnessTips = [
    "Take a deep breath. You're doing great!",
    "Remember to pause and check in with yourself today.",
    "A moment of mindfulness can brighten your day.",
    "Your mental health matters. Be kind to yourself.",
    "Small steps lead to big changes in mental wellness."
  ];
  
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % wellnessTips.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="min-h-screen flex items-center justify-center overflow-hidden relative"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* Semi-transparent overlay to improve readability while keeping image visible */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-purple-900/30 z-0"></div>
      
      {/* Breathing animation circles */}
      {breathingAnimation && circlePositions.map((circle, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full bg-white z-10"
          style={{
            left: `${circle.x}%`,
            top: `${circle.y}%`,
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: circle.delay,
            ease: "easeInOut"
          }}
          initial={{
            width: circle.size,
            height: circle.size,
          }}
        />
      ))}

      {/* Floating Icons */}
      <motion.div
        className="absolute text-blue-300 z-10"
        animate={{
          y: [0, -10, 0],
          x: [0, 5, 0],
          rotate: [0, 5, 0]
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ top: '15%', left: '15%' }}
      >
        <FaBrain size={40} />
      </motion.div>

      <motion.div
        className="absolute text-green-300 z-10"
        animate={{
          y: [0, 10, 0],
          x: [0, -5, 0],
          rotate: [0, -5, 0]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ top: '25%', right: '15%' }}
      >
        <FaLeaf size={40} />
      </motion.div>

      <motion.div
        className="absolute text-red-300 z-10"
        animate={{
          y: [0, -8, 0],
          x: [0, -8, 0],
          rotate: [0, 10, 0]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ bottom: '20%', left: '20%' }}
      >
        <FaHeart size={40} />
      </motion.div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="p-8 rounded-xl shadow-2xl max-w-md w-full z-20 backdrop-blur-lg relative"
        style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(12px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.5)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.5)',
          borderRight: '1px solid rgba(255, 255, 255, 0.2)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        {/* Wellness Tip Banner */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTipIndex}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="bg-white/30 backdrop-blur-sm text-white p-3 rounded-lg mb-6 text-center text-sm italic border border-white/20"
          >
            {wellnessTips[currentTipIndex]}
          </motion.div>
        </AnimatePresence>

        <motion.h2 
          className="text-3xl font-bold text-center text-white mb-6"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          Welcome Back
        </motion.h2>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Email Field */}
          <motion.div 
            className="relative"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="absolute left-3 top-3 p-1 bg-white/90 rounded-full shadow-md z-10">
              <FaEnvelope className="w-5 h-5 text-indigo-600" />
            </div>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-14 py-4 border-none rounded-xl focus:ring-4 focus:ring-indigo-300 transition-all bg-white/20 backdrop-blur-md shadow-inner text-white placeholder-white/70"
              placeholder="Enter your email"
              required
            />
          </motion.div>

          {/* Password Field */}
          <motion.div 
            className="relative"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="absolute left-3 top-3 p-1 bg-white/90 rounded-full shadow-md z-10">
              <FaLock className="w-5 h-5 text-indigo-600" />
            </div>
            <input
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              type={showPassword ? "text" : "password"}
              className="w-full pl-14 py-4 border-none rounded-xl focus:ring-4 focus:ring-indigo-300 transition-all bg-white/20 backdrop-blur-md shadow-inner text-white placeholder-white/70"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              className="absolute right-4 top-4 p-1 hover:bg-white/30 rounded-full transition-all"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <FaEye className="w-5 h-5 text-white" />
              ) : (
                <FaEyeSlash className="w-5 h-5 text-white" />
              )}
            </button>
          </motion.div>

          {errors.password && (
            <motion.p 
              className="text-yellow-300 text-sm mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {errors.password}
            </motion.p>
          )}

          {/* Links */}
          <motion.div 
            className="flex flex-wrap justify-between text-sm gap-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Link
              to="/forgotpassword"
              className="text-yellow-300 hover:text-yellow-100 transition-colors hover:underline focus:outline-none"
            >
              Forgot Password?
            </Link>
            <Link 
              to="/signup" 
              className="text-yellow-300 hover:text-yellow-100 transition-colors hover:underline focus:outline-none"
            >
              Create account
            </Link>
            <Link 
              to="/" 
              className="text-yellow-300 hover:text-yellow-100 transition-colors hover:underline focus:outline-none"
            >
              Back to Home
            </Link>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.03, boxShadow: "0 0 15px rgba(129, 140, 248, 0.5)" }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-4 rounded-xl font-bold text-white transition-all duration-300 relative overflow-hidden ${isLoading ? 'bg-indigo-500/70' : 'bg-indigo-600/80 hover:bg-indigo-700/90'}`}
            disabled={isLoading}
          >
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center"
                >
                  <div className="h-5 w-5 border-t-2 border-r-2 border-white rounded-full animate-spin mr-2"></div>
                  <span>Signing in...</span>
                </motion.div>
              ) : (
                <motion.span
                  key="login"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  Login
                </motion.span>
              )}
            </AnimatePresence>
            
            {/* Button animation glow effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0"
              animate={{
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "mirror",
              }}
            />
          </motion.button>
        </form>
      </motion.div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .shake-animation {
          animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }
        
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-text-fill-color: white;
          -webkit-box-shadow: 0 0 0px 1000px rgba(255, 255, 255, 0.1) inset;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>
    </div>
  );
};

export default Login;