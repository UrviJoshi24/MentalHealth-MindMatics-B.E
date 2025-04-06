import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faChevronLeft, faChevronRight, faSave, faBook, faPenFancy } from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import { Link as RouterLink } from 'react-router-dom';


const Diary = () => {
    const { folderId } = useParams();
    const navigate = useNavigate();
    const [entries, setEntries] = useState([]);
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [entryContent, setEntryContent] = useState("");
    const [diaryName, setDiaryName] = useState("");
    const [currentDateTime, setCurrentDateTime] = useState(new Date().toLocaleString());
    const [currentPage, setCurrentPage] = useState(0);
    const [isSaving, setIsSaving] = useState(false);
    const [showSavedNotification, setShowSavedNotification] = useState(false);
    const textareaRef = useRef(null);

    // Split text into pages (each page has 10 lines)
    const linesPerPage = 10;
    const charactersPerLine = 60;

    const getPages = (text) => {
        if (!text) return [""];

        // Split by paragraphs (double newlines)
        const paragraphs = text.split(/\n\n+/);
        const pages = [];
        let currentPageContent = [];
        let currentLineCount = 0;

        paragraphs.forEach(paragraph => {
            // Estimate line count for paragraph
            const estimatedLines = Math.ceil(paragraph.length / 80) + 1;

            if (currentLineCount + estimatedLines > linesPerPage) {
                // Start new page if this paragraph would overflow
                if (currentPageContent.length > 0) {
                    pages.push(currentPageContent.join('\n\n'));
                    currentPageContent = [];
                    currentLineCount = 0;
                }
            }

            currentPageContent.push(paragraph);
            currentLineCount += estimatedLines;

            // If exactly at page limit, start new page
            if (currentLineCount >= linesPerPage) {
                pages.push(currentPageContent.join('\n\n'));
                currentPageContent = [];
                currentLineCount = 0;
            }
        });

        // Add final page if there's content left
        if (currentPageContent.length > 0) {
            pages.push(currentPageContent.join('\n\n'));
        }

        return pages.length > 0 ? pages : [""];
    };

    const pages = getPages(entryContent);
    const totalPages = pages.length;

    // Update current time
    useEffect(() => {
        setCurrentDateTime(new Date().toLocaleString());
        const timer = setInterval(() => {
            setCurrentDateTime(new Date().toLocaleString());
        }, 60000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        // Fetch diary name when component loads
        fetch(`http://localhost:8000/diary/folders/${folderId}/`)
            .then(response => response.json())
            .then(data => {
                setDiaryName(data.name);
            })
            .catch(error => console.error("Error fetching diary name:", error));
    }, [folderId]);

    useEffect(() => {
        if (!folderId) {
            console.error("Invalid folder ID, redirecting...");
            navigate("/diary/folders");
            return;
        }

        const fetchEntries = async () => {
            try {
                const response = await fetch(`http://localhost:8000/diary/folders/${folderId}/entries/`);
                const data = await response.json();

                if (Array.isArray(data) && data.length > 0) {
                    const formattedEntries = data.map(entry => ({
                        ...entry,
                        formattedDateTime: new Date(entry.created_at).toLocaleString(),
                    }));

                    setEntries(formattedEntries);
                    setSelectedEntry(formattedEntries[0]);
                    setEntryContent(formattedEntries[0].content || "");
                } else {
                    const newEntries = Array.from({ length: 5 }, (_, index) => ({
                        title: `Entry ${index + 1}`,
                        folder: folderId,
                        id: index,
                        content: "",
                        date: new Date().toISOString().split("T")[0],
                        formattedDateTime: new Date().toLocaleString(),
                    }));

                    setEntries(newEntries);
                    setSelectedEntry(newEntries[0]);
                }
            } catch (error) {
                console.error("Error fetching diary entries:", error);
            }
        };

        fetchEntries();
    }, [folderId, navigate]);

    // Reset to first page when changing entries
    useEffect(() => {
        setCurrentPage(0);
    }, [selectedEntry]);

    const fetchDASScores = async (entryId) => {
        try {
            const response = await fetch(`http://localhost:8000/diary/entries/${entryId}/fetch-das/`, {
                method: "GET",
            });

            if (response.ok) {
                const result = await response.json();
                console.log("DAS Scores:", result);
            } else {
                console.error("Failed to fetch DAS scores");
            }
        } catch (error) {
            console.error("Error fetching DAS scores:", error);
        }
    };

    const handleSave = async () => {
        if (!selectedEntry) return;

        try {
            setIsSaving(true);
            let response;
            const payload = {
                content: entryContent,
                title: selectedEntry.title || `Entry ${selectedEntry.id}`,
                folder: selectedEntry.folder || folderId,
            };

            let newEntry = selectedEntry;
            console.log("Saving diary entry:", payload);

            if (!selectedEntry.id || selectedEntry.id === 0) {
                // New entry → Use POST
                response = await fetch("http://localhost:8000/diary/entries/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                if (response.ok) {
                    newEntry = await response.json();
                    setEntries([...entries, newEntry]);
                    setSelectedEntry(newEntry);

                    // Call DAS Scores API after saving
                    fetchDASScores(newEntry.id);
                }
            } else {
                // Existing entry → Use PUT
                response = await fetch(`http://localhost:8000/diary/entries/${selectedEntry.id}/`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                if (response.ok) {
                    const updatedEntries = entries.map(entry =>
                        entry.id === selectedEntry.id ? { ...entry, content: entryContent } : entry
                    );
                    setEntries(updatedEntries);
                    // Call DAS Scores API after updating
                    fetchDASScores(selectedEntry.id);
                }
            }

            // Check if all entries in the folder have content
            const allEntriesFilled = entries.every((entry) => entry.content && entry.content.trim() !== "");
            if (allEntriesFilled) {
                console.log("All diary entries have content. Calculating cumulative score...");
                calculateCumulativeDAS(folderId);
            } else {
                console.log("Not all diary entries are filled. Cumulative score calculation skipped.");
            }

            setIsSaving(false);
            setShowSavedNotification(true);
            setTimeout(() => setShowSavedNotification(false), 2000);
        } catch (error) {
            console.error("Error saving entry:", error);
            setIsSaving(false);
        }
    };

    // Function to trigger cumulative DAS calculation
    const calculateCumulativeDAS = async (folderId) => {
        try {
            const response = await fetch(`http://localhost:8000/diary/folders/${folderId}/calculate-cumulative/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });

            if (response.ok) {
                const result = await response.json();
                console.log("Cumulative DAS Scores:", result);
            } else {
                console.error("Failed to calculate cumulative DAS scores");
            }
        } catch (error) {
            console.error("Error calculating cumulative DAS scores:", error);
        }
    };

    const handleContentChange = (e) => {
        setEntryContent(e.target.value);
    };

    const nextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const updateCurrentPageContent = (e) => {
        const newPages = [...pages];
        newPages[currentPage] = e.target.value;
        setEntryContent(newPages.join('\n'));
    };

    // Animations variants
    const pageVariants = {
        initial: {
            opacity: 0,
            scale: 0.95,
        },
        in: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.3, ease: "easeOut" }
        },
        out: {
            opacity: 0,
            scale: 1.05,
            transition: { duration: 0.2, ease: "easeIn" }
        }
    };

    const buttonHoverVariants = {
        hover: {
            scale: 1.05,
            boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
            transition: { duration: 0.2 }
        },
        tap: {
            scale: 0.95,
            transition: { duration: 0.1 }
        }
    };

    const pageCountVariants = {
        animate: {
            opacity: [0, 1],
            y: [5, 0],
            transition: { duration: 0.3 }
        }
    };

    const tabVariants = {
        selected: {
            y: 4,
            backgroundColor: "rgba(254, 243, 199, 0.9)",
            boxShadow: "0px -2px 8px rgba(0,0,0,0.05)",
            transition: { duration: 0.3, ease: "easeOut" }
        },
        notSelected: {
            y: 0,
            backgroundColor: "rgba(255, 251, 235, 0.8)",
            transition: { duration: 0.3, ease: "easeOut" }
        }
    };

    return (
        <MotionConfig transition={{ duration: 0.4 }}>
            <div className="h-screen w-screen bg-cover bg-center relative overflow-hidden"
                style={{
                    backgroundImage: "url('https://cdn.pixabay.com/photo/2016/03/01/11/07/paper-1230086_1280.jpg')",
                    backgroundSize: 'cover',
                    fontFamily: "'Noto Serif', serif" // Using a serif font for the entire component
                }}>

                {/* Vintage texture overlay */}
                <div className="absolute inset-0 bg-amber-900/5 mix-blend-overlay pointer-events-none"></div>

                {/* Date/Time Display with animation */}
                <motion.div
                    className="absolute top-8 right-8 text-amber-900 font-serif"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                >
                    <span className="backdrop-blur-sm bg-white/30 px-3 py-1 rounded-md shadow-sm">
                        {currentDateTime}
                    </span>
                </motion.div>

                {/* Title Display with animation */}
                <motion.div
                    className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                >
                    <h1 className="text-3xl font-bold text-amber-900 font-serif flex items-center justify-center">
                        <FontAwesomeIcon icon={faBook} className="mr-3 text-amber-800" />
                        <span className="italic">{diaryName || "My Diary"}</span>
                    </h1>
                </motion.div>

                {/* Entries Navigation with animations */}
                <div className="absolute top-24 left-0 right-0 flex justify-center">
                    <motion.div
                        className="flex space-x-4"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                    >
                        {entries.map((entry, index) => {
                            // Use the first entry's formattedDateTime as the base date
                            const baseDate = new Date(entries[0].formattedDateTime);
                            // Remove the time portion
                            const cleanBaseDate = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());
                            // Clone the base date and add 'index' days
                            const incrementedDate = new Date(cleanBaseDate);
                            incrementedDate.setDate(cleanBaseDate.getDate() + index);
                            // Format the date as M/D/YYYY
                            const formattedDate = `${incrementedDate.getDate()}/${incrementedDate.getMonth() + 1}/${incrementedDate.getFullYear()}`;

                            return (
                                <motion.button
                                    key={index}
                                    className="text-center py-2 px-6 rounded-t-lg font-serif"
                                    variants={tabVariants}
                                    initial="notSelected"
                                    animate={selectedEntry?.id === entry.id ? "selected" : "notSelected"}
                                    whileHover={{
                                        backgroundColor:
                                            selectedEntry?.id === entry.id
                                                ? "rgba(254, 243, 199, 1)"
                                                : "rgba(255, 251, 235, 0.9)"
                                    }}
                                    onClick={() => {
                                        setSelectedEntry(entry);
                                        setEntryContent(entry.content || "");
                                        setCurrentPage(0);
                                    }}
                                >
                                    <div className="flex flex-col">
                                        <span className="font-medium text-amber-900">
                                            Day {index + 1}
                                        </span>
                                        <span className="text-xs text-amber-700">
                                            {formattedDate}
                                        </span>
                                    </div>
                                </motion.button>
                            );
                        })}

                    </motion.div>
                </div>

                {/* Main Content Area with page turning animation */}
                <motion.div
                    className="absolute top-44 right-10 left-10 bottom-24 rounded-lg shadow-lg bg-amber-50/60 backdrop-blur-sm"
                    style={{ maxWidth: "1000px", margin: "0 auto" }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.7 }}
                >
                    {/* Page decoration - faux binding */}
                    <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-amber-800/20 to-transparent"></div>

                    {/* Page number with animation */}
                    <motion.div
                        key={currentPage}
                        variants={pageCountVariants}
                        animate="animate"
                        className="absolute bottom-4 right-4 text-xs text-amber-800/70 font-serif italic"
                    >
                        Page {currentPage + 1} of {Math.max(1, totalPages)}
                    </motion.div>

                    {/* Lined paper effect - exactly 10 lines with more spacing */}
                    <div className="absolute inset-8 pointer-events-none">
                        {Array(linesPerPage).fill().map((_, i) => (
                            <motion.div
                                key={i}
                                className="w-full h-px bg-amber-800 opacity-30 absolute"
                                style={{ top: `${(i + 1) * 3}rem` }}
                                initial={{ opacity: 0, scaleX: 0 }}
                                animate={{ opacity: 0.3, scaleX: 1 }}
                                transition={{ delay: 0.9 + (i * 0.03), duration: 0.5 }}
                            />
                        ))}
                    </div>

                    {/* Text content with page turning animation */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentPage}
                            className="absolute inset-0"
                            variants={pageVariants}
                            initial="initial"
                            animate="in"
                            exit="out"
                        >
                            <textarea
                                ref={textareaRef}
                                className="w-full h-full bg-transparent text-amber-900 resize-none font-serif text-xl outline-none border-none"
                                value={pages[currentPage]}
                                onChange={updateCurrentPageContent}
                                placeholder="Write your thoughts here..."
                                style={{
                                    lineHeight: "3rem",
                                    background: "transparent",
                                    padding: "2rem 3rem",
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    boxSizing: "border-box",
                                    whiteSpace: "pre-wrap",
                                    overflowWrap: "break-word",
                                    wordBreak: "normal",
                                    width: "100%",
                                }}
                            />
                        </motion.div>
                    </AnimatePresence>

                    {/* Page Navigation with animation */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-6">
                        <motion.button
                            onClick={prevPage}
                            disabled={currentPage === 0}
                            className={`p-3 rounded-full ${currentPage === 0 ? 'text-gray-400' : 'text-amber-800 bg-amber-100/50 hover:bg-amber-200/70'}`}
                            whileTap={currentPage !== 0 ? { scale: 0.9 } : {}}
                            whileHover={currentPage !== 0 ? { scale: 1.1, backgroundColor: "rgba(254, 215, 170, 0.7)" } : {}}
                        >
                            <FontAwesomeIcon icon={faChevronLeft} />
                        </motion.button>

                        <motion.div
                            className="px-3 py-1 rounded-full bg-amber-100/60 text-amber-800 font-serif"
                            whileHover={{ scale: 1.05 }}
                        >
                            {currentPage + 1} / {Math.max(1, totalPages)}
                        </motion.div>

                        <motion.button
                            onClick={nextPage}
                            disabled={currentPage >= totalPages - 1}
                            className={`p-3 rounded-full ${currentPage >= totalPages - 1 ? 'text-gray-400' : 'text-amber-800 bg-amber-100/50 hover:bg-amber-200/70'}`}
                            whileTap={currentPage < totalPages - 1 ? { scale: 0.9 } : {}}
                            whileHover={currentPage < totalPages - 1 ? { scale: 1.1, backgroundColor: "rgba(254, 215, 170, 0.7)" } : {}}
                        >
                            <FontAwesomeIcon icon={faChevronRight} />
                        </motion.button>
                    </div>
                </motion.div>

                {/* Pen icon decoration */}
                <motion.div
                    className="absolute bottom-16 right-6 text-4xl text-amber-700/30 rotate-45 pointer-events-none"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                >
                    <FontAwesomeIcon icon={faPenFancy} />
                </motion.div>

                {/* Action Buttons at Bottom with animations */}
                <div className="absolute bottom-4 w-full flex justify-between px-16">
                    <motion.button
                        className="px-5 py-2 bg-amber-800 text-white rounded-md flex items-center font-serif shadow-md"
                        onClick={() => navigate("/diary/folders")}
                        variants={buttonHoverVariants}
                        whileHover="hover"
                        whileTap="tap"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1, duration: 0.5 }}
                    >
                        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                        Back to Folders
                    </motion.button>

                    <motion.button
                        className="px-6 py-2 bg-amber-600 text-white rounded-md font-serif shadow-md flex items-center"
                        onClick={handleSave}
                        disabled={isSaving}
                        variants={buttonHoverVariants}
                        whileHover="hover"
                        whileTap="tap"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1, duration: 0.5 }}
                    >
                        {isSaving ? (
                            <span>Saving...</span>
                        ) : (
                            <>
                                <FontAwesomeIcon icon={faSave} className="mr-2" />
                                Save Entry
                            </>
                        )}
                    </motion.button>
                    <RouterLink to="/diaryreport" >
                        <motion.button
                            className="px-6 py-2 bg-amber-600 text-white rounded-md font-serif shadow-md flex items-center"
                            variants={buttonHoverVariants}
                            whileHover="hover"
                            whileTap="tap"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1, duration: 0.5 }}
                        >
                            <FontAwesomeIcon icon={faSave} className="mr-2" />
                            Generate Report
                        </motion.button>
                    </RouterLink>
                </div>

                {/* Save confirmation notification */}
                <AnimatePresence>
                    {showSavedNotification && (
                        <motion.div
                            className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-green-100 text-green-800 px-6 py-2 rounded-full shadow-lg"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            Entry saved successfully!
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Corner curl effect */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-amber-200/50 to-transparent pointer-events-none"></div>
            </div>
        </MotionConfig>
    );
};

export default Diary;