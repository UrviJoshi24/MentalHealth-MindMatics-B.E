import { useState, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import videobgimage from "../assets/images/video-bg-1.jpg";
import api from "../api";
import { ACCESS_TOKEN } from "../constants";

const VideoDetection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("upload");

  // Upload State
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedBlob, setUploadedBlob] = useState(null);

  // Recording State
  const [recording, setRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState(null);
  const [stream, setStream] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  // Prediction State
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [results, setResults] = useState(null);

  // Cleanup stream when modal closes
  useEffect(() => {
    if (!isModalOpen && stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  }, [isModalOpen]);

  // Handle File Upload
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "video/mp4": [".mp4"], "video/webm": [".webm"], "video/ogg": [".ogg"] },
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setUploadedFile(URL.createObjectURL(file));
        setUploadedBlob(file); // Save actual file for uploading
      }
    },
  });

  // Start Video Recording
  const startRecording = async () => {
    try {
      const userStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(userStream);
      mediaRecorderRef.current = new MediaRecorder(userStream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const recordedBlob = new Blob(chunksRef.current, { type: "video/webm" });
        setRecordedVideo(URL.createObjectURL(recordedBlob));
        setUploadedBlob(recordedBlob);
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Camera access denied or unavailable.");
    }
  };

  // Stop Video Recording
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setRecording(false);
  };

  // Handle Prediction
  const handlePredict = async () => {
    if (!uploadedFile && !recordedVideo) {
      setMessage({ type: "error", text: "Please upload or record a video!" });
      return;
    }
  
    setLoading(true);
    setMessage(null);
    setResults(null);
  
    const formData = new FormData();
  
    // If an uploaded file exists, append it
    if (uploadedFile) {
      const response = await fetch(uploadedFile);
      const blob = await response.blob();
      formData.append("video", blob, "uploaded_video.webm");
    }
  
    // If a recorded video exists, append it
    if (recordedVideo) {
      const response = await fetch(recordedVideo);
      const blob = await response.blob();
      formData.append("video", blob, "recorded_video.webm");
    }
  
    try {
      const response = await api.post("/video/predict_emotion/", formData, {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "multipart/form-data",
        },
      });
  
      // Ensure both the emotion detection and mental health scores are stored
      setResults({
        detected_emotions: response.data.detected_emotions,
        mental_health_scores: response.data.mental_health_scores,
      });
  
      setMessage({ type: "success", text: "Prediction successful!" });
    } catch (error) {
      setMessage({ type: "error", text: "Something went wrong!" });
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="h-screen bg-cover bg-center flex flex-col items-center text-center p-6"
      style={{ backgroundImage: `url(${videobgimage})` }}>
      
      <h1 className="text-3xl font-bold mt-6 text-green-600">Video Emotion Detection</h1>
      <p className="text-lg mt-4 max-w-2xl text-blue-600">
        Video-based emotion detection helps in mental health analysis by recognizing emotions 
        in real-time, aiding therapy, AI mental health assistants, and stress monitoring.
      </p>

      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          Game - Video Emotion Detection
        </button>
        <button className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
          onClick={() => setIsModalOpen(true)}>
          Upload / Record Video
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[500px] max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 text-center">Upload or Record Video</h2>

            {/* Tab Switch */}
            <div className="flex justify-center mb-4">
              <button className={`px-4 py-2 ${selectedTab === "upload" ? "bg-gray-300" : "bg-gray-200"} rounded-l-lg`}
                onClick={() => setSelectedTab("upload")}>
                Upload Video
              </button>
              <button className={`px-4 py-2 ${selectedTab === "record" ? "bg-gray-300" : "bg-gray-200"} rounded-r-lg`}
                onClick={() => setSelectedTab("record")}>
                Record Video
              </button>
            </div>

            {/* Upload Video */}
            {selectedTab === "upload" && (
              <div {...getRootProps()} className="border-2 border-dashed border-gray-500 p-6 text-center cursor-pointer">
                <input {...getInputProps()} />
                <p>Drag & drop a video file here, or click to select a file</p>
                {uploadedFile && <video src={uploadedFile} controls className="mt-4 w-full rounded-lg" />}
              </div>
            )}

            {/* Record Video */}
            {selectedTab === "record" && (
              <div className="flex flex-col items-center">
                {stream && recording ? (
                  <video ref={(video) => video && (video.srcObject = stream)} autoPlay className="mt-4 w-full rounded-lg" />
                ) : recordedVideo ? (
                  <video src={recordedVideo} controls className="mt-4 w-full rounded-lg" />
                ) : null}

                {!recording && !recordedVideo && (
                  <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600" onClick={startRecording}>
                    Start Recording
                  </button>
                )}
                {recording && (
                  <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 mt-2" onClick={stopRecording}>
                    Stop Recording
                  </button>
                )}
              </div>
            )}

            {/* Predict Button */}
            <button className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              onClick={handlePredict} disabled={loading}>
              {loading ? "Processing..." : "Predict/Detect"}
            </button>

            <button className="mt-4 w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              onClick={() => setIsModalOpen(false)}>Close</button>

            {message && <div className={`mt-4 p-2 rounded-md text-center ${message.type === "error" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>{message.text}</div>}
            {results && (
  <div className="mt-4 text-left">
    <h3 className="text-lg font-bold">Results:</h3>
    
    {/* Mental Health Scores */}
    <h4 className="font-semibold mt-2">Mental Health Scores:</h4>
    <div className="mt-2 bg-gray-100 p-2 rounded">
      <pre>{JSON.stringify(results.mental_health_scores, null, 2)}</pre>
    </div>

    {/* Detected Emotions */}
    <h4 className="font-semibold mt-2">Detected Emotions:</h4>
    <div className="mt-2 bg-gray-100 p-2 rounded">
      <pre>{JSON.stringify(results.detected_emotions, null, 2)}</pre>
    </div>
  </div>
)}

          </div>
        </div>
      )}
    </div>
  );
};

export default VideoDetection;
