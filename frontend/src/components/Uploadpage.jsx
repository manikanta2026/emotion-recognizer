import { useDropzone } from 'react-dropzone';
import { useState } from 'react';
import axios from 'axios';
import inputfileLogo from '../assets/inputfile.svg';

function UploadPage() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [melSpectrogramBase64, setMelSpectrogramBase64] = useState(null);
  const [polarPlotBase64, setPolarPlotBase64] = useState(null);
  const [error, setError] = useState("");

  const backendBaseUrl = import.meta.env.VITE_BACKEND_URL;

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      setUploadedFileName(file.name);
      setPrediction(null); // Clear previous prediction when new file is uploaded
      setMelSpectrogramBase64(null);
      setPolarPlotBase64(null);
      setError("");
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: '.wav,.mp3,.mp4',
    maxSize: 10485760,
  });

  const handlePrediction = async () => {
    if (!uploadedFile) {
      setError("Please upload an audio/video file first.");
      return;
    }

    const formData = new FormData();
    formData.append("audio", uploadedFile);

    try {
      setLoading(true);
      const response = await axios.post(`${backendBaseUrl}/predict-emotion`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setPrediction(response.data);
      setMelSpectrogramBase64(response.data.melSpectrogramBase64);
      setPolarPlotBase64(response.data.polarPlotBase64);
    } catch (error) {
      console.error("Error predicting emotion:", error);
      alert("Failed to predict emotion. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const clearUpload = () => {
    setUploadedFile(null);
    setUploadedFileName("");
    setPrediction(null);
  };

  return (
    <div className="upload-page">
      <h2>Upload Audio File</h2>
      {error && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          {error}
        </div>
      )}
      <div {...getRootProps({ className: 'upload-zone' })}>
        <input {...getInputProps()} />
        <p style={{ color: uploadedFile ? 'gray' : 'black' }}>
          <img src={inputfileLogo} alt='' style={{ marginRight: '10px' }} />
          {uploadedFile ? "" : "Click to upload or drag and drop WAV, MP3, MP4 up to 10MB"}
        </p>
        {uploadedFileName && <p>Uploaded File: {uploadedFileName}</p>}
      </div>

      {uploadedFile && (
        <div className="preview">
          <h3>Preview Audio</h3>
          <audio controls src={URL.createObjectURL(uploadedFile)}>
            Your browser does not support the audio element.
          </audio>
        </div>
      )}

      <div className="button-container">
        {uploadedFile && (
          <button onClick={clearUpload} className="predict-button">
            Clear Upload
          </button>
        )}
        <button 
          onClick={handlePrediction} 
          className="predict-button" 
          disabled={loading || !uploadedFile}
        >
          {loading ? "Predicting..." : "Predict Emotion"}
        </button>
      </div>

      {prediction && (
        <div className="prediction-result">
          <h3>
            Predicted Emotion: {prediction.emotion.toUpperCase()}
            {prediction.probabilities && ` (${prediction.probabilities[prediction.emotion].toFixed(2)}%)`}
          </h3>

          <div className="probabilities-table">
            <h4>All Emotion Probabilities</h4>
            <table>
              <thead>
                <tr>
                  <th>Emotion</th>
                  <th>Probability</th>
                </tr>
              </thead>
              <tbody>
                {prediction.probabilities &&
                  Object.entries(prediction.probabilities)
                    .sort(([, a], [, b]) => b - a)
                    .map(([emotion, probability]) => (
                      <tr key={emotion} className={emotion === prediction.emotion ? 'predicted-emotion' : ''}>
                        <td>{emotion.toUpperCase()}</td>
                        <td>{probability.toFixed(2)}%</td>
                      </tr>
                    ))
                }
              </tbody>
            </table>
          </div>

          <div className="plots-container">
            {melSpectrogramBase64 && (
              <div className="plot-item">
                <h4>Mel Spectrogram</h4>
                <div className="mel-spectrogram">
                  <img src={`data:image/png;base64,${melSpectrogramBase64}`} alt="Mel Spectrogram" />
                </div>
              </div>
            )}
            {polarPlotBase64 && (
              <div className="plot-item">
                <h4>Emotion Probabilities</h4>
                <div className="emotion-chart">
                  <img src={`data:image/png;base64,${polarPlotBase64}`} alt="Emotion Probabilities" />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default UploadPage;