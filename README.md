# 🎙️ Voice Vista – Emotion Recognition from Speech

Voice Vista is an AI-powered web application that identifies human emotions from speech using a deep learning model. Whether you upload an audio file or record your voice in real-time, Voice Vista will analyze it and predict emotional states like happiness, sadness, anger, and more.

---

## 🌟 Features

- 🎤 Real-time audio recording and playback
- 📁 Upload support for WAV and MP3 files
- 🌈 Visual feedback with mel spectrograms
- 📊 Emotion probability graphs (polar plots)
- 💻 Modern, responsive interface built with React + Vite

---

## 🧠 How It Works

Voice Vista processes your speech audio by extracting key features and feeding them into a trained Artificial Neural Network (ANN) that predicts emotion labels based on probability scores.

---

## 🏗️ Technical Architecture

### 🔹 Frontend
- ⚛️ React + Vite
- ⬆️ `react-dropzone` for audio file uploads

### 🔹 Backend
- 🌐 Flask for API handling
- 🐍 Python-based inference engine
- 🎧 LibROSA for audio feature extraction
- 🧠 TensorFlow for emotion classification

---

## 🧬 Model Details

The ANN is trained on speech emotion datasets using the following:

- 🎼 **Input Features**:
  - MFCCs (Mel-frequency cepstral coefficients)
  - Chromagram
  - Spectral Contrast
  - Zero-Crossing Rate
  - RMS Energy
  - Spectral Centroid & Rolloff

- 🧱 **Architecture**:
  - Multiple dense layers (ReLU)
  - Dropout for regularization
  - Softmax layer for classification output

---

## 🔊 Extracted Audio Features

| Feature              | Description                                |
|----------------------|--------------------------------------------|
| MFCCs                | Capture timbral and phonetic info          |
| Chromagram           | Pitch content of the signal                |
| Spectral Contrast    | Difference between spectral peaks/valleys |
| Zero-Crossing Rate   | Signal frequency content                   |
| Spectral Centroid    | Brightness of the sound                    |
| Spectral Rolloff     | High frequency content                     |
| RMS Energy           | Power of the signal                        |

---

## 🧪 Live Demo

👉 [Try it here](https://emorecweb.onrender.com/)

## ⚙️ Setup & Installation

1. **Clone the repository**
```bash
git clone https://github.com/manikanta2026/voice-vista
```
## ⚙️ Setup & Installation

### 🔧 Install Frontend Dependencies
```bash
cd frontend
npm install
```

### 🔧 Install Backend Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 🚀 Run the Development Servers

#### Frontend
```bash
npm run dev
```

#### Backend
```bash
python app.py
```

---

## 🌐 Environment Variables

Create a `.env` file in the `frontend` directory and add the following:

```env
VITE_BACKEND_URL=http://localhost:5000
```

---

## 📦 Dependencies

### Frontend
- ⚛️ React  
- 💨 Tailwind CSS  
- ⚡ Vite

### Backend
- Flask
- Python 3.8+
- TensorFlow
- LibROSA
- NumPy
- Matplotlib

## 🤝 Contributing

We welcome all contributions!  
If you have ideas or improvements, fork the repo and create a pull request. ⭐

## Authors
- [Manikanta](https://github.com/manikanta2026)

## Acknowledgments  
- TensorFlow team for the deep learning framework
- LibROSA team for audio processing capabilities
- The open-source community for various tools and libraries used in this project

