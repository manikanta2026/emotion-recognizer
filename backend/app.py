import os
import json
import pickle
import warnings
import numpy as np
import librosa
import librosa.display
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend that's thread-safe
import matplotlib.pyplot as plt
import base64
from io import BytesIO
from flask import Flask, request, jsonify
from flask_cors import CORS  # Added CORS import
import tensorflow as tf
import sys

# Enforce Python 3.12+
if not (sys.version_info.major == 3 and sys.version_info.minor == 12):
    sys.exit("This script requires Python 3.12.x")

# Suppress warnings and TF logs
warnings.filterwarnings("ignore", category=UserWarning, module="sklearn")
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024  # Max 10MB upload

# Load model and label encoder once at startup
script_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(script_dir, "models", "ann_new_emotion_recognition_model.h5")
label_encoder_path = os.path.join(script_dir, "models", "new_label_encoder (1).pkl")

model = tf.keras.models.load_model(model_path, compile=False)
with open(label_encoder_path, 'rb') as f:
    label_encoder = pickle.load(f)

def extract_features(audio, sample_rate, max_len=40):
    # Extract MFCCs
    mfccs = librosa.feature.mfcc(y=audio, sr=sample_rate, n_mfcc=20)
    mfccs = np.mean(mfccs.T, axis=0)

    # Extract Chroma
    chroma = librosa.feature.chroma_stft(y=audio, sr=sample_rate)
    chroma = np.mean(chroma.T, axis=0)

    # Extract Spectral Contrast
    contrast = librosa.feature.spectral_contrast(y=audio, sr=sample_rate)
    contrast = np.mean(contrast.T, axis=0)

    # Extract Zero-Crossing Rate
    zcr = librosa.feature.zero_crossing_rate(y=audio)
    zcr = np.mean(zcr.T, axis=0)

    # Extract Spectral Centroid
    centroid = librosa.feature.spectral_centroid(y=audio, sr=sample_rate)
    centroid = np.mean(centroid.T, axis=0)

    # Extract Spectral Rolloff
    rolloff = librosa.feature.spectral_rolloff(y=audio, sr=sample_rate, roll_percent=0.85)
    rolloff = np.mean(rolloff.T, axis=0)

    # Extract RMS Energy
    rms = librosa.feature.rms(y=audio)
    rms = np.mean(rms.T, axis=0)

    features = np.concatenate([mfccs, chroma, contrast, zcr, centroid, rolloff, rms])

    # Pad or trim to fixed length
    if len(features) < max_len:
        features = np.pad(features, (0, max_len - len(features)), mode='constant')
    else:
        features = features[:max_len]

    return features

def generate_base64_image(fig):
    buf = BytesIO()
    fig.savefig(buf, format='png')
    buf.seek(0)
    img_str = base64.b64encode(buf.read()).decode('utf-8')
    buf.close()
    plt.close(fig)
    return img_str

def save_mel_spectrogram(audio, sample_rate):
    fig = plt.figure(figsize=(10, 4))
    ax = fig.add_subplot(111)
    S = librosa.feature.melspectrogram(y=audio, sr=sample_rate, n_mels=128, fmax=8000)
    S_dB = librosa.power_to_db(S, ref=np.max)
    img = librosa.display.specshow(S_dB, sr=sample_rate, x_axis='time', y_axis='mel', ax=ax)
    fig.colorbar(img, format='%+2.0f dB', ax=ax)
    ax.set_title('Mel Spectrogram')
    fig.tight_layout()
    return generate_base64_image(fig)

def save_polar_plot(emotion_probabilities):
    emotions = list(emotion_probabilities.keys())
    probabilities = list(emotion_probabilities.values())

    angles = np.linspace(0, 2 * np.pi, len(emotions), endpoint=False).tolist()
    angles += angles[:1]
    probabilities += probabilities[:1]

    fig = plt.figure(figsize=(8, 8))
    ax = fig.add_subplot(111, projection='polar')
    ax.fill(angles, probabilities, color='skyblue', alpha=0.4)
    ax.plot(angles, probabilities, color='blue', linewidth=2)

    ax.set_yticks([20, 40, 60, 80])
    ax.set_yticklabels(["20%", "40%", "60%", "80%"], color="gray", fontsize=10)
    ax.set_xticks(angles[:-1])
    ax.set_xticklabels(emotions, fontsize=12, color="darkblue")

    ax.set_title("Emotion Probabilities", va='bottom', fontsize=14, color="darkblue")
    fig.tight_layout()

    return generate_base64_image(fig)

@app.route('/predict-emotion', methods=['POST'])
def predict_emotion_endpoint():
    if 'audio' not in request.files:
        return jsonify({"error": "No audio file part in the request"}), 400

    file = request.files['audio']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    try:
        # Load audio file from in-memory file
        audio_bytes = file.read()
        audio_np, sample_rate = librosa.load(BytesIO(audio_bytes), sr=None, res_type='kaiser_fast')

        features = extract_features(audio_np, sample_rate)
        features = np.expand_dims(features, axis=0)

        predictions = model.predict(features, verbose=0)
        predicted_class = np.argmax(predictions[0])
        predicted_emotion = label_encoder.inverse_transform([predicted_class])[0]

        emotion_probabilities = {
            label_encoder.inverse_transform([i])[0]: float(pred * 100)
            for i, pred in enumerate(predictions[0])
        }

        mel_spectrogram_base64 = save_mel_spectrogram(audio_np, sample_rate)
        polar_plot_base64 = save_polar_plot(emotion_probabilities)

        result = {
            "emotion": predicted_emotion,
            "probabilities": emotion_probabilities,
            "melSpectrogramBase64": mel_spectrogram_base64,
            "polarPlotBase64": polar_plot_base64
        }
        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    print("Emotion Recognition API running at http://localhost:5000")
    # Use threaded=False if matplotlib threading issues persist
    app.run(port=5000, debug=True)