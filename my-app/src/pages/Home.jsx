import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserDetails } from "../api"; // Importing the named export
import { Link as ScrollLink } from "react-scroll"; // Alias for Link from react-scroll
import { Link as RouterLink } from "react-router-dom"; // Alias for Link from react-router-dom
import textimage from "../assets/images/textimageee.jpg";
import audioimage from "../assets/images/audioimageee.jpg";
import videoimage from "../assets/images/videoimage.jpg";
import diaryimage from "../assets/images/diaryimage.jpg";
import bgimage from "../assets/images/bgimg.jpg";

const Home = () => {
  const [clickedCardIndex, setClickedCardIndex] = useState(null); // To track the clicked card
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  useEffect(() => {
    // Fetch user details when the component mounts
    const getUserDetails = async () => {
      try {
        const userDetails = await fetchUserDetails();
        setUser(userDetails); // Set the user details in the state
      } catch (error) {
        console.error("Failed to fetch user details", error);
      }
    };

    getUserDetails();
  }, []);
  if (!user) {
    return <div>Session Timed Out Please Login Again</div>;  
  }

  const card = [
    {
      title: "Learn about your mental health through Questionnaire",
      background: `url(${textimage})`, // Updated image path
      customStyle: { bottom: "70px", left: "-70px" },
      route: "/questionnaire",
    },
    {
      title: "Explore your mental health with Audio testing",
      background: `url(${audioimage})`,
      customStyle: { bottom: "60px", left: "-70px" },
      route: "/audio-testing",
    },
    {
      title: "Use VIDEO TESTING for better insights",
      background: `url(${videoimage})`,
      customStyle: { bottom: "30px", left: "-40px" },
      route: "/video-based-detection",
    },
    {
      title: "Mindful Moments: Your Personal Diary",
      background: `url(${diaryimage})`,
      customStyle: { bottom: "10px", left: "-50px" },
      route: "/diary",
    },
  ];

  const handleClick = (index, route) => {
    setClickedCardIndex(index);
    setTimeout(() => {
      navigate(route); // Navigate to the route after the animation
    }, 1000); // Delay based on the animation duration (1 second)
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-fixed bg-center"
      style={{ backgroundImage: `url(${bgimage})` }}
    >
      <nav className="bg-black bg-opacity-50 p-4 z-50">
        {/* Fixed Title */}
        <div className="fixed top-0 left-0 right-0 text-center bg-black bg-opacity-50 p-2 z-50">
          <p className="text-4xl font-extrabold text-white transition-transform transform hover:scale-110 font-sans">
            Mind Matrics
          </p>
        </div>
        {/* Scrollable Navigation Links */}
        <div className="pt-10 flex justify-between items-center">
          <ul className="flex space-x-8 text-white">
            {["Services", "Features", "Blogs", "About Us"].map((item) => (
              <li key={item}>
                <ScrollLink
                  to={item.toLowerCase()} // Match the section id
                  smooth={true} // Smooth scrolling
                  duration={500} // Duration of the scroll
                  className="hover:scale-105 transition duration-300 cursor-pointer"
                  activeClass="active" // Optional: for styling the active link
                  spy={true} // Enables active class for the current section
                  offset={-70} // Adjust based on your navbar height
                >
                  {item}
                </ScrollLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center space-x-4">
            <h1 className="text-lg font-semibold text-white">Welcome, {user.username}!</h1>
            <RouterLink to="/logout">
              <button className="px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300">
                Log Out
              </button>
            </RouterLink>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 p-4 mt-24 ">
        {card.map((card, index) => (
          <div
            key={index}
            className={`relative shadow-lg rounded-lg p-6 flex items-center justify-center h-[75vh] text-white overflow-hidden cursor-pointer transition-transform duration-300 transform ${
              clickedCardIndex === null
                ? "hover:scale-105 hover:shadow-2xl"
                : ""
            }`}
            style={{
              backgroundImage: card.background,
              backgroundSize: "cover",
              // backgroundPosition: card.customStyle.backgroundPosition,
              transition:
                "background-position 1s ease-in-out, opacity 1s ease-in-out",
              backgroundPosition:
                clickedCardIndex === index ? "left" : "center",
              opacity: clickedCardIndex === index ? 0 : 1,
            }}
            onClick={() => handleClick(index, card.route)}
          >
            {/* Right Triangle Inside the Card */}
            <div
              className="absolute top-25 w-0 h-0 border-l-[300px] border-l-transparent border-r-[280px] border-r-transparent border-b-[40vh] border-b-[rgba(255, 255, 255, 0.5)] border-b-white"
              style={{
                transform:
                  clickedCardIndex === index
                    ? "translateX(-100%) rotate(-90deg)"
                    : "rotate(-90deg)",
                left: "180px",
                transition: "transform 1s ease-in-out",
                opacity: 0.5,
              }}
            >
              {/* Card Title */}
              <h2
                className="relative z-10 text-xs md:text-3xl lg:text-2xl font-semibold text-center leading-relaxed tracking-wide drop-shadow-lg"
                style={{
                  ...card.customStyle,
                  color: "black",
                  textShadow: "1px 1px 2px rgba(0, 0, 0, 0.9)",
                  transform: "rotate(90deg)",
                  transformOrigin: "left bottom",
                  whiteSpace: "normal",
                  width: "250px",
                  textAlign: "center",
                }}
              >
                {card.title}
              </h2>
            </div>
          </div>
        ))}
      </main>
      {/* Services Section */}
      <section
        id="services"
        className="py-20 bg-black bg-opacity-50 text-center text-white"
      >
        <h2 className="text-4xl font-bold mb-12">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 px-10">
          {[
            {
              title: "Mental Health Prediction via Questionnaires",
              description:
                "Users answer a series of multiple-choice questions, and predictions are made based on their responses.",
              image:
                "https://media.istockphoto.com/id/1398462038/photo/online-exam-or-test.jpg?s=612x612&w=0&k=20&c=hvaH_2oA0Dm-tpQ8T5JBF_39QF3xhpic38Yi2AngaCE=",
            },
            {
              title: "Voice and Text Input Analysis",
              description:
                "Users speak into the system, where their voice and text inputs are analyzed to predict mental health using CNN.",
              image:
                "https://d1g9yur4m4naub.cloudfront.net/images/Article_Images/ImageForArticle_671_16397429374359201.jpg",
            },
            {
              title: "Video and Expression Analysis",
              description:
                "Users provide video input, which is analyzed for facial expressions alongside audio and text for predictions.",
              image:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQB96xhpCsZbVAutLnUGoRSzOOVCyE7Quagyw&s",
            },
            {
              title: "Diary Maintenance for Predictions",
              description:
                "Users maintain a diary for five days detailing their daily lives, and predictions are made based on their entries.",
              image:
                "https://storage.googleapis.com/fplswordpressblog/2023/04/What-are-Diary-Studies-Meaning-How-and-When-to-Conduct-It.jpg",
            },
          ].map((service) => (
            <div
              key={service.title}
              className="bg-white bg-opacity-20 p-6 rounded-lg hover:scale-105 transition transform duration-300"
            >
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h3 className="text-2xl font-semibold mb-4">{service.title}</h3>
              <p className="text-md">{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-20 bg-black bg-opacity-50 text-white"
      >
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold">Features</h2>
        </div>
        <div className="flex flex-wrap justify-center gap-10 px-10">
          {[
            {
              title: "User-Friendly Interface",
              description:
                "Our intuitive interface ensures that users can navigate the platform with ease, making mental health assessments simple and efficient.",
            },
            {
              title: "Multi-Model Prediction",
              description:
                "Leverage various AI models to provide accurate predictions based on different input methods, including questionnaires, voice, and video analysis.",
            },
            {
              title: "Report Generation",
              description:
                "Receive comprehensive reports detailing your mental health predictions, trends, and personalized recommendations, empowering you to take informed steps.",
            },
            {
              title: "Well-Trained Models",
              description:
                "Our AI models are meticulously trained using diverse datasets to ensure reliability and accuracy in predictions, making your mental health journey more effective.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="w-full md:w-1/5 bg-white bg-opacity-20 p-6 rounded-lg hover:scale-105 transition transform duration-300"
            >
              <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Blogs Section */}
      <section id="blogs" className="py-20 bg-black bg-opacity-50 text-white">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold">Blogs</h2>
          <p className="mt-4 text-lg">
            Dive into insightful articles about mental health and AI.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 px-10">
          {[
            {
              title: "Understanding Mental Health",
              description:
                "Explore the latest research on mental health and how AI can help.",
              image:
                "https://mpowerminds.com/assetOLD/images/paralysed-with-anxiety.png",
              link: "https://mpowerminds.com/blog",
            },
            {
              title: "AI and Healthcare",
              description:
                "Discover the intersection of AI and healthcare for mental well-being.",
              image:
                "https://publish-p57963-e462109.adobeaemcloud.com/adobe/dynamicmedia/deliver/dm-aid--68d23859-9d02-4d82-a94f-b507642615fd/sf-ai-healthcare.jpg?width=1920&preferwebp=true&quality=85",
              link: "https://www.snowflake.com/en/blog/present-future-of-healthcare-ai/",
            },
            {
              title: "Wellness in the Digital Age",
              description:
                "How digital tools can enhance your mental health journey.",
              image:
                "https://cdn.prod.website-files.com/6577870d4b8dd850816ffa4e/667c942b589cefe2b688cc63_Why%20Your%20Employee%20Engagement%20Survey%20Should%20Measure%20Digital%20Culture%20(2)%20(1).png",
              link: "https://www.digitalwellnessinstitute.com/blog",
            },
          ].map((blog) => (
            <div
              key={blog.title}
              className="bg-white bg-opacity-20 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300"
            >
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-4">{blog.title}</h3>
                <p>{blog.description}</p>
                <a
                  href={blog.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md transition duration-300 hover:bg-indigo-700"
                >
                  Read More
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About Us Section */}
      <section
        id="about us"
        className="py-20 bg-black bg-opacity-50 text-center text-white"
      >
        <h2 className="text-4xl font-bold mb-4">About Us</h2>
        <p className="max-w-2xl mx-auto mb-8">
          Mind Matrics is a cutting-edge platform that combines AI and mental
          health research to predict, analyze, and provide support for mental
          well-being. Our mission is to make mental health care accessible,
          predictive, and tailored to individual needs.
        </p>
      </section>

      {/* Footer */}
      <footer id="footer" className="py-10 bg-gray-800 text-white text-center">
        <h3 className="text-2xl font-bold mb-4">Our Team</h3>
        <div className="team-members grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-10">
          {[
            {
              name: "Karan Jain",
              image:
                "https://media.licdn.com/dms/image/v2/D4D03AQGNNwa8LPAo-g/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1727882710471?e=1733356800&v=beta&t=8GyOLs2-ENtwxjsFOT5N17AMzssFGPCprQ4Q7_q1jb4",
              linkedin: "https://www.linkedin.com/in/karan-jain-161b60267/",
              github: "https://github.com/KaranJain09",
            },
            {
              name: "Yash Jain",
              image:
                "https://media.licdn.com/dms/image/v2/D4D35AQE60HRgh3se3A/profile-framedphoto-shrink_100_100/profile-framedphoto-shrink_100_100/0/1722793355327?e=1728489600&v=beta&t=qp61ALA0CuCqzzEIwMgQXA2sqrM8-DIx9uMb-podvLk",
              linkedin: "https://www.linkedin.com/in/yash-jain-4b7699283/",
              github: "https://github.com/YashJain999",
            },
            {
              name: "Urvi Joshi",
              image:
                "https://media.licdn.com/dms/image/v2/D4D03AQE7E22HWyxCTw/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1690904086179?e=1733356800&v=beta&t=KQ0C7xYQsqaoI-zcBfMqz27yhYa8mn0JpYCQk90ZPOM",
              linkedin: "https://www.linkedin.com/in/urvi-joshi-7b1974228/",
              github: "https://github.com/UrviJoshi24",
            },
            {
              name: "Swapnil Joshi",
              image:
                "https://media.licdn.com/dms/image/v2/D4D35AQEPqZFmNHy4TA/profile-framedphoto-shrink_100_100/profile-framedphoto-shrink_100_100/0/1692444027165?e=1728489600&v=beta&t=VXktZFu4WSVxWPzmW_ZegGi5RSF_IBfZM9lA8fC3kuk",
              linkedin: "https://www.linkedin.com/in/swapnil-joshi-84743122b/",
              github: "https://github.com/swapniljoshi123",
            },
          ].map((member, index) => (
            <div key={index} className="team-member text-center">
              <img
                src={member.image}
                alt={`Team Member ${member.name}`}
                className="w-24 h-24 rounded-full mx-auto mb-4"
              />
              <h4 className="text-xl font-semibold mb-2">{member.name}</h4>
              <div className="flex justify-center space-x-4">
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500 hover:text-gray-400"
                >
                  LinkedIn
                </a>
                <a
                  href={member.github}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500 hover:text-gray-400"
                >
                  GitHub
                </a>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-6">© 2024 Mind Matrics. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
