from flask import Flask, request, jsonify
from flask_cors import CORS
import traceback
import tensorflow_hub as hub
import tensorflow as tf
import numpy as np
import librosa
import soundfile as sf
import uuid, os

app = Flask(__name__)
CORS(app)

yamnet_model = hub.load('yamnet_module')

class_map_path = 'yamnet_module/yamnet_class_map.csv'

with open(class_map_path, 'r') as f:
    class_names = [l.strip().split(',')[2] for l in f.readlines()[1:]]

def load_audio(file_path):
    # tek adımda dosyayı oku, mono’ya çevir ve 16 kHz’e yeniden örnekle
    wav, sr = librosa.load(file_path, sr=16000, mono=True)
    return wav

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    f = request.files['file']
    tmp = f"/tmp/{uuid.uuid4().hex}.wav"
    f.save(tmp)

    try:
        waveform = load_audio(tmp)
        scores, _, _ = yamnet_model(waveform)
        scores_np = scores.numpy().mean(axis=0)
        idx = np.argmax(scores_np)
        conf = float(scores_np[idx])
        label = class_names[idx]
        if conf < 0.25:
            label = "Unknown"
        return jsonify({'genre': label, 'confidence': conf})
    finally:
        if os.path.exists(tmp):
            os.remove(tmp)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # mevcut kodun...
        waveform = load_audio(tmp)
        # ...
    except Exception as e:
        tb = traceback.format_exc()
        return jsonify({'error': str(e), 'trace': tb}), 500
