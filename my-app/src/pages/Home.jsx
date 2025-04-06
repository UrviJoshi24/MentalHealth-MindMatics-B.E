import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserDetails } from '../api';
import { Link as ScrollLink } from 'react-scroll';
import { Link as RouterLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { User, Mail, Gift, Calendar, Award } from 'lucide-react';


// Import images
import textimage from "../assets/images/textimageee.jpg";
import audioimage from "../assets/images/audioimageee.jpg";
import videoimage from "../assets/images/videoimage.jpg";
import diaryimage from "../assets/images/diaryimage.jpg";
import bgimage from "../assets/images/bgimg.jpg";
import bg from "../assets/images/bg.jpg";
import bg_home from "../assets/images/bg_home.jpg"


const Home = () => {
    const [clickedCardIndex, setClickedCardIndex] = useState(null);
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [scrollY, setScrollY] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('hero');
    const [isLoading, setIsLoading] = useState(true);
    const [isHovering, setIsHovering] = useState(false);


    // Mouse position for interactive elements
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const parallaxRef = useRef(null);
    console.log(user);

    // Refs for sections to track active section
    const sectionRefs = {
        hero: useRef(null),
        services: useRef(null),
        features: useRef(null),
        blogs: useRef(null),
        aboutUs: useRef(null)
    };

    // Intersection observer hooks for animations
    const [servicesRef, servicesInView] = useInView({ threshold: 0.2, triggerOnce: false });
    const [featuresRef, featuresInView] = useInView({ threshold: 0.2, triggerOnce: false });
    const [blogsRef, blogsInView] = useInView({ threshold: 0.2, triggerOnce: false });
    const [aboutRef, aboutInView] = useInView({ threshold: 0.2, triggerOnce: false });
    const [teamRef, teamInView] = useInView({ threshold: 0.2, triggerOnce: false });

    useEffect(() => {
        // Simulating loading screen
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 400);

        // Fetch user details
        const getUserDetails = async () => {
            try {
                const userDetails = await fetchUserDetails();
                setUser(userDetails);
            } catch (error) {
                console.error("Failed to fetch user details", error);
            }
        };

        getUserDetails();

        // Scroll event listener
        const handleScroll = () => {
            setScrollY(window.scrollY);

            // Determine active section
            const sections = ['hero', 'services', 'features', 'blogs', 'aboutUs'];
            const currentSection = sections.find(section => {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    return rect.top <= 100 && rect.bottom >= 100;
                }
                return false;
            });

            if (currentSection) {
                setActiveSection(currentSection);
            }
        };

        // Mouse move event for parallax effect
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    const cards = [
        {
            title: 'Learn about your mental health through Questionnaire',
            background: textimage,
            route: '/questionnaire',
            icon: '📋',
            description: 'Answer a series of questions to get insights about your mental health patterns.'
        },
        {
            title: 'Explore your mental health with Audio testing',
            background: audioimage,
            route: '/audio-testing',
            icon: '🎙️',
            description: 'Just speak naturally and let our AI analyze your voice patterns.'
        },
        {
            title: 'Use VIDEO TESTING for better insights',
            background: videoimage,
            route: '/video-based-detection',
            icon: '🎥',
            description: 'Record a short video for our AI to analyze your expressions and emotions.'
        },
        {
            title: 'Mindful Moments: Your Personal Diary',
            background: diaryimage,
            route: '/diary/folders',
            icon: '📓',
            description: 'Keep track of your thoughts and emotions day by day.'
        },
    ];

    const handleClick = (index, route) => {
        setClickedCardIndex(index);
        setTimeout(() => {
            navigate(`${route}?email=${encodeURIComponent(user.email)}`);
        }, 800);
    };

    // Parallax effect calculation
    const calculateParallaxTransform = (depth = 0.1) => {
        if (!parallaxRef.current) return { x: 0, y: 0 };
        const rect = parallaxRef.current.getBoundingClientRect();
        const x = (mousePosition.x - (rect.left + rect.width / 2)) * depth;
        const y = (mousePosition.y - (rect.top + rect.height / 2)) * depth;
        return { x, y };
    };

    // Loading screen animation
    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-black flex flex-col items-center justify-center" style={{ backgroundImage: `url(${bg})` }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-6xl font-extrabold text-white mb-8"
                >
                    Mind Matrics
                </motion.div>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '60%' }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="h-2 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 rounded-full"
                />
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-white mt-4"
                >
                    Unlocking your mental well-being...
                </motion.p>
            </div>
        );
    }
    const getInitials = (name) => {
        return name
            ? name
                .split(' ')
                .map(part => part[0])
                .join('')
                .toUpperCase()
            : 'U';
    };

    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Animated background */}
            <div
                className="fixed inset-0 bg-cover bg-center bg-fixed"
                style={{ backgroundImage: `url(${bg_home})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-50"></div>

                {/* Floating particles */}
                {Array(20).fill().map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-white opacity-80"
                        style={{
                            width: Math.random() * 10 + 2,
                            height: Math.random() * 10 + 2,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            opacity: [0.1, 0.5, 0.1],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 5,
                            repeat: Infinity,
                            repeatType: 'loop',
                            ease: 'easeInOut',
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
            </div>

            {/* Navbar */}
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className={`fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm ${scrollY > 50 ? 'shadow-lg' : ''}`}
            >
                <div className="container mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        {/* Logo */}
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center"
                        >
                            <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
                                Mind Matrics
                            </span>
                        </motion.div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center space-x-8">
                            {['hero', 'services', 'features', 'blogs', 'aboutUs'].map((section, index) => (
                                <ScrollLink
                                    key={section}
                                    to={section}
                                    smooth={true}
                                    duration={500}
                                    offset={-70}
                                    className={`relative text-white cursor-pointer transition-colors duration-300 ${activeSection === section ? 'text-blue-400' : 'hover:text-blue-300'}`}
                                >
                                    <span>{section === 'hero' ? 'Home' : section === 'aboutUs' ? 'About Us' : section.charAt(0).toUpperCase() + section.slice(1)}</span>
                                    {activeSection === section && (
                                        <motion.div
                                            layoutId="underline"
                                            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-400"
                                        />
                                    )}
                                </ScrollLink>
                            ))}
                            <RouterLink to={`/result?email=${encodeURIComponent(user.email)}`}>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-md shadow-lg hover:shadow-xl transition duration-300"
                                >
                                    My Results
                                </motion.button>
                            </RouterLink>
                            <RouterLink to="/logout">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-md shadow-lg hover:shadow-xl transition duration-300"
                                >
                                    Log Out
                                </motion.button>
                            </RouterLink>
                            <div className="relative">
                                <div className="relative font-sans">
                                    <motion.div
                                        className="relative w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-white cursor-pointer shadow-md"
                                        whileHover={{
                                            scale: 1.1,
                                            boxShadow: "0 8px 20px rgba(59, 130, 246, 0.3)",
                                        }}
                                        whileTap={{ scale: 0.95 }}
                                        onMouseEnter={() => setIsHovering(true)}
                                        onMouseLeave={() => setIsHovering(false)}
                                    >
                                        <motion.div
                                            className="absolute inset-0 rounded-full bg-white opacity-10"
                                            initial={{ scale: 0 }}
                                            animate={{
                                                scale: [0, 1.5, 1],
                                                opacity: [0, 0.2, 0]
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                repeatType: 'loop',
                                                ease: "easeInOut"
                                            }}
                                        />
                                        <span className="text-lg font-semibold">{getInitials(user.username)}</span>
                                    </motion.div>
                                    <AnimatePresence>
                                        {isHovering && (
                                            <motion.div
                                                className="absolute right-0 mt-4 w-64 bg-white rounded-xl overflow-hidden shadow-2xl z-20 border border-blue-100"
                                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                                transition={{ duration: 0.2, ease: "easeOut" }}
                                            >
                                                <div className="h-20 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                                                <div className="px-4 py-5 -mt-10 relative">
                                                    <motion.div
                                                        className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-4 border-white flex items-center justify-center text-white shadow-lg"
                                                        initial={{ y: 20, opacity: 0 }}
                                                        animate={{ y: 0, opacity: 1 }}
                                                        transition={{ delay: 0.1 }}
                                                    >
                                                        <span className="text-2xl font-bold">{getInitials(user.username)}</span>
                                                    </motion.div>
                                                    <motion.div
                                                        className="text-center mt-3"
                                                        initial={{ y: 20, opacity: 0 }}
                                                        animate={{ y: 0, opacity: 1 }}
                                                        transition={{ delay: 0.2 }}
                                                    >
                                                        <h3 className="text-xl font-bold text-gray-800">{user.username}</h3>
                                                    </motion.div>
                                                    <motion.div
                                                        className="mt-4 space-y-3"
                                                        initial={{ y: 20, opacity: 0 }}
                                                        animate={{ y: 0, opacity: 1 }}
                                                        transition={{ delay: 0.3 }}
                                                    >
                                                        <div className="flex items-center text-gray-600">
                                                            <Mail size={16} className="text-blue-500 mr-3" />
                                                            <span className="text-sm">{user.email}</span>
                                                        </div>
                                                    </motion.div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="text-white focus:outline-none"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    {isMenuOpen ? (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    ) : (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="md:hidden bg-black bg-opacity-90 backdrop-blur-sm"
                        >
                            <div className="container mx-auto px-4 py-4">
                                <div className="flex flex-col space-y-4">
                                    {['hero', 'services', 'features', 'blogs', 'aboutUs'].map((section) => (
                                        <ScrollLink
                                            key={section}
                                            to={section}
                                            smooth={true}
                                            duration={500}
                                            offset={-70}
                                            className="text-white py-2 hover:text-blue-300 transition-colors duration-300"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            {section === 'hero' ? 'Home' : section === 'aboutUs' ? 'About Us' : section.charAt(0).toUpperCase() + section.slice(1)}
                                        </ScrollLink>
                                    ))}
                                    <RouterLink to="/logout" onClick={() => setIsMenuOpen(false)}>
                                        <div className="py-2 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-md text-center">
                                            Log Out
                                        </div>
                                    </RouterLink>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>
            <br />

            {/* Hero Section */}
            <section id="hero" ref={sectionRefs.hero} className="min-h-screen relative flex items-center justify-center pt-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <motion.h1
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="text-5xl md:text-7xl font-extrabold text-white mb-4"
                        >
                            Discover Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">Mental Wellness</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="text-xl text-gray-300 max-w-3xl mx-auto mb-8"
                        >
                            Unlock insights into your mental health through our innovative AI-powered tools.
                        </motion.p>
                    </div>

                    <div ref={parallaxRef} className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                        {cards.map((card, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 * index + 0.8 }}
                                whileHover={{
                                    scale: 1.02,
                                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                                }}
                                className="relative overflow-hidden rounded-xl cursor-pointer h-80 md:h-90 flex items-end"
                                onClick={() => handleClick(index, card.route)}
                                style={{
                                    transition: "transform 0.3s ease, opacity 0.8s ease",
                                }}
                            >
                                {/* Card Background */}
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out transform hover:scale-110"
                                    style={{
                                        backgroundImage: `url(${card.background})`,
                                        backgroundPosition: clickedCardIndex === index ? 'left' : 'center',
                                        opacity: clickedCardIndex === index ? 0 : 1,
                                    }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                                </div>

                                {/* Icon */}
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.4 * index + 1, type: "spring", stiffness: 200 }}
                                    className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl z-10"
                                >
                                    {card.icon}
                                </motion.div>

                                {/* Card Content */}
                                <div className="relative z-10 p-6 w-full">
                                    <h2 className="text-2xl font-bold text-white mb-2">{card.title}</h2>
                                    <p className="text-gray-300 mb-4">{card.description}</p>
                                    <div className="flex items-center text-blue-400">
                                        <span>Get Started</span>
                                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                                        </svg>
                                    </div>
                                </div>

                                {/* Card Open Animation Overlay */}
                                {clickedCardIndex === index && (
                                    <motion.div
                                        initial={{ x: 0, rotate: -90 }}
                                        animate={{ x: -100, rotate: -90 }}
                                        transition={{ duration: 1, ease: "easeInOut" }}
                                        className="absolute top-1/2 transform -translate-y-1/2"
                                        style={{
                                            left: '180px',
                                            borderLeftWidth: '300px',
                                            borderLeftColor: 'transparent',
                                            borderRightWidth: '280px',
                                            borderRightColor: 'transparent',
                                            borderBottomWidth: '40vh',
                                            borderBottomColor: 'rgba(255, 255, 255, 0.5)',
                                            opacity: 0.5,
                                        }}
                                    >
                                        <h2
                                            className="relative z-10 text-xs md:text-3xl lg:text-2xl font-semibold text-center leading-relaxed tracking-wide drop-shadow-lg"
                                            style={{
                                                color: 'black',
                                                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.9)',
                                                transform: 'rotate(90deg)',
                                                transformOrigin: 'left bottom',
                                                whiteSpace: 'normal',
                                                width: '250px',
                                                textAlign: 'center',
                                            }}
                                        >
                                            {card.title}
                                        </h2>
                                    </motion.div>
                                )}

                                {/* Hover Overlay */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-purple-900/30 opacity-0 transition-opacity duration-300"
                                    whileHover={{ opacity: 1 }}
                                />
                            </motion.div>
                        ))}
                    </div>

                </div>
            </section>

            {/* Services Section */}
            <section id="services" ref={servicesRef} className="py-20 relative">
                <div className="absolute inset-0 bg-black bg-opacity-70"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={servicesInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-white mb-3">Our Services</h2>
                        <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto"></div>
                        <p className="text-gray-300 mt-4 max-w-2xl mx-auto">
                            Comprehensive mental health assessment tools powered by advanced AI technology.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                title: "Questionnaire Assessment",
                                description: "Answer a series of multiple-choice questions for a comprehensive mental health evaluation.",
                                image: "https://media.istockphoto.com/id/1398462038/photo/online-exam-or-test.jpg?s=612x612&w=0&k=20&c=hvaH_2oA0Dm-tpQ8T5JBF_39QF3xhpic38Yi2AngaCE=",
                                icon: "📋"
                            },
                            {
                                title: "Voice Analysis",
                                description: "Our AI analyzes your voice patterns to detect emotional states and potential concerns.",
                                image: "https://d1g9yur4m4naub.cloudfront.net/images/Article_Images/ImageForArticle_671_16397429374359201.jpg",
                                icon: "🎙️"
                            },
                            {
                                title: "Video Expression Analysis",
                                description: "Advanced facial recognition technology identifies emotional expressions and well-being indicators.",
                                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQB96xhpCsZbVAutLnUGoRSzOOVCyE7Quagyw&s",
                                icon: "🎥"
                            },
                            {
                                title: "Diary Analysis",
                                description: "Track your thoughts and emotions through daily journaling for personalized insights.",
                                image: "https://storage.googleapis.com/fplswordpressblog/2023/04/What-are-Diary-Studies-Meaning-How-and-When-to-Conduct-It.jpg",
                                icon: "📓"
                            },
                        ].map((service, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                animate={servicesInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                whileHover={{ y: -10 }}
                                className="rounded-xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 shadow-lg backdrop-blur-sm"
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={service.image}
                                        alt={service.title}
                                        className="w-full h-full object-cover transition-transform duration-300 transform hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                                    <div className="absolute bottom-0 left-0 p-4">
                                        <span className="text-4xl">{service.icon}</span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                                    <p className="text-gray-300">{service.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" ref={featuresRef} className="py-20 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-black to-gray-900"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-white mb-3">Features</h2>
                        <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto"></div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                title: "User-Friendly Interface",
                                description: "Our intuitive interface ensures that users can navigate the platform with ease.",
                                icon: "💻"
                            },
                            {
                                title: "Multi-Model Prediction",
                                description: "Leverage various AI models for accurate predictions based on different input methods.",
                                icon: "🧠"
                            },
                            {
                                title: "Comprehensive Reports",
                                description: "Receive detailed reports with personalized recommendations for your mental health journey.",
                                icon: "📊"
                            },
                            {
                                title: "Well-Trained AI Models",
                                description: "Our models are trained on diverse datasets to ensure reliability and accuracy in predictions.",
                                icon: "🤖"
                            },
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={featuresInView ? { opacity: 1, scale: 1 } : {}}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                whileHover={{ scale: 1.05 }}
                                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 backdrop-blur-sm border border-gray-700"
                            >
                                <div className="mb-4 text-4xl">{feature.icon}</div>
                                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                                <p className="text-gray-300">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Feature highlight */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="mt-16 bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-8 shadow-2xl"
                    >
                        <div className="flex flex-col md:flex-row items-center">
                            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
                                <h3 className="text-3xl font-bold text-white mb-4">AI-Powered Assessment</h3>
                                <p className="text-gray-300 mb-6">
                                    Our advanced machine learning models analyze multiple data points to provide accurate mental health assessments.
                                    Get insights that would typically require multiple sessions with a professional.
                                </p>
                                <ul className="space-y-2 text-gray-300">
                                    {['Stress Level Analysis', 'Anxiety Detection', 'Depression Screening', 'Personalized Recommendations'].map((item, i) => (
                                        <motion.li
                                            key={i}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={featuresInView ? { opacity: 1, x: 0 } : {}}
                                            transition={{ duration: 0.3, delay: 0.6 + (i * 0.1) }}
                                            className="flex items-center"
                                        >
                                            <svg className="w-5 h-5 mr-2 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                            </svg>
                                            {item}
                                        </motion.li>
                                    ))}
                                </ul>
                            </div>
                            <div className="md:w-1/2 flex justify-center">
                                <motion.div
                                    animate={{
                                        rotateY: [0, 180, 360],
                                        scale: [1, 1.1, 1]
                                    }}
                                    transition={{
                                        duration: 10,
                                        ease: "linear",
                                        repeat: Infinity
                                    }}
                                    className="w-64 h-64 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center"
                                >
                                    <div className="w-56 h-56 rounded-full bg-gray-900 flex items-center justify-center">
                                        <div className="text-6xl">🧠</div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>




            {/* Blogs Section */}
            <section id="blogs" ref={blogsRef} className="py-20 relative">
                <div className="absolute inset-0 bg-black bg-opacity-70"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={blogsInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-white mb-3">Blogs</h2>
                        <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto"></div>
                        <p className="text-gray-300 mt-4 max-w-2xl mx-auto">
                            Dive into insightful articles about mental health and AI.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                        {[
                            {
                                title: "Understanding Mental Health",
                                description: "Explore the latest research on mental health and how AI can help.",
                                image: "https://mpowerminds.com/assetOLD/images/paralysed-with-anxiety.png",
                                link: "https://mpowerminds.com/blog"
                            },
                            {
                                title: "AI and Healthcare",
                                description: "Discover the intersection of AI and healthcare for mental well-being.",
                                image: "https://publish-p57963-e462109.adobeaemcloud.com/adobe/dynamicmedia/deliver/dm-aid--68d23859-9d02-4d82-a94f-b507642615fd/sf-ai-healthcare.jpg?width=1920&preferwebp=true&quality=85",
                                link: "https://www.snowflake.com/en/blog/present-future-of-healthcare-ai/"
                            },
                            {
                                title: "Wellness in the Digital Age",
                                description: "How digital tools can enhance your mental health journey.",
                                image: "https://cdn.prod.website-files.com/6577870d4b8dd850816ffa4e/667c942b589cefe2b688cc63_Why%20Your%20Employee%20Engagement%20Survey%20Should%20Measure%20Digital%20Culture%20(2)%20(1).png",
                                link: "https://www.digitalwellnessinstitute.com/blog"
                            },
                        ].map((blog, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                animate={blogsInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                whileHover={{ y: -10, scale: 1.02 }}
                                className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden shadow-lg backdrop-blur-sm border border-gray-800"
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={blog.image}
                                        alt={blog.title}
                                        className="w-full h-full object-cover transition-transform duration-500 transform hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-2xl font-bold text-white mb-3">{blog.title}</h3>
                                    <p className="text-gray-300 mb-5">{blog.description}</p>
                                    <a
                                        href={blog.link}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg transition duration-300 hover:shadow-lg"
                                    >
                                        Read More
                                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                        </svg>
                                    </a>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About Us Section */}
            <section id="aboutUs" ref={aboutRef} className="py-20 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={aboutInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-white mb-3">About Us</h2>
                        <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto"></div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={aboutInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 shadow-xl backdrop-blur-sm border border-gray-700 max-w-4xl mx-auto"
                    >
                        <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
                        <p className="text-gray-300 mb-6">
                            Mind Matrics is a cutting-edge platform that combines AI and mental health research to predict, analyze,
                            and provide support for mental well-being. Our mission is to make mental health care accessible,
                            predictive, and tailored to individual needs.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={aboutInView ? { opacity: 1, x: 0 } : {}}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="bg-gray-800 bg-opacity-50 p-6 rounded-lg"
                            >
                                <h4 className="text-xl font-semibold text-white mb-3">Our Vision</h4>
                                <p className="text-gray-300">
                                    To revolutionize mental health care through technology, making it accessible to everyone,
                                    everywhere. We believe in a world where mental wellness is prioritized and supported by
                                    innovative digital solutions.
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={aboutInView ? { opacity: 1, x: 0 } : {}}
                                transition={{ duration: 0.6, delay: 0.6 }}
                                className="bg-gray-800 bg-opacity-50 p-6 rounded-lg"
                            >
                                <h4 className="text-xl font-semibold text-white mb-3">Our Approach</h4>
                                <p className="text-gray-300">
                                    We combine cutting-edge AI technology with established psychological frameworks to create
                                    tools that provide meaningful insights and support for mental health. Our multi-modal
                                    approach ensures comprehensive analysis and personalized recommendations.
                                </p>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Team Section */}
            <section id="team" ref={teamRef} className="py-20 relative">
                <div className="absolute inset-0 bg-black bg-opacity-80"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={teamInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-white mb-3">Our Team</h2>
                        <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto"></div>
                        <p className="text-gray-300 mt-4 max-w-2xl mx-auto">
                            Meet the brilliant minds behind Mind Matrics.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            {
                                name: "Karan Jain",
                                image: "https://media.licdn.com/dms/image/v2/D4D03AQGNNwa8LPAo-g/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1727882710496?e=1747872000&v=beta&t=F1iMVxwMZux2FPbtEgMWnMnnwAT2CYduyRSq9XlS9bc",
                                linkedin: "https://www.linkedin.com/in/karan-jain-161b60267/",
                                github: "https://github.com/KaranJain09"
                            },
                            {
                                name: "Yash Jain",
                                image: "https://media.licdn.com/dms/image/v2/D4D35AQE60HRgh3se3A/profile-framedphoto-shrink_400_400/profile-framedphoto-shrink_400_400/0/1722793355354?e=1744178400&v=beta&t=zqXfOhfFzRkgzhudaDhpU6WZTR8sFxfxqvl9naLLTYo",
                                linkedin: "https://www.linkedin.com/in/yash-jain-4b7699283/",
                                github: "https://github.com/YashJain999"
                            },
                            {
                                name: "Urvi Joshi",
                                image: "https://media.licdn.com/dms/image/v2/D4D03AQGvrWMiZvkUgg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1732247969704?e=1747872000&v=beta&t=RuVZWr9qtmi7_yATxtxP2chWz7UzctSASRRyv2jWvHQ",
                                linkedin: "https://www.linkedin.com/in/urvi-joshi-7b1974228/",
                                github: "https://github.com/UrviJoshi24"
                            },
                            {
                                name: "Swapnil Joshi",
                                image: "https://media.licdn.com/dms/image/v2/D4D35AQEPqZFmNHy4TA/profile-framedphoto-shrink_400_400/profile-framedphoto-shrink_400_400/0/1692444027165?e=1744178400&v=beta&t=tYrm-pjNJcRtooDN_f6yp-Re7QCU49X-pMiZ3Qz-NCQ",
                                linkedin: "https://www.linkedin.com/in/swapnil-joshi-84743122b/",
                                github: "https://github.com/swapniljoshi123"
                            }
                        ].map((member, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                animate={teamInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                whileHover={{ y: -10 }}
                                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 text-center shadow-lg backdrop-blur-sm border border-gray-700"
                            >
                                <div className="relative mb-6 mx-auto w-24 h-24 rounded-full overflow-hidden border-2 border-blue-400">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{member.name}</h3>
                                <div className="flex justify-center space-x-4 mt-4">
                                    <a
                                        href={member.linkedin}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-gray-300 hover:text-blue-400 transition-colors"
                                    >
                                        <svg className="w-6 h-6" fill="currentColor" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                        </svg>
                                    </a>
                                    <a
                                        href={member.github}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-gray-300 hover:text-blue-400 transition-colors"
                                    >
                                        <svg className="w-6 h-6" fill="currentColor" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                                        </svg>
                                    </a>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-10 relative bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="mb-8 md:mb-0"
                        >
                            <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
                                Mind Matrics
                            </h3>
                            <p className="text-gray-400 mt-2">
                                Unlocking your mental well-being.
                            </p>
                        </motion.div>

                        <div className="flex flex-col items-center md:items-end">
                            <div className="flex space-x-4 mb-4">
                                {[
                                    { icon: "fab fa-twitter", url: "#" },
                                    { icon: "fab fa-facebook", url: "#" },
                                    { icon: "fab fa-instagram", url: "#" },
                                    { icon: "fab fa-github", url: "#" }
                                ].map((social, index) => (
                                    <motion.a
                                        key={index}
                                        whileHover={{ scale: 1.2 }}
                                        href={social.url}
                                        className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 hover:bg-blue-600 hover:text-white transition-colors duration-300"
                                    >
                                        <i className={social.icon}></i>
                                    </motion.a>
                                ))}
                            </div>
                            <p className="text-gray-400 text-sm">
                                © 2024 Mind Matrics. All Rights Reserved.
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div >
    );
};

export default Home;