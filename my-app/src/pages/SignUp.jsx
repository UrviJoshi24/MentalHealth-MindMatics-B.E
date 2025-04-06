// import React, { useState } from 'react';
// import { FaUser, FaEnvelope, FaLock, FaPhone, FaCalendarAlt, FaUserCircle, FaEye, FaEyeSlash } from 'react-icons/fa';
// import backgroundImage from '../assets/images/MH_1.jpg'; // Adjust the path based on your folder structure
// import api from "../api";
// import { useNavigate } from 'react-router-dom'; // Import useNavigate

// const SignUp = () => {
//   const navigate = useNavigate(); // Initialize useNavigate
//   const [formData, setFormData] = useState({
//     userName: '',
//     age: '',
//     gender: '',
//     email: '',
//     password: '',
//     phoneNumber: '',
//     guardianNumber: '',
//   });

//   const [errors, setErrors] = useState({});
//   const [showPassword, setShowPassword] = useState(false);

//   const validateField = (name, value) => {
//     let errorMsg = '';
//     switch (name) {
//       case 'phoneNumber':
//       case 'guardianNumber':
//         if (value.length !== 10) {  // Check if the number is not exactly 10 digits
//           errorMsg = 'Phone number must be exactly 10 digits.';
//         }
//         break;
//       case 'password':
//         if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/.test(value)) {
//           errorMsg = 'Password must be 8 characters long, include uppercase, lowercase, a digit, and a special character.';
//         }
//         break;
//       case 'age':
//         if (!/^\d{2}$/.test(value)) {
//           errorMsg = 'Age must be exactly 2 digits.';
//         }
//         break;
//       default:
//         break;
//     }
  
//     setErrors({
//       ...errors,
//       [name]: errorMsg,
//     });
//   };
  

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     validateField(name, value);
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Create a payload with the necessary fields
//     const payload = {
//         username: formData.userName,
//         age: formData.age,
//         gender: formData.gender,
//         email: formData.email,
//         password: formData.password,
//         phone_number: formData.phoneNumber,
//         guardian_number: formData.guardianNumber,
//     };

//     try {
//         const response = await api.post('/api/user/register/', payload); 
//         if (response.status === 201){
//           alert('User created successfully');
//           navigate('/login'); // Redirect to the login page
//         }
//     } catch (error) {
//       console.error('Registration failed', error.response ? error.response.data : error.message);
//       alert('Registration failed. Please try again.');
//     }
//   };


//   return (
//     <div
//       className="flex justify-center items-center min-h-screen bg-cover bg-center p-6"
//       style={{
//         backgroundImage: `url(${backgroundImage})`, // Applying the background image
//         fontFamily: "'Poppins', sans-serif", // Ensuring font consistency
//       }}
//     >
//       <div
//         className="bg-white rounded-lg shadow-lg w-full max-w-md px-8 py-10"
//         style={{
//           background: 'rgba(255, 255, 255, 0.2)',  // Semi-transparent white background
//           backdropFilter: 'blur(10px)',  // Blur the background behind the div
//           boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
//           border: '1px solid rgba(255, 255, 255, 0.3)', // Light border for glass effect
//         }}
//       >
//         <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-6">Create Account</h2>
//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Username Field */}
//           <div className="relative">
//             <FaUser className="absolute w-6 h-6 text-gray-500 left-3 top-3" />
//             <input
//               type="text"
//               name="userName"
//               value={formData.userName}
//               onChange={handleChange}
//               className="w-full pl-12 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition"
//               placeholder="Username"
//               required
//             />
//           </div>

//           {/* Age Field */}
//           <div className="relative">
//             <FaCalendarAlt className="absolute w-6 h-6 text-gray-500 left-3 top-3" />
//             <input
//               type="number"
//               name="age"
//               value={formData.age}
//               onChange={handleChange}
//               className={`w-full pl-12 py-3 border ${errors.age ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition`}
//               placeholder="Age"
//               required
//             />
//             {errors.age && <p className="text-red-500 text-lg font-bold">{errors.age}</p>}

//           </div>

//           {/* Gender Field */}
//           <div className="relative">
//             <FaUserCircle className="absolute w-6 h-6 text-gray-500 left-3 top-3" />
//             <select
//               name="gender"
//               value={formData.gender}
//               onChange={handleChange}
//               className="w-full pl-12 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition appearance-none"
//               required
//             >
//               <option value="" disabled>Select Gender</option>
//               <option value="Male">Male</option>
//               <option value="Female">Female</option>
//               <option value="Other">Other</option>
//             </select>
//           </div>

