# backend/Dockerfile
FROM tensorflow/tensorflow:latest

WORKDIR /app

# (A) Build-time için wget + tar kur
RUN apt-get update && apt-get install -y wget tar \
 && rm -rf /var/lib/apt/lists/*

# (B) Bağımlılıkları kur
COPY requirements.txt .
RUN pip install --upgrade pip setuptools \
 && pip install --no-cache-dir tensorflow-hub \
 && pip install --no-cache-dir --ignore-installed -r requirements.txt

# (C) YAMNet modelini build aşamasında indir ve aç
RUN mkdir yamnet_module \
 && wget -qO yamnet.tar.gz "https://tfhub.dev/google/yamnet/1?tf-hub-format=compressed" \
 && tar -xzf yamnet.tar.gz -C yamnet_module \
 && rm yamnet.tar.gz

# (D) Class map CSV'sini indir
RUN wget -qO yamnet_module/yamnet_class_map.csv \
    https://raw.githubusercontent.com/tensorflow/models/master/research/audioset/yamnet/yamnet_class_map.csv

# (E) Son olarak tüm kodu kopyala
COPY . .

EXPOSE 5000
CMD ["python", "app.py"]
