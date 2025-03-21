import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
const Diary = () => {
    const [entry, setEntry] = useState("");
    const [entries, setEntries] = useState([]);
    useEffect(() => {
        const fetchEntries = async () => {
            try {
                const response = await fetch("http://localhost:8000/diary/");
                const data = await response.json();
                setEntries(data);
            } catch (error) {
                console.error("Error fetching diary entries:", error);
            }
        };
        fetchEntries();
    }, []);
    const handleSave = async () => {
        if (!entry.trim()) return;
        try {
            const response = await fetch("http://localhost:8000/diary/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ content: entry }),
            });
            if (response.ok) {
                const newEntry = await response.json();
                setEntries([newEntry, ...entries]);
                setEntry("");
            }
        } catch (error) {
            console.error("Error saving diary entry:", error);
        }
    };
    return (
        <div className="min-h-screen bg-cover flex flex-col items-center justify-center py-10 px-5" style={{ backgroundImage: "url('https://cdn.pixabay.com/photo/2016/03/01/11/07/paper-1230086_1280.jpg')", backgroundSize: 'cover' }}>
            {/* Background image applied here */}
            <div className="w-full max-w-2xl bg-orange-900 bg-opacity-40 p-5 rounded-lg shadow-lg backdrop-blur-md opacity-90 flex flex-col items-start pt-8">
                {/* Flexbox layout applied here */}
                {/* <button
          onClick={() => window.location.href = '/'} // Redirect to homepage
          className="mt-3 w-48 py-2 px-5 text-black rounded-lg bg-white italic transition-all border-2 border-gray-200 "
        >
          <FontAwesomeIcon icon={faArrowLeft} size="lg" /> Back to home
        </button> */}
                <h1 className="text-3xl font-bold mb-6 text-black italic">My Diary</h1>
                <div className="w-full max-w-2xl flex flex-col items-center">
                    <textarea
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-0 focus:border-gray-500 italic bg-transparent text-black placeholder-black"
                        rows="5"
                        placeholder="Write your thoughts here..."
                        value={entry}
                        onChange={(e) => setEntry(e.target.value)}
                    ></textarea>
                    <button
                        className="mt-4 w-48 py-2 px-5 font-semibold text-black rounded-lg bg-white italic transition-all border-2 border-gray-200 bg-transparent 
                         hover:bg-white hover:font-bold"
                        //hover:bg-gradient-to-r hover:from-white hover:to-orange-200 font-bold"
                        onClick={handleSave}
                    >
                        Save the memory!
                    </button>
                </div>
            <button
                onClick={() => window.location.href = '/home'} // Redirect to homepage
                className=" mt-3 w-30 py-2 px-5 text-black self-end rounded-lg bg-white italic transition-all border-2 border-gray-200
                            hover:bg-orange-900 hover:font-bold hover:text-white"
            >
                <FontAwesomeIcon icon={faArrowLeft} size="lg" /> Back to home
            </button>
            </div>
            {/* <div className="mt-6 w-full max-w-2xl">
        <h2 className="text-xl font-semibold mb-4 text-black">Previous Entries</h2>
        {entries.length > 0 ? (
          entries.map((item, index) => (
            <div key={index} className="bg-white bg-opacity-70 p-4 rounded-lg shadow-md mb-3">
              <p className="text-gray-700">{item.content}</p>
              <p className="text-gray-500 text-sm mt-2">{item.date}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No entries yet.</p>
        )}
      </div> */}
        </div>
    );
};
export default Diary;
// import { useState, useEffect } from "react";
// const Diary = () => {
//   const [entry, setEntry] = useState("");
//   const [entries, setEntries] = useState([]);
//   useEffect(() => {
//     const fetchEntries = async () => {
//       try {
//         const response = await fetch("http://localhost:8000/diary/");
//         const data = await response.json();
//         setEntries(data);
//       } catch (error) {
//         console.error("Error fetching diary entries:", error);
//       }
//     };
//     fetchEntries();
//   }, []);
//   const handleSave = async () => {
//     if (!entry.trim()) return;
//     try {
//       const response = await fetch("http://localhost:8000/diary/", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ content: entry }),
//       });
//       if (response.ok) {
//         const newEntry = await response.json();
//         setEntries([newEntry, ...entries]);
//         setEntry("");
//       }
//     } catch (error) {
//       console.error("Error saving diary entry:", error);
//     }
//   };
//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-5">
//       <h1 className="text-3xl font-bold mb-6">My Diary</h1>
//       <div className="w-full max-w-2xl bg-white p-5 rounded-lg shadow-md">
//         <textarea
//           className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300 bg-white"
//           style={{
//             background: "repeating-linear-gradient(to bottom, transparent, transparent 1.5rem, #e5e7eb 1.5rem, #e5e7eb 1.6rem)",
//             lineHeight: "1.9rem",
//             paddingTop: "1rem", // Adds padding to align text with the lines
//             paddingBottom: "1rem", // Adds padding to ensure bottom alignment
//             paddingLeft: "1rem", // Adds space from the left border
//             paddingRight: "1rem", // Adds space from the right border
//           }}
//           rows="5"
//           placeholder="Write your thoughts here..."
//           value={entry}
//           onChange={(e) => setEntry(e.target.value)}
//         ></textarea>
//         <button
//           className="mt-3 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
//           onClick={handleSave}
//         >
//           Save Entry
//         </button>
//       </div>
//       <div className="mt-6 w-full max-w-2xl">
//         <h2 className="text-xl font-semibold mb-4">Previous Entries</h2>
//         {entries.length > 0 ? (
//           entries.map((item, index) => (
//             <div key={index} className="bg-white p-4 rounded-lg shadow-md mb-3">
//               <p className="text-gray-700">{item.content}</p>
//               <p className="text-gray-500 text-sm mt-2">{item.date}</p>
//             </div>
//           ))
//         ) : (
//           <p className="text-gray-500">No entries yet.</p>
//         )}
//       </div>
//     </div>
//   );
// };
// export default Diary;