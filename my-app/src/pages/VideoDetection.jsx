import { useState, useRef, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
// import videobgimage from "../assets/images/video-bg-1.jpg";
import api from "../api";
import { ACCESS_TOKEN } from "../constants";
import CustomCallRecordButton from "../components/CustomCallRecordButton";
const VideoDetection = () => {
  const [selectedTab, setSelectedTab] = useState("upload");
  const [videoFile, setVideoFile] = useState({ preview: null, blob: null });
  const [recording, setRecording] = useState(false);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [stream, setStream] = useState(null);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    };
  }, [stream]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "video/mp4": [".mp4"], "video/webm": [".webm"], "video/ogg": [".ogg"] },
    multiple: false,
    onDrop: useCallback(acceptedFiles => {
      if (acceptedFiles.length) {
        const file = acceptedFiles[0];
        setVideoFile({ preview: URL.createObjectURL(file), blob: file });
      }
    }, []),
  });

  const startRecording = async () => {
    try {
      const userStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(userStream);
      mediaRecorderRef.current = new MediaRecorder(userStream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = e => e.data.size > 0 && chunksRef.current.push(e.data);
      mediaRecorderRef.current.onstop = () => {
        const recordedBlob = new Blob(chunksRef.current, { type: "video/webm" });
        setVideoFile({ preview: URL.createObjectURL(recordedBlob), blob: recordedBlob });
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Camera access denied or unavailable.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    stream?.getTracks().forEach(track => track.stop());
    setStream(null);
    setRecording(false);
  };

  const handlePredict = async () => {
    if (!videoFile.blob) {
      setMessage({ type: "error", text: "Please upload or record a video!" });
      return;
    }

    setLoading(true);
    setMessage(null);
    setResults(null);

    const formData = new FormData();
    formData.append("video", videoFile.blob, "video.webm");

    try {
      const response = await api.post("/video/predict_emotion/", formData, {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setResults(response.data);
      setMessage({ type: "success", text: "Prediction successful!" });
    } catch {
      setMessage({ type: "error", text: "Something went wrong!" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-cover" >
      <h1 className="text-3xl font-bold mt-6 text-green-600">Video Emotion Detection</h1>
      <p className="text-lg mt-4 max-w-2xl text-blue-600">
        Detect emotions from videos in real-time for mental health analysis.
      </p>

      <div className="mt-6 flex flex-col items-center">
        <div className="flex justify-center mb-4">
          {["upload", "record"].map(tab => (
            <button
              key={tab}
              className={`px-4 py-2 ${selectedTab === tab ? "bg-gray-300" : "bg-gray-200"} rounded-lg`}
              onClick={() => setSelectedTab(tab)}
            >
              {tab === "upload" ? "Upload Video" : "Record Video"}
            </button>
          ))}
        </div>

        {selectedTab === "upload" && (
          <div {...getRootProps()} className="border-2 border-dashed border-gray-500 p-6 text-center cursor-pointer">
            <input {...getInputProps()} />
            <p>Drag & drop a video file here, or click to select a file</p>
            {videoFile.preview && <video src={videoFile.preview} controls className="mt-4 w-full rounded-lg" />}
          </div>
        )}

        {selectedTab === "record" && (
          <div className="flex flex-col items-center">
            {stream && recording ? (
              <video ref={video => video && (video.srcObject = stream)} autoPlay className="mt-4 w-full rounded-lg" />
            ) : videoFile.preview ? (
              <video src={videoFile.preview} controls className="mt-4 w-full rounded-lg" />
            ) : null}

            {!recording && !videoFile.preview && (
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

        <button className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600" onClick={handlePredict} disabled={loading}>
          {loading ? "Processing..." : "Predict/Detect"}
        </button>

        {message && <div className={`mt-4 p-2 rounded-md text-center ${message.type === "error" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>{message.text}</div>}

        {results && (
          <div className="mt-4 text-left">
            <h3 className="text-lg font-bold">Results:</h3>
            <div className="mt-2 bg-gray-100 p-2 rounded">
              <h4 className="font-semibold">Mental Health Scores:</h4>
              <pre>{JSON.stringify(results.mental_health_scores, null, 2)}</pre>
            </div>
            <div className="mt-2 bg-gray-100 p-2 rounded">
              <h4 className="font-semibold">Detected Emotions:</h4>
              <pre>{JSON.stringify(results.detected_emotions, null, 2)}</pre>
            </div>
          </div>
        )}
        <CustomCallRecordButton/>
      </div>
    </div>
    
  );
};

export default VideoDetection;
