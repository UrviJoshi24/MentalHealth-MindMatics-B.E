import { useState, useEffect } from "react";
import { Link as RouterLink ,useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaChevronUp, FaPlus, FaBook, FaLeaf, FaFeather } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import { BsJournalBookmark } from "react-icons/bs";
import { RiMentalHealthLine } from "react-icons/ri";
import Lottie from "react-lottie";
import confetti from "canvas-confetti";
import { useSearchParams } from 'react-router-dom';


const FoldersPage = () => {
    const [folderId, setFolderId] = useState(null);
    const [folders, setFolders] = useState([]);
    const [openFolder, setOpenFolder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showConfetti, setShowConfetti] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email');



    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.2,
                duration: 0.6
            }
        }
    };

    const folderVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" }
        },
        hover: {
            scale: 1.02,
            boxShadow: "0 10px 25px rgba(0, 128, 128, 0.1)",
            transition: { duration: 0.2 }
        }
    };

    const headerVariants = {
        hidden: { opacity: 0, y: -50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" }
        }
    };

    const buttonVariants = {
        hover: {
            scale: 1.05,
            boxShadow: "0 5px 15px rgba(0, 128, 128, 0.3)",
            transition: { duration: 0.3 }
        },
        tap: { scale: 0.95 }
    };

    useEffect(() => {
        const fetchFolders = async () => {
            setIsLoading(true);
            try {
                const response = await fetch("http://localhost:8000/diary/folders/");
                const data = await response.json();
                setFolders(data);
            } catch (error) {
                console.error("Error fetching folders:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFolders();
    }, []);

    // Toggle folder dropdown
    const toggleFolder = (folderId) => {
        setOpenFolder(openFolder === folderId ? null : folderId);
    };

    // Open diary for a selected folder
    const openDiary = (folderId) => {
        navigate(`/diary/folders/diaryentries/${folderId}`);
    };

    // Create a new folder with confetti animation
    const createNewFolder = async () => {
        const folderName = prompt("Enter a name for your new folder:");
        if (!folderName) return; // Stop if user cancels

        try {
            const response = await fetch("http://localhost:8000/diary/folders/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: folderName ,email: email }),
            });

            if (response.ok) {
                const newFolder = await response.json();

                // Show confetti animation
                triggerConfetti();

                // Add new folder with animation
                setFolders(prev => [...prev, newFolder]);

                setTimeout(() => {
                    navigate(`/diary/folders/diaryentries/${newFolder.id}`);
                }, 1500);
            } else {
                console.error("Failed to create folder.");
            }
        } catch (error) {
            console.error("Error creating folder:", error);
        }
    };

    // Trigger confetti animation
    const triggerConfetti = () => {
        setShowConfetti(true);
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#4ade80', '#22d3ee', '#60a5fa'],
        });
        setTimeout(() => setShowConfetti(false), 2000);
    };

    // Set folder ID when selecting a folder
    const handleFolderSelect = (id) => {
        setFolderId(id);
    };

    // Calculate mood score color
    const getMoodColor = (score) => {
        if (score < 5) return "text-green-500";
        if (score < 10) return "text-yellow-500";
        return "text-red-500";
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-teal-50 via-blue-50 to-purple-50 flex flex-col items-center py-10 px-5 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute top-20 left-10 w-32 h-32 bg-teal-200 rounded-full blur-3xl opacity-20"
                    animate={{
                        x: [0, 20, 0],
                        y: [0, 30, 0],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute bottom-40 right-10 w-40 h-40 bg-blue-200 rounded-full blur-3xl opacity-20"
                    animate={{
                        x: [0, -30, 0],
                        y: [0, -20, 0],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute top-1/3 right-1/4 w-24 h-24 bg-purple-200 rounded-full blur-3xl opacity-20"
                    animate={{
                        x: [0, 25, 0],
                        y: [0, -15, 0],
                    }}
                    transition={{
                        duration: 18,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </div>

            <motion.div
                className="w-full max-w-3xl bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-blue-100 relative z-10"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <motion.header
                    className="text-center mb-10"
                    variants={headerVariants}
                >
                    <div className="relative ">
                        <motion.div
                            className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-2xl text-yellow-400"
                            animate={{
                                scale: [1, 1.2, 1],
                                rotate: [0, 5, -5, 0]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            ✨
                        </motion.div>
                        <h1 className="text-4xl font-bold mb-3 flex items-center justify-center gap-3">
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 5, repeat: Infinity }}
                            >
                                <FaLeaf className="text-teal-600" />
                            </motion.div>
                            <span className="bg-gradient-to-r from-teal-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                                My Diary Collection
                            </span>
                        </h1>
                    </div>
                    <RouterLink to={`/home`} className="absolute up-0 left-8">
                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)" }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full mb-8 flex items-center justify-center gap-3 py-3 px-6 text-white bg-gradient-to-r from-teal-500 via-blue-500 to-purple-500 rounded-xl shadow-md transition-all duration-300"
                            >
                                Home
                            </motion.button>
                        </RouterLink>
                    <motion.p
                        className="text-gray-600 italic"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 1 }}
                    >
                        A peaceful place for your thoughts and feelings
                    </motion.p>
                </motion.header>

                {/* New Folder Button */}
                <motion.button
                    onClick={createNewFolder}
                    className="w-full mb-8 flex items-center justify-center gap-3 py-5 px-6 text-white bg-gradient-to-r from-teal-500 via-blue-500 to-purple-500 rounded-xl shadow-md transition-all duration-300"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                >
                    <motion.div
                        animate={{ rotate: [0, 180] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                    >
                        <FaPlus className="text-xl" />
                    </motion.div>
                    <span className="font-medium text-lg">Create New Diary Collection</span>
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.7, 1, 0.7]
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        <HiSparkles className="text-yellow-200 text-xl" />
                    </motion.div>
                </motion.button>

                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <motion.div
                            className="w-16 h-16 border-4 border-teal-200 border-t-teal-600 rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        ></motion.div>
                    </div>
                ) : (
                    <motion.div
                        className="space-y-5"
                        variants={containerVariants}
                    >
                        {folders.length > 0 ? (
                            folders.map((folder, index) => (
                                <motion.div
                                    key={folder.id}
                                    className="bg-white rounded-xl shadow-sm border border-blue-50 overflow-hidden"
                                    variants={folderVariants}
                                    whileHover="hover"
                                    custom={index}
                                    layout
                                >
                                    {/* Folder Header */}
                                    <div
                                        className={`flex justify-between items-center cursor-pointer p-5 ${openFolder === folder.id
                                                ? "bg-gradient-to-r from-teal-50 via-blue-50 to-teal-100"
                                                : "bg-gradient-to-r from-blue-50 to-teal-50 hover:from-blue-100 hover:to-teal-100"
                                            } transition-colors duration-500`}
                                        onClick={() => toggleFolder(folder.id)}
                                    >
                                        <div className="flex items-center gap-4">
                                            <motion.div
                                                className="text-teal-600 bg-teal-100 p-3 rounded-lg shadow-inner"
                                                whileHover={{ rotate: 10 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <BsJournalBookmark className="text-xl" />
                                            </motion.div>
                                            <div>
                                                <h2 className="text-xl font-medium text-gray-800">{folder.name}</h2>
                                                {folder.cumulative_depression_score !== null && (
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <div className="flex items-center">
                                                            <RiMentalHealthLine className="text-blue-500 mr-1" />
                                                            <span className={getMoodColor(folder.cumulative_depression_score)}>
                                                                D: {folder.cumulative_depression_score}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <RiMentalHealthLine className="text-yellow-500 mr-1" />
                                                            <span className={getMoodColor(folder.cumulative_anxiety_score)}>
                                                                A: {folder.cumulative_anxiety_score}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <RiMentalHealthLine className="text-purple-500 mr-1" />
                                                            <span className={getMoodColor(folder.cumulative_stress_score)}>
                                                                S: {folder.cumulative_stress_score}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <motion.span
                                            className="text-gray-500 text-xl bg-white/50 p-2 rounded-full"
                                            whileHover={{ rotate: openFolder === folder.id ? -180 : 180, scale: 1.1 }}
                                            animate={{ rotate: openFolder === folder.id ? 180 : 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <FaChevronDown className={openFolder === folder.id ? "text-teal-600" : ""} />
                                        </motion.span>
                                    </div>

                                    {/* Show options when folder is open */}
                                    <AnimatePresence>
                                        {openFolder === folder.id && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                                className="overflow-hidden"
                                            >
                                                <div className="p-5 bg-gradient-to-b from-white to-blue-50">
                                                    <motion.div
                                                        className="bg-white rounded-lg p-6 shadow-inner border border-blue-100"
                                                        initial={{ y: 20, opacity: 0 }}
                                                        animate={{ y: 0, opacity: 1 }}
                                                        transition={{ delay: 0.1 }}
                                                    >
                                                        <p className="text-gray-600 mb-5 text-center flex items-center justify-center gap-2">
                                                            <FaFeather className="text-teal-500" />
                                                            <span>Open this collection to view and write in your Diary</span>
                                                        </p>
                                                        <motion.button
                                                            className="w-full py-4 px-6 text-white bg-gradient-to-r from-blue-500 via-teal-500 to-blue-500 rounded-lg shadow-md transition-all duration-300 flex items-center justify-center gap-3 group overflow-hidden relative"
                                                            onClick={() => openDiary(folder.id)}
                                                            whileHover={{
                                                                scale: 1.03,
                                                                boxShadow: "0 10px 25px rgba(0, 128, 128, 0.3)",
                                                            }}
                                                            whileTap={{ scale: 0.97 }}
                                                        >
                                                            <motion.div
                                                                className="absolute inset-0 bg-gradient-to-r from-blue-600 via-teal-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                                                initial={{ backgroundPosition: "0% 0%" }}
                                                                animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
                                                                transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                                                            />
                                                            <motion.div
                                                                animate={{ rotate: [0, 10, -10, 0] }}
                                                                transition={{ duration: 5, repeat: Infinity }}
                                                                className="relative"
                                                            >
                                                                <FaBook className="text-xl" />
                                                            </motion.div>
                                                            <span className="font-medium text-lg relative">Open Diary</span>
                                                            <motion.div
                                                                className="absolute right-4 opacity-0 group-hover:opacity-100"
                                                                initial={{ x: -10 }}
                                                                whileHover={{ x: 0 }}
                                                                transition={{ duration: 0.3 }}
                                                            >
                                                                <HiSparkles className="text-yellow-200" />
                                                            </motion.div>
                                                        </motion.button>
                                                    </motion.div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))
                        ) : (
                            <motion.div
                                className="text-center py-16 bg-white/80 rounded-xl border border-blue-100"
                                variants={folderVariants}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <motion.div
                                    className="text-teal-600 text-6xl mb-5 flex justify-center"
                                    animate={{
                                        y: [0, -10, 0],
                                        rotate: [0, 5, -5, 0]
                                    }}
                                    transition={{ duration: 5, repeat: Infinity }}
                                >
                                    <FaLeaf className="opacity-60" />
                                </motion.div>
                                <motion.p
                                    className="text-gray-500 text-lg"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    Your Diary collection is empty.
                                </motion.p>
                                <motion.p
                                    className="text-gray-500 mt-2"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.6 }}
                                >
                                    Create your first folder to begin your Diarying journey.
                                </motion.p>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </motion.div>

            <motion.footer
                className="mt-8 text-center text-gray-500 text-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
            >
                <p className="flex items-center justify-center gap-2">
                    <span>Your safe space for personal reflection</span>
                    <motion.span
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 5, -5, 0]
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                    >
                        💙
                    </motion.span>
                </p>
            </motion.footer>
        </div>
    );
};

export default FoldersPage;