// import React from 'react';
// import { Link as ScrollLink } from 'react-scroll'; // Alias for Link from react-scroll
// import { Link as RouterLink } from 'react-router-dom'; // Alias for Link from react-router-dom
// import backgroundImage from '../assets/images/bg.jpg'; // Adjust the path based on your folder structure


// const Landing = () => {
//   return (
//     <div className="relative min-h-screen bg-cover bg-fixed bg-center" style={{ backgroundImage: `url(${backgroundImage})` }}>
//       {/* Navbar */}
//       <nav className="bg-black bg-opacity-50 p-4 z-50">
//         {/* Fixed Title */}
//         <div className="fixed top-0 left-0 right-0 text-center bg-black bg-opacity-50 p-2">
//           <p className="text-4xl font-extrabold text-white transition-transform transform hover:scale-110 font-sans">
//             Mind Matrics
//           </p>
//         </div>
//         {/* Scrollable Navigation Links */}
//         <div className="pt-10 flex justify-between items-center">
//           <ul className="flex space-x-8 text-white">
//             {['Services', 'Features', 'Blogs', 'About Us'].map((item) => (
//               <li key={item}>
//                 <ScrollLink
//                   to={item.toLowerCase()} // Match the section id
//                   smooth={true} // Smooth scrolling
//                   duration={500} // Duration of the scroll
//                   className="hover:scale-105 transition duration-300 cursor-pointer"
//                   activeClass="active" // Optional: for styling the active link
//                   spy={true} // Enables active class for the current section
//                   offset={-70} // Adjust based on your navbar height
//                 >
//                   {item}
//                 </ScrollLink>
//               </li>
//             ))}
//           </ul>

//           <div className="flex space-x-4 mt-2.5">
//           <RouterLink to="/login">
//               <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300">
//                 Login
//               </button>
//             </RouterLink>
//             <RouterLink to="/signup">
//             <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300">
//               Sign Up
//             </button>
//             </RouterLink>
//           </div>
//         </div>
//       </nav>


//       {/* Hero Section */}
//       <section id="hero" className="flex items-center h-screen text-white bg-cover bg-center">
//         <div className="absolute inset-0 bg-black opacity-10 pointer-events-none"></div> {/* Set pointer-events to none */}
//         <div className="relative z-10 flex flex-col justify-center items-start h-full w-1/2 p-12">
//           <h1 className="text-6xl font-extrabold leading-tight mb-4 animate__animated animate__fadeInDown animate__delay-1s">
//             Empower Your Mental Well-Being with AI
//           </h1>
//           <p className="text-xl max-w-lg mb-8 animate__animated animate__fadeInUp animate__delay-2s">
//             Predict your mental health with advanced AI technologies. Join us in redefining mental well-being!
//           </p>
//           <button className="px-8 py-4 bg-indigo-600 text-white font-semibold rounded-md shadow-lg transform transition-all duration-300 hover:bg-indigo-700 hover:scale-105 animate__animated animate__fadeInUp animate__delay-3s">
//             Get Started
//           </button>
//         </div>
//       </section>

//       {/* Services Section */}
//       <section id="services" className="py-20 bg-black bg-opacity-50 text-center text-white">
//         <h2 className="text-4xl font-bold mb-12">Our Services</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 px-10">
//           {[
//             {
//               title: "Mental Health Prediction via Questionnaires",
//               description: "Users answer a series of multiple-choice questions, and predictions are made based on their responses.",
//               image: "https://media.istockphoto.com/id/1398462038/photo/online-exam-or-test.jpg?s=612x612&w=0&k=20&c=hvaH_2oA0Dm-tpQ8T5JBF_39QF3xhpic38Yi2AngaCE="
//             },
//             {
//               title: "Voice and Text Input Analysis",
//               description: "Users speak into the system, where their voice and text inputs are analyzed to predict mental health using CNN.",
//               image: "https://d1g9yur4m4naub.cloudfront.net/images/Article_Images/ImageForArticle_671_16397429374359201.jpg"
//             },
//             {
//               title: "Video and Expression Analysis",
//               description: "Users provide video input, which is analyzed for facial expressions alongside audio and text for predictions.",
//               image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQB96xhpCsZbVAutLnUGoRSzOOVCyE7Quagyw&s"
//             },
//             {
//               title: "Diary Maintenance for Predictions",
//               description: "Users maintain a diary for five days detailing their daily lives, and predictions are made based on their entries.",
//               image: "https://storage.googleapis.com/fplswordpressblog/2023/04/What-are-Diary-Studies-Meaning-How-and-When-to-Conduct-It.jpg"
//             },
//           ].map(service => (
//             <div key={service.title} className="bg-white bg-opacity-20 p-6 rounded-lg hover:scale-105 transition transform duration-300">
//               <img src={service.image} alt={service.title} className="w-full h-40 object-cover rounded-md mb-4" />
//               <h3 className="text-2xl font-semibold mb-4">{service.title}</h3>
//               <p className="text-md">{service.description}</p>
//             </div>
//           ))}
//         </div>
//       </section>


