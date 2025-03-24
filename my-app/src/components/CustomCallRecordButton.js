import { useRecordWebcam } from "react-record-webcam";

const CustomCallRecordButton = () => {
  const {
    createRecording,
    openCamera,
    startRecording,
    stopRecording,
    downloadRecording,
    closeCamera,
  } = useRecordWebcam();

  const recordVideo = async () => {
    const recording = await createRecording();
    if (!recording.id) {
      console.error("Recording creation failed");
      return;
    }

    console.log("Opening camera...");
    await openCamera(recording.id);

    console.log("Starting recording...");
    await startRecording(recording.id);

    await new Promise((resolve) => setTimeout(resolve, 100)); // Record for 3 sec

    console.log("Stopping recording...");
    await stopRecording(recording.id);
    console.log("Recording stopped");

    console.log("Downloading recording...");
    await downloadRecording(recording.id);

    console.log("Closing camera...");
    await closeCamera(recording.id);
    console.log("Camera closed!");
  };

  return <button onClick={recordVideo}>Record Video</button>;
};

export default CustomCallRecordButton;
