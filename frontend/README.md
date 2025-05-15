# Voice Vista - Emotion Recognition from Speech

A web application that recognizes emotions from speech using an Artificial Neural Network (ANN) model.

## Overview

Voice Vista is a deep learning-based emotion recognition system that analyzes audio input to detect human emotions. The system processes speech signals and predicts emotions such as happiness, sadness, anger, and more.

## Features

- Real-time audio recording
- Audio file upload support (WAV, MP3)
- Visual feedback through mel spectrograms
- Emotion probability visualization using polar plots
- Responsive web interface

## Technical Architecture

### Frontend
- Built with React + Vite
- Real-time audio recording using react-media-recorder
- File upload handling with react-dropzone
- Interactive visualizations using Chart.js

### Backend
- Express.js server
- Python-based inference engine
- LibROSA for audio feature extraction 

### Model Architecture
The emotion recognition model uses an Artificial Neural Network (ANN) with:
- Input features: MFCCs, Chroma, Spectral Contrast, Zero-Crossing Rate, etc.
- Multiple dense layers with ReLU activation
- Softmax output layer for emotion classification
- Trained on speech emotion recognition datasets

## Audio Features Extracted
- Mel-frequency cepstral coefficients (MFCCs)
- Chromagram
- Spectral Contrast
- Zero-Crossing Rate
- Spectral Centroid
- Spectral Rolloff
- RMS Energy

## Setup and Installation

1. Clone the repository
2. Install frontend dependencies:
cd frontend
npm install
3. Install backend dependencies:
cd backend
npm install
pip install -r requirements.txt
4. Start the development servers:
# Frontend
npm run dev

# Backend
node server.js

## Environment Variables
Create a `.env` file in the frontend directory:
VITE_BACKEND_URL=http://localhost:5000

## Dependencies
### Frontend
- React
- Vite
- Chart.js
- React Router
- Axios

### Backend
- Express.js
- Python 3.8+
- TensorFlow
- LibROSA
- NumPy
- Matplotlib  

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## Authors
- [Manikanta](https://github.com/manikanta2026)

## Acknowledgments  
TensorFlow team for the deep learning framework
- LibROSA team for audio processing capabilities
- The open-source community for various tools and libraries used in this project