//       {/* Features Section */}
//       <section id="features" className="py-20 bg-black bg-opacity-50 text-white">
//         <div className="text-center mb-12">
//           <h2 className="text-4xl font-bold">Features</h2>
//         </div>
//         <div className="flex flex-wrap justify-center gap-10 px-10">
//           {[
//             {
//               title: "User-Friendly Interface",
//               description: "Our intuitive interface ensures that users can navigate the platform with ease, making mental health assessments simple and efficient.",
//             },
//             {
//               title: "Multi-Model Prediction",
//               description: "Leverage various AI models to provide accurate predictions based on different input methods, including questionnaires, voice, and video analysis.",
//             },
//             {
//               title: "Report Generation",
//               description: "Receive comprehensive reports detailing your mental health predictions, trends, and personalized recommendations, empowering you to take informed steps.",
//             },
//             {
//               title: "Well-Trained Models",
//               description: "Our AI models are meticulously trained using diverse datasets to ensure reliability and accuracy in predictions, making your mental health journey more effective.",
//             },
//           ].map((feature) => (
//             <div key={feature.title} className="w-full md:w-1/5 bg-white bg-opacity-20 p-6 rounded-lg hover:scale-105 transition transform duration-300">
//               <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
//               <p>{feature.description}</p>
//             </div>
//           ))}
//         </div>
//       </section>


//       {/* Blogs Section */}
//       <section id="blogs" className="py-20 bg-black bg-opacity-50 text-white">
//         <div className="text-center mb-12">
//           <h2 className="text-4xl font-bold">Blogs</h2>
//           <p className="mt-4 text-lg">Dive into insightful articles about mental health and AI.</p>
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 px-10">
//           {[
//             {
//               title: "Understanding Mental Health",
//               description: "Explore the latest research on mental health and how AI can help.",
//               image: "https://mpowerminds.com/assetOLD/images/paralysed-with-anxiety.png",
//               link: "https://mpowerminds.com/blog"
//             },
//             {
//               title: "AI and Healthcare",
//               description: "Discover the intersection of AI and healthcare for mental well-being.",
//               image: "https://publish-p57963-e462109.adobeaemcloud.com/adobe/dynamicmedia/deliver/dm-aid--68d23859-9d02-4d82-a94f-b507642615fd/sf-ai-healthcare.jpg?width=1920&preferwebp=true&quality=85",
//               link: "https://www.snowflake.com/en/blog/present-future-of-healthcare-ai/"
//             },
//             {
//               title: "Wellness in the Digital Age",
//               description: "How digital tools can enhance your mental health journey.",
//               image: "https://cdn.prod.website-files.com/6577870d4b8dd850816ffa4e/667c942b589cefe2b688cc63_Why%20Your%20Employee%20Engagement%20Survey%20Should%20Measure%20Digital%20Culture%20(2)%20(1).png",
//               link: "https://www.digitalwellnessinstitute.com/blog"
//             },
//           ].map(blog => (
//             <div key={blog.title} className="bg-white bg-opacity-20 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300">
//               <img src={blog.image} alt={blog.title} className="w-full h-48 object-cover" />
//               <div className="p-6">
//                 <h3 className="text-2xl font-semibold mb-4">{blog.title}</h3>
//                 <p>{blog.description}</p>
//                 <a href={blog.link} target="_blank" rel="noreferrer" className="inline-block mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md transition duration-300 hover:bg-indigo-700">
//   Read More
// </a>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>



//       {/* About Us Section */}
//       <section id="about us" className="py-20 bg-black bg-opacity-50 text-center text-white">
//         <h2 className="text-4xl font-bold mb-4">About Us</h2>
//         <p className="max-w-2xl mx-auto mb-8">Mind Matrics is a cutting-edge platform that combines AI and mental health research to predict, analyze, and provide support for mental well-being. Our mission is to make mental health care accessible, predictive, and tailored to individual needs.</p>
//       </section>

//       {/* Footer */}
// <footer id="footer" className="py-10 bg-gray-800 text-white text-center">
//   <h3 className="text-2xl font-bold mb-4">Our Team</h3>
//   <div className="team-members grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-10">
//     {[
//       {
//         name: "Karan Jain",
//         image: "https://media.licdn.com/dms/image/v2/D4D03AQGNNwa8LPAo-g/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1727882710471?e=1733356800&v=beta&t=8GyOLs2-ENtwxjsFOT5N17AMzssFGPCprQ4Q7_q1jb4",
//         linkedin: "https://www.linkedin.com/in/karan-jain-161b60267/",
//         github: "https://github.com/KaranJain09"
//       },
//       {
//         name: "Yash Jain",
//         image: "https://media.licdn.com/dms/image/v2/D4D35AQE60HRgh3se3A/profile-framedphoto-shrink_100_100/profile-framedphoto-shrink_100_100/0/1722793355327?e=1728489600&v=beta&t=qp61ALA0CuCqzzEIwMgQXA2sqrM8-DIx9uMb-podvLk",
//         linkedin: "https://www.linkedin.com/in/yash-jain-4b7699283/",
//         github: "https://github.com/YashJain999"
//       },
//       {
//         name: "Urvi Joshi",
//         image: "https://media.licdn.com/dms/image/v2/D4D03AQE7E22HWyxCTw/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1690904086179?e=1733356800&v=beta&t=KQ0C7xYQsqaoI-zcBfMqz27yhYa8mn0JpYCQk90ZPOM",
//         linkedin: "https://www.linkedin.com/in/urvi-joshi-7b1974228/",
//         github: "https://github.com/UrviJoshi24"
//       },
//       {
//         name: "Swapnil Joshi",
//         image: "https://media.licdn.com/dms/image/v2/D4D35AQEPqZFmNHy4TA/profile-framedphoto-shrink_100_100/profile-framedphoto-shrink_100_100/0/1692444027165?e=1728489600&v=beta&t=VXktZFu4WSVxWPzmW_ZegGi5RSF_IBfZM9lA8fC3kuk",
//         linkedin: "https://www.linkedin.com/in/swapnil-joshi-84743122b/",
//         github: "https://github.com/swapniljoshi123"
//       }
//     ].map((member, index) => (
//       <div key={index} className="team-member text-center">
//         <img src={member.image} alt={`Team Member ${member.name}`} className="w-24 h-24 rounded-full mx-auto mb-4" />
//         <h4 className="text-xl font-semibold mb-2">{member.name}</h4>
//         <div className="flex justify-center space-x-4">
//           <a href={member.linkedin} target="_blank" rel="noreferrer" className="text-blue-500 hover:text-gray-400">LinkedIn</a>
//           <a href={member.github} target="_blank" rel="noreferrer" className="text-blue-500 hover:text-gray-400">GitHub</a>
//         </div>
//       </div>
//     ))}
//   </div>
//   <p className="mt-6">© 2024 Mind Matrics. All Rights Reserved.</p>
// </footer>