//           {/* Email Field */}
//           <div className="relative">
//             <FaEnvelope className="absolute w-6 h-6 text-gray-500 left-3 top-3" />
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               className="w-full pl-12 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition"
//               placeholder="Email"
//               required
//             />
//           </div>

//           {/* Password Field */}
//           <div className="relative">
//             <FaLock className="absolute w-6 h-6 text-gray-500 left-3 top-3" />
//             <input
//               type={showPassword ? 'text' : 'password'}
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               className={`w-full pl-12 py-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition`}
//               placeholder="Password"
//               required
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-3 top-3"
//             >
//               {showPassword ? (
//                 <FaEye className="w-6 h-6 text-gray-500" />
//               ) : (
//                 <FaEyeSlash className="w-6 h-6 text-gray-500" />
//               )}
//             </button>
//             {errors.password && <p className="text-red-500 text-lg font-bold">{errors.password}</p>}
//           </div>

//           {/* Phone Number Field */}
//           <div className="relative">
//             <FaPhone className="absolute w-6 h-6 text-gray-500 left-3 top-3" />
//             <input
//               type="number"
//               name="phoneNumber"
//               value={formData.phoneNumber}
//               onChange={handleChange}
//               className={`w-full pl-12 py-3 border ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition`}
//               placeholder="Phone Number"
//               required
//             />
//             {errors.phoneNumber && <p className="text-red-500 text-lg font-bold">{errors.phoneNumber}</p>}
//           </div>

//           {/* Guardian Number Field */}
//           <div className="relative">
//             <FaPhone className="absolute w-6 h-6 text-gray-500 left-3 top-3" />
//             <input
//               type="number"
//               name="guardianNumber"
//               value={formData.guardianNumber}
//               onChange={handleChange}
//               className={`w-full pl-12 py-3 border ${errors.guardianNumber ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition`}
//               placeholder="Guardian Phone Number"
//               required
//             />
//             {errors.guardianNumber && <p className="text-red-500 text-lg font-bold">{errors.guardianNumber}</p>}
//           </div>

//           {/* Navigate to Login Button */}
// <div className="flex space-x-10">
//   <button
//     type="button"
//     onClick={() => navigate('/login')}
//     className="text-yellow-500 underline text-sm hover:text-yellow-700 focus:outline-none"
//   >
//     Already have an account? Login
//   </button>
//   <button
//     type="button"
//     onClick={() => navigate('/')}
//     className="text-yellow-500 underline text-sm hover:text-yellow-700 focus:outline-none"
//   >
//     Back To Landing
//   </button>
// </div>

//           {/* Sign Up Button */}
//           <button
//             type="submit"
//             className="w-full py-3 text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition"
//           >
//             Sign Up
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default SignUp;


import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaCalendarAlt, FaUserCircle, FaEye, FaEyeSlash } from 'react-icons/fa';
import { motion } from 'framer-motion';
import backgroundImage from '../assets/images/MH_1.jpg';
import api from "../api";
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: '',
    age: '',
    gender: '',
    email: '',
    password: '',
    phoneNumber: '',
    guardianNumber: '',
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Animation states
  const [activeField, setActiveField] = useState(null);

  const validateField = (name, value) => {
    let errorMsg = '';
    switch (name) {
      case 'phoneNumber':
      case 'guardianNumber':
        if (value.length !== 10) {
          errorMsg = 'Phone number must be exactly 10 digits.';
        }
        break;
      case 'password':
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/.test(value)) {
          errorMsg = 'Password must be 8 characters long, include uppercase, lowercase, a digit, and a special character.';
        }
        break;
      case 'age':
        if (!/^\d{2}$/.test(value)) {
          errorMsg = 'Age must be exactly 2 digits.';
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
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Create a payload with the necessary fields
    const payload = {
        username: formData.userName,
        age: formData.age,
        gender: formData.gender,
        email: formData.email,
        password: formData.password,
        phone_number: formData.phoneNumber,
        guardian_number: formData.guardianNumber,
    };

    try {
        const response = await api.post('/api/user/register/', payload); 
        if (response.status === 201){
          setIsSubmitting(false);
          
          // Success animation before redirect
          const successMessage = document.getElementById('successMessage');
          successMessage.classList.remove('hidden');
          
          setTimeout(() => {
            navigate('/login'); // Redirect to the login page after success animation
          }, 1500);
        }
    } catch (error) {
      setIsSubmitting(false);
      console.error('Registration failed', error.response ? error.response.data : error.message);
      alert('Registration failed. Please try again.');
    }
  };

  // Field focus/blur handlers for animations
  const handleFocus = (fieldName) => {
    setActiveField(fieldName);
  };

  const handleBlur = () => {
    setActiveField(null);
  };

  // Staggered animation for form fields
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3
      } 
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 100 
      }
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-cover bg-center p-6 overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 z-0">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute bg-white rounded-full opacity-20"
            style={{
              width: `${Math.random() * 30 + 5}px`,
              height: `${Math.random() * 30 + 5}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-md px-8 py-10"
        style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 8px 32px rgba(31, 38, 135, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
        }}
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8 relative">
            Create Account
            <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-indigo-500 rounded-full"></span>
          </h2>
        </motion.div>

        <motion.form 
          onSubmit={handleSubmit} 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Username Field */}
          <motion.div variants={itemVariants} className="relative">
            <div className={`absolute left-3 top-3 transition-all duration-300 ${activeField === 'userName' ? 'text-indigo-600 scale-110' : 'text-gray-500'}`}>
              <FaUser className="w-6 h-6" />
            </div>
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              onFocus={() => handleFocus('userName')}
              onBlur={handleBlur}
              className={`w-full pl-12 py-3 border-2 ${activeField === 'userName' ? 'border-indigo-500' : 'border-gray-300'} rounded-lg focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition-all duration-300 bg-opacity-80 bg-white`}
              placeholder="Username"
              required
            />
            <div className={`absolute bottom-0 left-0 h-0.5 bg-indigo-600 transition-all duration-500 ${activeField === 'userName' ? 'w-full' : 'w-0'}`}></div>
          </motion.div>

          {/* Age Field */}
          <motion.div variants={itemVariants} className="relative">
            <div className={`absolute left-3 top-3 transition-all duration-300 ${activeField === 'age' ? 'text-indigo-600 scale-110' : 'text-gray-500'}`}>
              <FaCalendarAlt className="w-6 h-6" />
            </div>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              onFocus={() => handleFocus('age')}
              onBlur={handleBlur}
              className={`w-full pl-12 py-3 border-2 ${errors.age ? 'border-red-500' : activeField === 'age' ? 'border-indigo-500' : 'border-gray-300'} rounded-lg focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition-all duration-300 bg-opacity-80 bg-white`}
              placeholder="Age"
              required
            />
            <div className={`absolute bottom-0 left-0 h-0.5 bg-indigo-600 transition-all duration-500 ${activeField === 'age' ? 'w-full' : 'w-0'}`}></div>
            {errors.age && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm font-bold mt-1"
              >
                {errors.age}
              </motion.p>
            )}
          </motion.div>

          {/* Gender Field */}
          <motion.div variants={itemVariants} className="relative">
            <div className={`absolute left-3 top-3 transition-all duration-300 ${activeField === 'gender' ? 'text-indigo-600 scale-110' : 'text-gray-500'}`}>
              <FaUserCircle className="w-6 h-6" />
            </div>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              onFocus={() => handleFocus('gender')}
              onBlur={handleBlur}
              className={`w-full pl-12 py-3 border-2 ${activeField === 'gender' ? 'border-indigo-500' : 'border-gray-300'} rounded-lg focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition-all duration-300 appearance-none bg-opacity-80 bg-white`}
              required
            >
              <option value="" disabled>Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <div className={`absolute bottom-0 left-0 h-0.5 bg-indigo-600 transition-all duration-500 ${activeField === 'gender' ? 'w-full' : 'w-0'}`}></div>
            <div className="absolute right-4 top-4 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </motion.div>

          {/* Email Field */}
          <motion.div variants={itemVariants} className="relative">
            <div className={`absolute left-3 top-3 transition-all duration-300 ${activeField === 'email' ? 'text-indigo-600 scale-110' : 'text-gray-500'}`}>
              <FaEnvelope className="w-6 h-6" />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onFocus={() => handleFocus('email')}
              onBlur={handleBlur}
              className={`w-full pl-12 py-3 border-2 ${activeField === 'email' ? 'border-indigo-500' : 'border-gray-300'} rounded-lg focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition-all duration-300 bg-opacity-80 bg-white`}
              placeholder="Email"
              required
            />
            <div className={`absolute bottom-0 left-0 h-0.5 bg-indigo-600 transition-all duration-500 ${activeField === 'email' ? 'w-full' : 'w-0'}`}></div>
          </motion.div>

          {/* Password Field */}
          <motion.div variants={itemVariants} className="relative">
            <div className={`absolute left-3 top-3 transition-all duration-300 ${activeField === 'password' ? 'text-indigo-600 scale-110' : 'text-gray-500'}`}>
              <FaLock className="w-6 h-6" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              onFocus={() => handleFocus('password')}
              onBlur={handleBlur}
              className={`w-full pl-12 py-3 border-2 ${errors.password ? 'border-red-500' : activeField === 'password' ? 'border-indigo-500' : 'border-gray-300'} rounded-lg focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition-all duration-300 bg-opacity-80 bg-white`}
              placeholder="Password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute right-3 top-3 transition-all duration-300 ${activeField === 'password' ? 'text-indigo-600' : 'text-gray-500'}`}
            >
              {showPassword ? (
                <FaEye className="w-6 h-6" />
              ) : (
                <FaEyeSlash className="w-6 h-6" />
              )}
            </button>
            <div className={`absolute bottom-0 left-0 h-0.5 bg-indigo-600 transition-all duration-500 ${activeField === 'password' ? 'w-full' : 'w-0'}`}></div>
            {errors.password && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm font-bold mt-1"
              >
                {errors.password}
              </motion.p>
            )}
          </motion.div>

          {/* Phone Number Field */}
          <motion.div variants={itemVariants} className="relative">
            <div className={`absolute left-3 top-3 transition-all duration-300 ${activeField === 'phoneNumber' ? 'text-indigo-600 scale-110' : 'text-gray-500'}`}>
              <FaPhone className="w-6 h-6" />
            </div>
            <input
              type="number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              onFocus={() => handleFocus('phoneNumber')}
              onBlur={handleBlur}
              className={`w-full pl-12 py-3 border-2 ${errors.phoneNumber ? 'border-red-500' : activeField === 'phoneNumber' ? 'border-indigo-500' : 'border-gray-300'} rounded-lg focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition-all duration-300 bg-opacity-80 bg-white`}
              placeholder="Phone Number"
              required
            />
            <div className={`absolute bottom-0 left-0 h-0.5 bg-indigo-600 transition-all duration-500 ${activeField === 'phoneNumber' ? 'w-full' : 'w-0'}`}></div>
            {errors.phoneNumber && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm font-bold mt-1"
              >
                {errors.phoneNumber}
              </motion.p>
            )}
          </motion.div>

          {/* Guardian Number Field */}
          <motion.div variants={itemVariants} className="relative">
            <div className={`absolute left-3 top-3 transition-all duration-300 ${activeField === 'guardianNumber' ? 'text-indigo-600 scale-110' : 'text-gray-500'}`}>
              <FaPhone className="w-6 h-6" />
            </div>
            <input
              type="number"
              name="guardianNumber"
              value={formData.guardianNumber}
              onChange={handleChange}
              onFocus={() => handleFocus('guardianNumber')}
              onBlur={handleBlur}
              className={`w-full pl-12 py-3 border-2 ${errors.guardianNumber ? 'border-red-500' : activeField === 'guardianNumber' ? 'border-indigo-500' : 'border-gray-300'} rounded-lg focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition-all duration-300 bg-opacity-80 bg-white`}
              placeholder="Guardian Phone Number"
              required
            />
            <div className={`absolute bottom-0 left-0 h-0.5 bg-indigo-600 transition-all duration-500 ${activeField === 'guardianNumber' ? 'w-full' : 'w-0'}`}></div>
            {errors.guardianNumber && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm font-bold mt-1"
              >
                {errors.guardianNumber}
              </motion.p>
            )}
          </motion.div>

          {/* Navigation Links */}
          <motion.div 
            variants={itemVariants}
            className="flex space-x-10 justify-between"
          >
            <motion.button
              whileHover={{ scale: 1.05, color: "#b45309" }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => navigate('/login')}
              className="text-yellow-500 font-medium text-sm hover:text-yellow-700 focus:outline-none transition-all duration-300 flex items-center"
            >
              <span>Already have an account?</span>
              <span className="ml-1 font-bold underline">Login</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05, color: "#b45309" }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => navigate('/')}
              className="text-yellow-500 font-medium text-sm hover:text-yellow-700 focus:outline-none transition-all duration-300 flex items-center"
            >
              <span>Back To</span>
              <span className="ml-1 font-bold underline">Landing</span>
            </motion.button>
          </motion.div>

          {/* Sign Up Button */}
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02, boxShadow: "0 5px 15px rgba(79, 70, 229, 0.4)" }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all duration-300 relative overflow-hidden group"
          >
            <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
            <span className="relative flex items-center justify-center">
              {isSubmitting ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              Sign Up
            </span>
          </motion.button>
        </motion.form>

        {/* Success message - hidden by default */}
        <div id="successMessage" className="hidden fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg p-6 flex flex-col items-center"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Success!</h3>
            <p className="text-gray-600">Account created successfully</p>
          </motion.div>
        </div>
      </motion.div>

      {/* Add global styles for animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(0) translateX(20px);
          }
          75% {
            transform: translateY(20px) translateX(10px);
          }
        }
        
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
};

export default SignUp;