//     </div>
//   );
// }

// export default Landing;


import { useState, useEffect, useRef } from "react"
import { Link as ScrollLink } from "react-scroll"
import { Link as RouterLink } from "react-router-dom"
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion"
import {
  Brain,
  ChevronDown,
  Sparkles,
  BarChart3,
  Shield,
  Users,
  Linkedin,
  Github,
  ArrowRight,
  Menu,
  X,
} from "lucide-react"
import backgroundImage from "../assets/images/bg.jpg"

// Particle animation component
const ParticleBackground = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    let particlesArray = []
    const numberOfParticles = 100

    // Create particles
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 3 + 1
        this.speedX = Math.random() * 1 - 0.5
        this.speedY = Math.random() * 1 - 0.5
        this.color = `rgba(255, 255, 255, ${Math.random() * 0.3})`
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.x > canvas.width) this.x = 0
        if (this.x < 0) this.x = canvas.width
        if (this.y > canvas.height) this.y = 0
        if (this.y < 0) this.y = canvas.height
      }

      draw() {
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const init = () => {
      particlesArray = []
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle())
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update()
        particlesArray[i].draw()
      }

      // Connect particles with lines
      connectParticles()
      requestAnimationFrame(animate)
    }

    const connectParticles = () => {
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          const dx = particlesArray[a].x - particlesArray[b].x
          const dy = particlesArray[a].y - particlesArray[b].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 - distance / 1000})`
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y)
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y)
            ctx.stroke()
          }
        }
      }
    }

    init()
    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      init()
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-40" />
}

// Animated text component
const AnimatedText = ({ text, className }) => {
  return (
    <div className={className}>
      {text.split(" ").map((word, wordIndex) => (
        <div key={wordIndex} className="inline-block mr-2">
          {word.split("").map((char, charIndex) => (
            <motion.span
              key={charIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: wordIndex * 0.1 + charIndex * 0.03,
                ease: "easeOut",
              }}
              className="inline-block"
            >
              {char}
            </motion.span>
          ))}
        </div>
      ))}
    </div>
  )
}

// Animated counter component
const AnimatedCounter = ({ target, duration = 2, className }) => {
  const [count, setCount] = useState(0)
  const counterRef = useRef(null)
  const isInView = useInView(counterRef, { once: true })

  useEffect(() => {
    if (isInView) {
      let startTime
      let animationFrameId

      const updateCount = (timestamp) => {
        if (!startTime) startTime = timestamp
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
        setCount(Math.floor(progress * target))

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(updateCount)
        }
      }

      animationFrameId = requestAnimationFrame(updateCount)

      return () => {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [isInView, target, duration])

  return (
    <span ref={counterRef} className={className}>
      {count}
    </span>
  )
}

// 3D Tilt Card component
const TiltCard = ({ children, className }) => {
  const cardRef = useRef(null)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = (y - centerY) / 20
    const rotateY = (centerX - x) / 20

    setRotation({ x: rotateX, y: rotateY })
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setRotation({ x: 0, y: 0 })
  }

  return (
    <motion.div
      ref={cardRef}
      className={`${className} transition-transform duration-200`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale3d(1.05, 1.05, 1.05)`
          : "perspective(1000px) rotateX(0) rotateY(0)",
        transition: "transform 0.2s ease",
      }}
    >
      {children}
    </motion.div>
  )
}

// Main Landing component
const Landing = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { scrollYProgress } = useScroll()
  const heroRef = useRef(null)
  const servicesRef = useRef(null)
  const featuresRef = useRef(null)
  const blogsRef = useRef(null)
  const aboutRef = useRef(null)

  // Parallax effect for background
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"])

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
    hover: {
      scale: 1.05,
      boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
  }

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.2,
        duration: 0.6,
      },
    },
  }

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
    tap: { scale: 0.95 },
  }

  // Stats data
  const stats = [
    { value: 85, label: "Accuracy Rate" },
    { value: 10, label: "Users Helped" },
    { value: 4, label: "Assessment Methods" },
    { value: 24, label: "Hour Support" },
  ]

  // Testimonials data
  const testimonials = [
    {
      quote:
        "Mind Matrics has completely transformed how I understand my mental health. The insights are incredibly accurate.",
      author: "Sarah J.",
      role: "Teacher",
    },
    {
      quote: "As a healthcare professional, I'm impressed by the scientific approach and accuracy of the assessments.",
      author: "Dr. Michael Chen",
      role: "Psychiatrist",
    },
    {
      quote: "The platform is intuitive and the reports are detailed yet easy to understand. Highly recommended!",
      author: "Alex Rodriguez",
      role: "Software Engineer",
    },
  ]

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background with parallax effect */}
      <motion.div
        className="fixed inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          y: backgroundY,
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-60 z-0"></div>

      {/* Particle animation */}
      <ParticleBackground />

      {/* Navbar */}
      <motion.nav
        className="sticky top-0 bg-black bg-opacity-70 backdrop-blur-sm p-4 z-50"
        initial="hidden"
        animate="visible"
        variants={navVariants}
      >
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <motion.div
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Brain className="h-8 w-8 text-indigo-400" />
              <span className="text-3xl font-extrabold text-white">Mind Matrics</span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <motion.ul
                className="flex space-x-8 text-white"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {[
                  { name: "Services", ref: servicesRef },
                  { name: "Features", ref: featuresRef },
                  { name: "Blogs", ref: blogsRef },
                  { name: "About Us", ref: aboutRef },
                ].map((item, index) => (
                  <motion.li key={item.name} variants={fadeInUp} custom={index}>
                    <ScrollLink
                      to={item.name.toLowerCase().replace(" ", "-")}
                      smooth={true}
                      duration={800}
                      className="relative cursor-pointer text-lg font-medium group"
                      activeClass="active"
                      spy={true}
                      offset={-70}
                    >
                      {item.name}
                      <motion.span
                        className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-400 group-hover:w-full"
                        transition={{ duration: 0.3 }}
                      />
                    </ScrollLink>
                  </motion.li>
                ))}
              </motion.ul>

              <div className="flex space-x-4">
                <RouterLink to="/login">
                  <motion.button
                    className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-medium"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    Login
                  </motion.button>
                </RouterLink>
                <RouterLink to="/signup">
                  <motion.button
                    className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full font-medium"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    Sign Up
                  </motion.button>
                </RouterLink>
              </div>
            </div>

            {/* Mobile menu button */}
            <motion.button
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="md:hidden absolute top-full left-0 right-0 bg-black bg-opacity-90 backdrop-blur-sm z-50"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="container mx-auto py-4 px-6">
                <motion.ul
                  className="flex flex-col space-y-4 text-white"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                >
                  {[
                    { name: "Services", ref: servicesRef },
                    { name: "Features", ref: featuresRef },
                    { name: "Blogs", ref: blogsRef },
                    { name: "About Us", ref: aboutRef },
                  ].map((item, index) => (
                    <motion.li key={item.name} variants={fadeInUp} custom={index}>
                      <ScrollLink
                        to={item.name.toLowerCase().replace(" ", "-")}
                        smooth={true}
                        duration={800}
                        className="block text-lg font-medium"
                        activeClass="active"
                        spy={true}
                        offset={-70}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.name}
                      </ScrollLink>
                    </motion.li>
                  ))}
                </motion.ul>

                <div className="flex space-x-4 mt-6">
                  <RouterLink to="/login" className="flex-1">
                    <motion.button
                      className="w-full px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-medium"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </motion.button>
                  </RouterLink>
                  <RouterLink to="/signup" className="flex-1">
                    <motion.button
                      className="w-full px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full font-medium"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </motion.button>
                  </RouterLink>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section */}
      <section id="hero" className="relative flex items-center min-h-screen text-white z-10" ref={heroRef}>
        <div className="container mx-auto px-6 py-24 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="inline-block px-4 py-1 bg-indigo-600 bg-opacity-30 backdrop-blur-sm rounded-full text-sm font-semibold text-indigo-300 border border-indigo-500/30"
              >
                <span className="flex items-center">
                  <Sparkles className="h-4 w-4 mr-2" />
                  AI-Powered Mental Health Platform
                </span>
              </motion.div>

              <AnimatedText
                text="Empower Your Mental Well-Being with AI"
                className="text-4xl md:text-6xl font-extrabold leading-tight"
              />

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="text-xl max-w-lg text-gray-300"
              >
                Predict your mental health with advanced AI technologies. Join us in redefining mental well-being with
                personalized insights and support.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
              >
                <RouterLink to="/signup">
                  <motion.button
                    className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-full shadow-lg flex items-center justify-center space-x-2 w-full sm:w-auto"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    animate={{
                      boxShadow: [
                        "0px 0px 0px rgba(79, 70, 229, 0.2)",
                        "0px 0px 20px rgba(79, 70, 229, 0.4)",
                        "0px 0px 0px rgba(79, 70, 229, 0.2)",
                      ],
                    }}
                    transition={{
                      boxShadow: {
                        repeat: Number.POSITIVE_INFINITY,
                        duration: 2,
                      },
                    }}
                  >
                    <span>Get Started</span>
                    <ArrowRight className="h-5 w-5" />
                  </motion.button>
                </RouterLink>

                <ScrollLink to="services" smooth={true} duration={800}>
                  <motion.button
                    className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-full flex items-center justify-center space-x-2 w-full sm:w-auto"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <span>Learn More</span>
                    <ChevronDown className="h-5 w-5" />
                  </motion.button>
                </ScrollLink>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="relative hidden lg:block"
            >
              {/* 3D Brain visualization or illustration */}
              <div className="relative w-full h-[500px] flex items-center justify-center">
                <motion.div
                  className="absolute w-64 h-64 rounded-full bg-indigo-500 opacity-20 blur-3xl"
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />

                <motion.div
                  className="absolute w-80 h-80 rounded-full border-4 border-indigo-400 opacity-20"
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 20,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                />

                <motion.div
                  className="absolute w-96 h-96 rounded-full border-2 border-dashed border-purple-400 opacity-20"
                  animate={{
                    rotate: -360,
                  }}
                  transition={{
                    duration: 30,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                />

                <motion.div
                  className="relative z-10"
                  animate={{
                    y: [0, -20, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                >
                  <Brain className="h-48 w-48 text-indigo-300" />
                </motion.div>

                {/* Floating particles */}
                {[...Array(10)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full bg-indigo-400"
                    initial={{
                      x: Math.random() * 400 - 200,
                      y: Math.random() * 400 - 200,
                      opacity: Math.random() * 0.5 + 0.3,
                    }}
                    animate={{
                      x: Math.random() * 400 - 200,
                      y: Math.random() * 400 - 200,
                    }}
                    transition={{
                      duration: Math.random() * 10 + 10,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Stats section */}
          <motion.div
            className="mt-16 md:mt-24 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center p-4 bg-white bg-opacity-5 backdrop-blur-sm rounded-lg border border-white/10"
                variants={fadeInUp}
                custom={index}
              >
                <div className="text-3xl md:text-4xl font-bold text-indigo-300 flex justify-center">
                  <AnimatedCounter target={stat.value} className="mr-1" />
                  {stat.value === 95 && "%"}
                  {stat.value === 24 && "/7"}
                </div>
                <div className="text-sm md:text-base mt-2 text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="relative py-20 text-white z-10" ref={servicesRef}>
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1 bg-indigo-600 bg-opacity-30 backdrop-blur-sm rounded-full text-sm font-semibold text-indigo-300 border border-indigo-500/30 mb-4"
            >
              Our Services
            </motion.div>
            <h2 className="text-4xl font-bold mb-4">Comprehensive Mental Health Solutions</h2>
            <p className="max-w-2xl mx-auto text-gray-300">
              Explore our range of AI-powered assessment methods designed to provide accurate insights into your mental
              well-being.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
          >
            {[
              {
                title: "Mental Health Prediction via Questionnaires",
                description:
                  "Users answer a series of multiple-choice questions, and predictions are made based on their responses.",
                image:
                  "https://media.istockphoto.com/id/1398462038/photo/online-exam-or-test.jpg?s=612x612&w=0&k=20&c=hvaH_2oA0Dm-tpQ8T5JBF_39QF3xhpic38Yi2AngaCE=",
                color: "from-blue-600 to-indigo-600",
              },
              {
                title: "Voice and Text Input Analysis",
                description:
                  "Users speak into the system, where their voice and text inputs are analyzed to predict mental health using CNN.",
                image:
                  "https://d1g9yur4m4naub.cloudfront.net/images/Article_Images/ImageForArticle_671_16397429374359201.jpg",
                color: "from-purple-600 to-pink-600",
              },
              {
                title: "Video and Expression Analysis",
                description:
                  "Users provide video input, which is analyzed for facial expressions alongside audio and text for predictions.",
                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQB96xhpCsZbVAutLnUGoRSzOOVCyE7Quagyw&s",
                color: "from-green-600 to-teal-600",
              },
              {
                title: "Diary Maintenance for Predictions",
                description:
                  "Users maintain a diary for five days detailing their daily lives, and predictions are made based on their entries.",
                image:
                  "https://storage.googleapis.com/fplswordpressblog/2023/04/What-are-Diary-Studies-Meaning-How-and-When-to-Conduct-It.jpg",
                color: "from-amber-600 to-orange-600",
              },
            ].map((service, index) => (
              <TiltCard
                key={service.title}
                className="bg-black bg-opacity-30 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10"
              >
                <motion.div variants={cardVariants} custom={index} className="h-full flex flex-col">
                  <div className="relative h-48 overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60"
                      whileHover={{ opacity: 0.4 }}
                    />
                    <motion.img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    />
                    <div className="absolute top-4 left-4">
                      <motion.div
                        className={`inline-block px-3 py-1 bg-gradient-to-r ${service.color} rounded-full text-xs font-semibold text-white`}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 * index, duration: 0.5 }}
                        viewport={{ once: true }}
                      >
                        Method {index + 1}
                      </motion.div>
                    </div>
                  </div>

                  <div className="p-6 flex-grow flex flex-col">
                    <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                    <p className="text-gray-300 text-sm flex-grow">{service.description}</p>

                    <motion.button
                      className={`mt-4 px-4 py-2 bg-gradient-to-r ${service.color} rounded-full text-sm font-medium text-white flex items-center justify-center space-x-2`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span>Learn More</span>
                      <ArrowRight className="h-4 w-4" />
                    </motion.button>
                  </div>
                </motion.div>
              </TiltCard>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-20 text-white z-10">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1 bg-indigo-600 bg-opacity-30 backdrop-blur-sm rounded-full text-sm font-semibold text-indigo-300 border border-indigo-500/30 mb-4"
            >
              Testimonials
            </motion.div>
            <h2 className="text-4xl font-bold mb-4">What Our Users Say</h2>
            <p className="max-w-2xl mx-auto text-gray-300">
              Hear from people who have experienced the benefits of our AI-powered mental health platform.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                custom={index}
                className="bg-white bg-opacity-5 backdrop-blur-sm rounded-xl p-8 border border-white/10 relative"
              >
                <div className="absolute -top-4 -left-4 text-5xl text-indigo-400 opacity-50">"</div>
                <div className="absolute -bottom-4 -right-4 text-5xl text-indigo-400 opacity-50">"</div>

                <p className="text-gray-200 mb-6 relative z-10">{testimonial.quote}</p>

                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold">{testimonial.author}</h4>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-20 text-white z-10" ref={featuresRef}>
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1 bg-indigo-600 bg-opacity-30 backdrop-blur-sm rounded-full text-sm font-semibold text-indigo-300 border border-indigo-500/30 mb-4"
            >
              Features
            </motion.div>
            <h2 className="text-4xl font-bold mb-4">Why Choose Mind Matrics</h2>
            <p className="max-w-2xl mx-auto text-gray-300">
              Our platform combines cutting-edge AI technology with mental health expertise to provide you with the best
              experience.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
          >
            {[
              {
                title: "User-Friendly Interface",
                description:
                  "Our intuitive interface ensures that users can navigate the platform with ease, making mental health assessments simple and efficient.",
                icon: <Users className="h-8 w-8" />,
                color: "bg-gradient-to-br from-blue-500 to-indigo-600",
              },
              {
                title: "Multi-Model Prediction",
                description:
                  "Leverage various AI models to provide accurate predictions based on different input methods, including questionnaires, voice, and video analysis.",
                icon: <Brain className="h-8 w-8" />,
                color: "bg-gradient-to-br from-purple-500 to-pink-600",
              },
              {
                title: "Report Generation",
                description:
                  "Receive comprehensive reports detailing your mental health predictions, trends, and personalized recommendations, empowering you to take informed steps.",
                icon: <BarChart3 className="h-8 w-8" />,
                color: "bg-gradient-to-br from-green-500 to-teal-600",
              },
              {
                title: "Well-Trained Models",
                description:
                  "Our AI models are meticulously trained using diverse datasets to ensure reliability and accuracy in predictions, making your mental health journey more effective.",
                icon: <Shield className="h-8 w-8" />,
                color: "bg-gradient-to-br from-amber-500 to-orange-600",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={cardVariants}
                custom={index}
                className="bg-white bg-opacity-5 backdrop-blur-sm rounded-xl p-8 border border-white/10 hover:border-indigo-500/30 transition-all duration-300"
                whileHover={{
                  boxShadow: "0px 0px 20px rgba(79, 70, 229, 0.2)",
                }}
              >
                <motion.div
                  className={`w-16 h-16 rounded-full ${feature.color} flex items-center justify-center text-white mb-6`}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: 0.1 * index,
                  }}
                >
                  {feature.icon}
                </motion.div>

                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Blogs Section */}
      <section id="blogs" className="relative py-20 text-white z-10" ref={blogsRef}>
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1 bg-indigo-600 bg-opacity-30 backdrop-blur-sm rounded-full text-sm font-semibold text-indigo-300 border border-indigo-500/30 mb-4"
            >
              Blogs
            </motion.div>
            <h2 className="text-4xl font-bold mb-4">Latest Insights</h2>
            <p className="max-w-2xl mx-auto text-gray-300">Dive into insightful articles about mental health and AI.</p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
          >
            {[
              {
                title: "Understanding Mental Health",
                description: "Explore the latest research on mental health and how AI can help.",
                image: "https://mpowerminds.com/assetOLD/images/paralysed-with-anxiety.png",
                link: "https://mpowerminds.com/blog",
                date: "June 15, 2024",
              },
              {
                title: "AI and Healthcare",
                description: "Discover the intersection of AI and healthcare for mental well-being.",
                image:
                  "https://publish-p57963-e462109.adobeaemcloud.com/adobe/dynamicmedia/deliver/dm-aid--68d23859-9d02-4d82-a94f-b507642615fd/sf-ai-healthcare.jpg?width=1920&preferwebp=true&quality=85",
                link: "https://www.snowflake.com/en/blog/present-future-of-healthcare-ai/",
                date: "May 28, 2024",
              },
              {
                title: "Wellness in the Digital Age",
                description: "How digital tools can enhance your mental health journey.",
                image:
                  "https://cdn.prod.website-files.com/6577870d4b8dd850816ffa4e/667c942b589cefe2b688cc63_Why%20Your%20Employee%20Engagement%20Survey%20Should%20Measure%20Digital%20Culture%20(2)%20(1).png",
                link: "https://www.digitalwellnessinstitute.com/blog",
                date: "April 10, 2024",
              },
            ].map((blog, index) => (
              <TiltCard
                key={blog.title}
                className="bg-black bg-opacity-30 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10"
              >
                <motion.div variants={cardVariants} custom={index} className="h-full flex flex-col">
                  <div className="relative h-48 overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60"
                      whileHover={{ opacity: 0.4 }}
                    />
                    <motion.img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    />
                    <div className="absolute top-4 left-4">
                      <motion.div
                        className="inline-block px-3 py-1 bg-indigo-600 bg-opacity-70 backdrop-blur-sm rounded-full text-xs font-semibold text-white"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 * index, duration: 0.5 }}
                        viewport={{ once: true }}
                      >
                        {blog.date}
                      </motion.div>
                    </div>
                  </div>

                  <div className="p-6 flex-grow flex flex-col">
                    <h3 className="text-xl font-bold mb-3">{blog.title}</h3>
                    <p className="text-gray-300 text-sm flex-grow">{blog.description}</p>

                    <a href={blog.link} target="_blank" rel="noreferrer" className="mt-4">
                      <motion.button
                        className="w-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full text-sm font-medium text-white flex items-center justify-center space-x-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span>Read More</span>
                        <ArrowRight className="h-4 w-4" />
                      </motion.button>
                    </a>
                  </div>
                </motion.div>
              </TiltCard>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about-us" className="relative py-20 text-white z-10" ref={aboutRef}>
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1 bg-indigo-600 bg-opacity-30 backdrop-blur-sm rounded-full text-sm font-semibold text-indigo-300 border border-indigo-500/30 mb-4"
            >
              About Us
            </motion.div>
            <h2 className="text-4xl font-bold mb-4">Our Mission</h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white bg-opacity-5 backdrop-blur-sm rounded-xl p-8 border border-white/10"
            >
              <p className="text-xl mb-6">
                Mind Matrics is a cutting-edge platform that combines AI and mental health research to predict, analyze,
                and provide support for mental well-being.
              </p>
              <p className="text-gray-300 mb-6">
                Our mission is to make mental health care accessible, predictive, and tailored to individual needs. We
                believe that by leveraging the power of artificial intelligence, we can help people understand their
                mental health better and take proactive steps towards improvement.
              </p>
              <p className="text-gray-300">
                Founded by a team of AI researchers and mental health professionals, Mind Matrics is committed to
                maintaining the highest standards of accuracy, privacy, and ethical use of technology in mental health
                care.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative h-[400px] w-full rounded-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-20 z-0"></div>

                <motion.div
                  className="absolute inset-0 flex items-center justify-center z-10"
                  animate={{
                    background: [
                      "radial-gradient(circle at center, rgba(79, 70, 229, 0.3) 0%, transparent 70%)",
                      "radial-gradient(circle at center, rgba(79, 70, 229, 0.1) 0%, transparent 50%)",
                      "radial-gradient(circle at center, rgba(79, 70, 229, 0.3) 0%, transparent 70%)",
                    ],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                >
                  <motion.div
                    className="text-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    <Brain className="h-24 w-24 text-indigo-300 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold mb-2">Mind Matrics</h3>
                    <p className="text-gray-300 max-w-md mx-auto">Empowering mental well-being through AI innovation</p>
                  </motion.div>
                </motion.div>

                {/* Animated circles */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-0 border-2 border-indigo-400 rounded-full opacity-20"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      duration: 2,
                      delay: i * 0.5,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatDelay: 1,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="relative py-20 text-white z-10">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1 bg-indigo-600 bg-opacity-30 backdrop-blur-sm rounded-full text-sm font-semibold text-indigo-300 border border-indigo-500/30 mb-4"
            >
              Our Team
            </motion.div>
            <h2 className="text-4xl font-bold mb-4">Meet the Minds Behind Mind Matrics</h2>
            <p className="max-w-2xl mx-auto text-gray-300">
              Our talented team of developers, researchers, and mental health professionals.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
          >
            {[
              {
                name: "Karan Jain",
                image:
                  "https://media.licdn.com/dms/image/v2/D4D03AQGNNwa8LPAo-g/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1727882710496?e=1747872000&v=beta&t=F1iMVxwMZux2FPbtEgMWnMnnwAT2CYduyRSq9XlS9bc",
                linkedin: "https://www.linkedin.com/in/karan-jain-161b60267/",
                github: "https://github.com/KaranJain09",
                role: "Data Scientist & Developer",
              },
              {
                name: "Yash Jain",
                image:
                  "https://media.licdn.com/dms/image/v2/D4D35AQE60HRgh3se3A/profile-framedphoto-shrink_400_400/profile-framedphoto-shrink_400_400/0/1722793355354?e=1744178400&v=beta&t=zqXfOhfFzRkgzhudaDhpU6WZTR8sFxfxqvl9naLLTYo",
                linkedin: "https://www.linkedin.com/in/yash-jain-4b7699283/",
                github: "https://github.com/YashJain999",
                role: "Data Scientist & Developer",
              },
              {
                name: "Urvi Joshi",
                image:
                  "https://media.licdn.com/dms/image/v2/D4D03AQGvrWMiZvkUgg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1732247969704?e=1747872000&v=beta&t=RuVZWr9qtmi7_yATxtxP2chWz7UzctSASRRyv2jWvHQ",
                linkedin: "https://www.linkedin.com/in/urvi-joshi-7b1974228/",
                github: "https://github.com/UrviJoshi24",
                role: "Data Scientist & Developerr",
              },
              {
                name: "Swapnil Joshi",
                image:
                  "https://media.licdn.com/dms/image/v2/D4D35AQEPqZFmNHy4TA/profile-framedphoto-shrink_400_400/profile-framedphoto-shrink_400_400/0/1692444027165?e=1744178400&v=beta&t=tYrm-pjNJcRtooDN_f6yp-Re7QCU49X-pMiZ3Qz-NCQ",
                linkedin: "https://www.linkedin.com/in/swapnil-joshi-84743122b/",
                github: "https://github.com/swapniljoshi123",
                role: "Data Scientist & Developer",
              },
            ].map((member, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                custom={index}
                className="bg-white bg-opacity-5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center"
                whileHover={{
                  boxShadow: "0px 0px 20px rgba(79, 70, 229, 0.2)",
                }}
              >
                <motion.div
                  className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-2 border-indigo-400"
                  whileHover={{ scale: 1.05 }}
                >
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={`Team Member ${member.name}`}
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                <p className="text-indigo-300 text-sm mb-4">{member.role}</p>

                <div className="flex justify-center space-x-4">
                  <motion.a
                    href={member.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="text-gray-300 hover:text-indigo-400 transition-colors"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Linkedin className="h-5 w-5" />
                  </motion.a>
                  <motion.a
                    href={member.github}
                    target="_blank"
                    rel="noreferrer"
                    className="text-gray-300 hover:text-indigo-400 transition-colors"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Github className="h-5 w-5" />
                  </motion.a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 text-white z-10">
        <div className="container mx-auto px-6">
          <motion.div
            className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 backdrop-blur-sm rounded-2xl p-12 border border-indigo-500/20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Mental Health Journey?</h2>
                <p className="text-gray-300 mb-8">
                  Join thousands of users who are already benefiting from our AI-powered mental health assessments. Sign
                  up today and take the first step towards better understanding your mental well-being.
                </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <RouterLink to="/signup">
                    <motion.button
                      className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-full shadow-lg flex items-center justify-center space-x-2"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      animate={{
                        boxShadow: [
                          "0px 0px 0px rgba(79, 70, 229, 0.2)",
                          "0px 0px 20px rgba(79, 70, 229, 0.4)",
                          "0px 0px 0px rgba(79, 70, 229, 0.2)",
                        ],
                      }}
                      transition={{
                        boxShadow: {
                          repeat: Number.POSITIVE_INFINITY,
                          duration: 2,
                        },
                      }}
                    >
                      <span>Sign Up Now</span>
                      <ArrowRight className="h-5 w-5" />
                    </motion.button>
                  </RouterLink>

                  <RouterLink to="/login">
                    <motion.button
                      className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-full flex items-center justify-center space-x-2"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <span>Login</span>
                    </motion.button>
                  </RouterLink>
                </div>
              </div>

              <motion.div
                className="relative hidden lg:block"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="relative h-[300px] flex items-center justify-center">
                  <motion.div
                    className="absolute w-64 h-64 rounded-full bg-indigo-500 opacity-20 blur-3xl"
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  />

                  <motion.div
                    className="absolute w-80 h-80 rounded-full border-4 border-indigo-400 opacity-20"
                    animate={{
                      rotate: 360,
                    }}
                    transition={{
                      duration: 20,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  />

                  <motion.div
                    className="relative z-10"
                    animate={{
                      y: [0, -20, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  >
                    <Brain className="h-32 w-32 text-indigo-300" />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 bg-black bg-opacity-70 text-white z-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="h-6 w-6 text-indigo-400" />
                <span className="text-xl font-bold">Mind Matrics</span>
              </div>
              <p className="text-gray-400 text-sm">
                Empowering mental well-being through AI innovation. Our platform combines cutting-edge technology with
                mental health expertise.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <ScrollLink
                    to="services"
                    smooth={true}
                    duration={800}
                    className="text-gray-400 hover:text-indigo-400 transition-colors cursor-pointer"
                  >
                    Services
                  </ScrollLink>
                </li>
                <li>
                  <ScrollLink
                    to="features"
                    smooth={true}
                    duration={800}
                    className="text-gray-400 hover:text-indigo-400 transition-colors cursor-pointer"
                  >
                    Features
                  </ScrollLink>
                </li>
                <li>
                  <ScrollLink
                    to="blogs"
                    smooth={true}
                    duration={800}
                    className="text-gray-400 hover:text-indigo-400 transition-colors cursor-pointer"
                  >
                    Blogs
                  </ScrollLink>
                </li>
                <li>
                  <ScrollLink
                    to="about-us"
                    smooth={true}
                    duration={800}
                    className="text-gray-400 hover:text-indigo-400 transition-colors cursor-pointer"
                  >
                    About Us
                  </ScrollLink>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
              <div className="flex space-x-4">
                <motion.a
                  href="#"
                  className="text-gray-400 hover:text-indigo-400 transition-colors"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </motion.a>
                <motion.a
                  href="#"
                  className="text-gray-400 hover:text-indigo-400 transition-colors"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                  </svg>
                </motion.a>
                <motion.a
                  href="#"
                  className="text-gray-400 hover:text-indigo-400 transition-colors"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </motion.a>
                <motion.a
                  href="#"
                  className="text-gray-400 hover:text-indigo-400 transition-colors"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </motion.a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400 text-sm">© {new Date().getFullYear()} Mind Matrics. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing;